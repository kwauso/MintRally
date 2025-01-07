"use server"

import { prisma } from '../lib/prisma'
import fs from 'fs/promises'
import path from 'path'

export async function createEventGroupPage(name: string, master_address: string, groupId: number) {
    try {
        const dirPath = path.join(process.cwd(), 'app', 'event-groups', "list", name)
        await fs.mkdir(dirPath, { recursive: true })
        
        const pageContent = `"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../../app/context/AuthContext'

export default function ${name.replace(/[^a-zA-Z0-9]/g, '')}Page() {
    const { user } = useAuth()
    const isOwner = user?.account?.toLowerCase() === "${master_address.toLowerCase()}"
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(\`/api/eventGroup/${groupId}/events\`)
                const data = await response.json()
                if (data.success) {
                    setEvents(data.events)
                }
            } catch (error) {
                console.error('イベント取得エラー:', error)
            }
        }

        fetchEvents()
    }, [])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">${name}</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                    マスターアドレス: ${master_address}
                </p>
                {isOwner && (
                    <div className="mb-6">
                        <Link 
                            href={\`/event/new?groupId=${groupId}\`}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors inline-block"
                        >
                            イベントを作成
                        </Link>
                    </div>
                )}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">イベント一覧</h2>
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="border rounded-lg p-4">
                                <h3 className="font-semibold">{event.name}</h3>
                                <p className="text-gray-600">{event.description}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(event.date).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}`

        await fs.writeFile(path.join(dirPath, 'page.tsx'), pageContent)
        console.log('ディレクトリとファイルを作成:', dirPath)

    } catch (error) {
        console.error('ページ作成エラー:', error)
        throw error
    }
}

export async function createEventGroup(name: string, master_address: string) {
    try {
        console.log('データベース作成開始:', { name, master_address })

        const result = await prisma.eventgroup.create({
            data: {
                name,
                master_address,
            }
        })

        console.log('データベース作成結果:', result)

        if (!result) {
            throw new Error('データベースへの保存に失敗しました')
        }

        // ページの生成時にgroupIdを渡す
        await createEventGroupPage(name, master_address, result.id)

        return result

    } catch (error) {
        console.error('イベントグループ作成エラー:', error)
        throw error
    }
}

export async function showALLEventGroup() {
    try {
        const eventGroups = await prisma.eventgroup.findMany({
            include: {
                events: true
            }
        })
        
        console.log('取得したイベントグループ:', eventGroups) // デバッグログ
        
        // 必ず配列を返す
        return eventGroups || []
    } catch (error) {
        console.error('イベントグループ取得エラー:', error)
        return [] // エラーの場合は空配列を返す
    }
}

export async function createEvent(
    name: string,
    eventGroupId: number,
    creator_address: string,
    description: string = '',
    date: Date | null = null,
    pass: string = ''
) {
    try {
        const eventGroup = await prisma.eventgroup.findUnique({
            where: { id: eventGroupId }
        })

        if (!eventGroup) {
            throw new Error('イベントグループが見つかりません')
        }

        if (eventGroup.master_address.toLowerCase() !== creator_address.toLowerCase()) {
            throw new Error('イベントの作成権限がありません')
        }

        const result = await prisma.event.create({
            data: {
                name,
                description,
                date: date || new Date(),
                pass,
                creator_address,
                eventGroup: {
                    connect: {
                        id: eventGroupId
                    }
                }
            },
            include: {
                eventGroup: true
            }
        })

        return result

    } catch (error) {
        console.error('イベント作成エラー:', error)
        throw error
    }
}
