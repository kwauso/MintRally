import { prisma } from '../../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { pass } = await request.json()
        const eventId = parseInt(params.id)

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        })

        if (!event) {
            return NextResponse.json({
                success: false,
                message: 'イベントが見つかりません'
            }, { status: 404 })
        }

        if (!event.nftEnabled) {
            return NextResponse.json({
                success: false,
                message: 'このイベントではNFTが無効です'
            }, { status: 400 })
        }

        if (event.pass !== pass) {
            return NextResponse.json({
                success: false,
                message: 'パスワードが正しくありません'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true
        })

    } catch (error) {
        console.error('パスワード検証エラー:', error)
        return NextResponse.json({
            success: false,
            message: 'パスワードの検証に失敗しました',
            error: (error as Error).message
        }, { status: 500 })
    }
}