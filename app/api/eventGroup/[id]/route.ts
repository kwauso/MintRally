import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await params).id)

        const eventGroup = await prisma.eventgroup.findUnique({
            where: {
                id: id
            },
            include: {
                events: {
                    orderBy: {
                        date: 'desc'
                    }
                }
            }
        })

        if (!eventGroup) {
            return NextResponse.json({
                success: false,
                message: 'イベントグループが見つかりませんでした'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            eventGroup
        })

    } catch (error) {
        console.error('イベントグループ取得エラー:', error)
        return NextResponse.json({
            success: false,
            message: 'イベントグループの取得に失敗しました',
            error: (error as Error).message
        }, { status: 500 })
    }
}