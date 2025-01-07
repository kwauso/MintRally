import { createEventGroup, showALLEventGroup } from '../../lib/data'
import { NextResponse } from 'next/server'

// イベントグループの作成
export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('受信したデータ:', body) // デバッグ用

        // バリデーション
        if (!body.name || !body.master_address) {
            console.error('必要なデータが不足しています:', body)
            return NextResponse.json({
                success: false,
                error: 'グループ名とマスターアドレスは必須です'
            }, { status: 400 })
        }

        const result = await createEventGroup(body.name, body.master_address)
        console.log('作成成功:', result) // デバッグ用
        
        if (!result) {
            return NextResponse.json({
                success: false,
                error: 'イベントグループの作成に失敗しました'
            }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            data: result
        })

    } catch (error) {
        console.error('APIエラーの詳細:', error)
        return NextResponse.json({
            success: false,
            error: 'イベントグループの作成に失敗しました',
            details: error.message
        }, { status: 500 })
    }
}

// イベントグループの取得
export async function GET() {
    try {
        const eventGroups = await showALLEventGroup()
        console.log('取得したイベントグループ:', eventGroups) // デバッグ用
        
        return NextResponse.json({
            success: true,
            data: eventGroups || []
        })

    } catch (error) {
        console.error('APIエラーの詳細:', error)
        return NextResponse.json({
            success: false,
            error: 'イベントグループの取得に失敗しました',
            details: error.message
        }, { status: 500 })
    }
}