import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const name = searchParams.get('name')

        if (!name) {
            return NextResponse.json({ error: 'ユーザー名が必要です' }, { status: 400 })
        }

        // Prismaを使用してデータベースからユーザー情報を取得
        const userData = await prisma.user.findUnique({
            where: {
                name: name
            },
            select: {
                address: true
            }
        })

        if (!userData) {
            return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 })
        }

        return NextResponse.json({ address: userData.address })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}