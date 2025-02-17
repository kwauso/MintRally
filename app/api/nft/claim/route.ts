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
        console.log('Transaction sent:', tx.hash);

        // トランザクション結果
        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);

        // トークンID確認
        const tokenId = receipt.events?.find(e => e.event === 'Transfer')?.args?.tokenId;
        console.log('Minted token ID:', tokenId);

        // メタデータURI確認
        const tokenURI = await nftContract.tokenURI(tokenId);
        console.log('Token URI:', tokenURI);

        return NextResponse.json({
            success: true,
            message: 'NFTを発行しました',
            transactionHash: receipt.hash,
            tokenId: tokenId,
            tokenURI: tokenURI
        });

    } catch (error) {
        console.error('NFT claim error:', error)
        return NextResponse.json({
            success: false,
            message: 'NFTの発行に失敗しました',
            error: (error as Error).message
        }, { status: 500 })
    }
} 