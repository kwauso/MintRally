import { createEventGroup, showALLEventGroup } from '../../lib/data'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('受信したデータ:', body)

        if (!body.name || !body.master_address) {
            return NextResponse.json({
                success: false,
                message: 'グループ名とマスターアドレスは必須です'
            }, { status: 400 })
        }

        const result = await createEventGroup(body.name, body.master_address)
        console.log('作成結果:', result)

        return NextResponse.json({
            success: true,
            data: result
        })

    } catch (error) {
        console.error('APIエラー:', error)
        return NextResponse.json({
            success: false,
            message: 'イベントグループの作成に失敗しました',
            error: error.message
        }, { status: 500 })
    }
}

export async function GET() {
    try {
        const eventGroups = await showALLEventGroup()
        console.log('取得したイベントグループ:', eventGroups)

        return NextResponse.json({
            success: true,
            data: eventGroups
        })

    } catch (error) {
        console.error('APIエラー:', error)
        return NextResponse.json({
            success: false,
            message: 'イベントグループの取得に失敗しました',
            error: error.message
        }, { status: 500 })
    }
}