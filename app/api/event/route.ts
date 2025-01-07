import { createEvent } from '../../lib/data'
import { NextResponse } from 'next/server'

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