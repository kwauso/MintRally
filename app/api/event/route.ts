import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// イベントの作成
export async function POST(request: Request) {
    try {
        const { name, eventGroupId } = await request.json()
        const event = await prisma.event.create({
            data: {
                name,
                event: {
                    connect: { id: eventGroupId }
                }
            }
        })
        return NextResponse.json(event)
    } catch (error) {
        return NextResponse.json({ error: 'イベントの作成に失敗しました' }, { status: 500 })
    }
}
