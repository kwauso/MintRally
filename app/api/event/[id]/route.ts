import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id)

        const event = await prisma.event.findUnique({
            where: {
                id: id
            },
            include: {
                eventGroup: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        if (!event) {
            return NextResponse.json({
                success: false,
                message: 'イベントが見つかりません'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            event
        })

    } catch (error) {
        console.error('イベント取得エラー:', error)
        return NextResponse.json({
            success: false,
            message: 'イベント情報の取得に失敗しました',
            error: (error as Error).message
        }, { status: 500 })
    }
} 