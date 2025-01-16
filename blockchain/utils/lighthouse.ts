import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../constants'
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
    interface Window {
      ethereum?: MetaMaskInpageProvider;
    }
  }

const API_KEY = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || '';

if (!API_KEY) {
    throw new Error('Lighthouse API key is not set');
}

export async function uploadToLighthouse(file: File) {
    try {
        console.log('Starting file upload to Lighthouse...');
        
        // ファイルをArrayBufferに変換
        const arrayBuffer = await file.arrayBuffer();
        console.log('File converted to ArrayBuffer');
        
        // ArrayBufferをBufferに変換
        const buffer = Buffer.from(arrayBuffer);
        console.log('ArrayBuffer converted to Buffer');

        // Bufferを使用してアップロード
        console.log('Uploading buffer to Lighthouse...');
        const response = await lighthouse.uploadBuffer(
            buffer,
            API_KEY
        );
        console.log('Upload response:', response);

        if (!response.data || !response.data.Hash) {
            throw new Error('Invalid response from Lighthouse');
        }

        const url = `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
        console.log('File uploaded successfully to:', url);
        return url;

    } catch (error: any) {
        console.error('Detailed error in uploadToLighthouse:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        throw new Error(`Lighthouse upload failed: ${error.message}`);
    }
}

export async function uploadMetadataToLighthouse(metadata: any) {
    try {
        console.log('Starting metadata upload to Lighthouse...');
        
        // メタデータをJSON文字列に変換
        const jsonString = JSON.stringify(metadata);
        console.log('Metadata converted to JSON string');
        
        // 文字列をBufferに変換
        const buffer = Buffer.from(jsonString);
        console.log('JSON string converted to Buffer');

        console.log('Uploading metadata buffer to Lighthouse...');
        const response = await lighthouse.uploadBuffer(
            buffer,
            API_KEY
        );
        console.log('Metadata upload response:', response);

        if (!response.data || !response.data.Hash) {
            throw new Error('Invalid response from Lighthouse');
        }

        const url = `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
        console.log('Metadata uploaded successfully to:', url);
        return url;

    } catch (error: any) {
        console.error('Detailed error in uploadMetadataToLighthouse:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        throw new Error(`Lighthouse metadata upload failed: ${error.message}`);
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
export async function claimEventNFT(eventId: number) {
    try {
        console.log('Starting NFT claim process...');

        if (!window.ethereum) {
            throw new Error('MetaMaskが見つかりません');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            NFT_CONTRACT_ABI,
            signer
        );

        console.log('Claiming NFT...');
        const claimTx = await nftContract.claimNFT(eventId);
        const receipt = await claimTx.wait();
        console.log('NFT claimed');

        return {
            success: true,
            transactionHash: receipt.hash
        };

    } catch (error) {
        console.error('Error claiming NFT:', error);
        throw new Error(`NFT claim failed: ${(error as Error).message}`);
    }
}