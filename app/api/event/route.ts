import { createEvent } from '../../lib/data'
import { prisma } from '../../lib/prisma'
import { NextResponse } from 'next/server'

// イベント一覧を取得するGETメソッド
export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                date: 'desc'
            },
            include: {
                eventGroup: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            events
        })

    } catch (error) {
        console.error('イベント一覧取得エラー:', error)
        return NextResponse.json({
            success: false,
            message: 'イベントの取得に失敗しました',
            error: (error as Error).message
        }, { status: 500 })
    }
}

// 既存のPOSTメソッド
export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('受信したイベントデータ:', body)

        if (!body.name || !body.eventGroupId || !body.creator_address) {
            return NextResponse.json({
                success: false,
                message: 'イベント名、グループID、作成者アドレスは必須です'
            }, { status: 400 })
        }

        const result = await createEvent(
            body.name,
            body.eventGroupId,
            body.creator_address,
            body.description || '',
            body.date || null,
            body.pass || ''
        )

        return NextResponse.json({
            success: true,
            data: result
        })

    } catch (error) {
        console.error('APIエラー:', error)
        return NextResponse.json({
            success: false,
            message: 'イベントの作成に失敗しました',
            error: (error as Error).message
        }, { status: 500 })
    }
}