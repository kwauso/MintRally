import { prisma } from '../../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id)
        if (isNaN(id)) {
            return NextResponse.json({
                success: false,
                message: '無効なIDです'
            }, { status: 400 })
        }

        const events = await prisma.event.findMany({
            where: {
                eventGroupId: id
            },
            orderBy: {
                date: 'desc'
            }
        })

        return NextResponse.json({
            success: true,
            events
        })

    } catch (error) {
        console.error('イベント取得エラー:', error)
        return NextResponse.json({
            success: false,
            message: 'イベントの取得に失敗しました',
            error: (error as Error).message
        }, { status: 500 })
    }
}
