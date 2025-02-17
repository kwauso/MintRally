import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../../../../blockchain/constants'

export async function POST(request: Request) {
    try {
        const { eventId, password, userAddress } = await request.json()

        // イベントの取得
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        if (!event) {
            return NextResponse.json({
                success: false,
                message: 'イベントが見つかりません'
            }, { status: 404 })
        }

        // パスワードの検証
        if (event.pass !== password) {
            return NextResponse.json({
                success: false,
                message: 'パスワードが正しくありません'
            }, { status: 400 })
        }

        // 管理者の秘密鍵でプロバイダーを設定
        const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_URL)
        const adminWallet = new ethers.Wallet(
            process.env.PRIVATE_KEY!,
            provider
        )

        // NFTコントラクトのインスタンス化
        const nftContract = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            NFT_CONTRACT_ABI,
            adminWallet
        )

        // ネットワーク確認
        const network = await provider.getNetwork();
        console.log('Network:', network);

        // コントラクト確認
        console.log('Contract address:', NFT_CONTRACT_ADDRESS);
        
        // トランザクション実行
        const tx = await nftContract.mintTo(userAddress, eventId);
        console.log('Mint transaction:', tx.hash);

        // トランザクション結果
        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);

        // トランザクションログから正しくtokenIdを取得
        let tokenId;
        try {
            const transferEvent = receipt.logs.find(log => {
                try {
                    const parsed = nftContract.interface.parseLog({
                        topics: log.topics,
                        data: log.data
                    });
                    return parsed?.name === 'Transfer';
                } catch {
                    return false;
                }
            });

            if (transferEvent) {
                const parsed = nftContract.interface.parseLog({
                    topics: transferEvent.topics,
                    data: transferEvent.data
                });
                tokenId = parsed.args.tokenId;
                console.log('Found tokenId:', tokenId);
            } else {
                throw new Error('Transfer event not found in logs');
            }
        } catch (e) {
            console.error('Error parsing transfer event:', e);
            throw new Error('Failed to get tokenId from transaction');
        }

        // tokenIdの存在確認
        if (!tokenId) {
            throw new Error('TokenId is undefined');
        }

        // tokenURIの取得
        let tokenURI;
        try {
            tokenURI = await nftContract.tokenURI(tokenId);
            console.log('Token URI:', tokenURI);
        } catch (e) {
            console.error('Error getting tokenURI:', e);
            throw new Error('Failed to get tokenURI');
        }

        return NextResponse.json({
            success: true,
            message: 'NFTを発行しました',
            transactionHash: receipt.hash,
            tokenId: tokenId.toString(),
            tokenURI: tokenURI
        });

    } catch (error) {
        console.error('NFT claim error:', error)
        return NextResponse.json({
            success: false,
            message: 'NFTの発行に失敗しました',
            error: error.message
        }, { status: 500 })
    }
} 