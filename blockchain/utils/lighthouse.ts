'use client'
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../constants'
import { MetaMaskInpageProvider } from '@metamask/providers'
import axios, { AxiosError } from 'axios'

const API_KEY = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || '';

if (!API_KEY) {
    throw new Error('Lighthouse API key is not set');
}

// Axiosのデフォルト設定を確認
console.log('Axios defaults:', {
    baseURL: axios.defaults.baseURL,
    headers: axios.defaults.headers,
    timeout: axios.defaults.timeout
});

// Axiosインターセプターを追加
axios.interceptors.request.use(request => {
    console.log('Axios Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers
    });
    return request;
});

axios.interceptors.response.use(
    response => response,
    error => {
        console.error('Axios Error Interceptor:', {
            config: error.config,
            response: error.response,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export async function uploadToLighthouse(file: File) {
    try {
        // APIエンドポイントの状態を確認
        try {
            const healthCheck = await axios.get('https://node.lighthouse.storage/api/health');
            console.log('Lighthouse API Health:', healthCheck.data);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Lighthouse API Health Check Failed:', {
                message: axiosError.message,
                response: axiosError.response?.data,
                status: axiosError.response?.status
            });
        }

        const formData = new FormData();
        formData.append('file', file);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        };

        try {
            const response = await axios.post(
                'https://node.lighthouse.storage/api/v0/add',
                formData,
                config
            );
            console.log('Direct upload response:', response.data);
            return `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Direct upload error:', {
                message: axiosError.message,
                response: axiosError.response?.data,
                status: axiosError.response?.status,
                config: axiosError.config
            });
            throw axiosError;
        }

    } catch (error) {
        console.error('General error:', error);
        throw error;
    }
}

export async function uploadMetadataToLighthouse(metadata: any) {
    try {
        const metadataBlob = new Blob([JSON.stringify(metadata)], {
            type: 'application/json'
        });
        const metadataFile = new File([metadataBlob], 'metadata.json', {
            type: 'application/json'
        });

        const formData = new FormData();
        formData.append('file', metadataFile);

        const output = await lighthouse.upload(
            formData,  // FormDataオブジェクトを渡す
            API_KEY
        );

        if (!output.data?.Hash) {
            throw new Error('Invalid response from Lighthouse');
        }

        return `https://gateway.lighthouse.storage/ipfs/${output.data.Hash}`;

    } catch (error: any) {
        console.error('Metadata upload error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
}

export async function mintNFT(
    eventId: number,
    imageFile: File,
    name: string,
    description: string,
    creatorAddress: string
) {
    try {
        console.log('Starting NFT minting process...');

        // MetaMaskの存在確認
        if (!window.ethereum) {
            throw new Error('MetaMaskが見つかりません');
        }

        // 1. 画像をLighthouseにアップロード
        const imageUrl = await uploadToLighthouse(imageFile);
        console.log('Image uploaded:', imageUrl);

        // 2. メタデータを作成
        const metadata = {
            name,
            description,
            image: imageUrl,
            attributes: [
                {
                    trait_type: "Creator",
                    value: creatorAddress
                },
                {
                    trait_type: "Event ID",
                    value: eventId.toString()
                }
            ]
        };

        // 3. メタデータをLighthouseにアップロード
        const metadataUrl = await uploadMetadataToLighthouse(metadata);
        console.log('Metadata uploaded:', metadataUrl);

        // 4. コントラクトとの対話を設定
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            NFT_CONTRACT_ABI,
            signer
        );

        // 5. イベント作成者を設定
        console.log('Setting event creator...');
        const setCreatorTx = await nftContract.setEventCreator(eventId, creatorAddress);
        await setCreatorTx.wait();
        console.log('Event creator set');

        // 6. NFTのメタデータURIを設定
        console.log('Setting event NFT metadata...');
        const setNftTx = await nftContract.setEventNFT(eventId, metadataUrl);
        await setNftTx.wait();
        console.log('NFT metadata set');

        return {
            success: true,
            metadataUrl,
            imageUrl
        };

    } catch (error: any) {
        console.error('Detailed error in mintNFT:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        throw new Error(`NFT setup failed: ${(error as Error).message}`);
    }
}

// NFTを請求するための新しい関数を追加
export async function claimEventNFT(eventId: number, password: string) {
    try {
        console.log('Starting NFT claim process...');

        if (!window.ethereum) {
            throw new Error('MetaMaskが見つかりません');
        }

        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        }) as string[];

        if (!accounts || accounts.length === 0) {
            throw new Error('ウォレットが接続されていません');
        }

        const userAddress = accounts[0];

        // パスワードをAPIに送信
        const response = await fetch('/api/nft/claim', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventId,
                userAddress,
                password
            })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'NFT claim failed');
        }

        return {
            success: true,
            transactionHash: data.transactionHash
        };

    } catch (error) {
        console.error('Error claiming NFT:', error);
        throw error;
    }
}