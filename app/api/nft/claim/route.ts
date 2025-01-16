import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { mintNFT } from '../../../../blockchain/utils/lighthouse'

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

        // NFTの発行
        const result = await mintNFT(
            userAddress,
            event.nftTokenURI || '',
            event.creator_address
        )

        return NextResponse.json({
            success: true,
            message: 'NFTを発行しました',
            transactionHash: result.transactionHash
        })

    } catch (error) {
        console.error('NFT claim error:', error)
        return NextResponse.json({
            success: false,
            message: 'NFTの発行に失敗しました',
            error: (error as Error).message
        }, { status: 500 })
    }
} 