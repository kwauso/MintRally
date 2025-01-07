"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type EventGroup = {
    id: number
    name: string
    master_address: string
    events: any[] // 必要に応じて型を詳細に定義
}

export default function EventGroupsPage() {
    const [eventGroups, setEventGroups] = useState<EventGroup[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchEventGroups()
    }, [])

    const fetchEventGroups = async () => {
        try {
            const response = await fetch('/api/eventGroup')
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.message || 'イベントグループの取得に失敗しました')
            }

            setEventGroups(result.data)
        } catch (error) {
            console.error('Error fetching event groups:', error)
            setError('イベントグループの取得中にエラーが発生しました')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="container mx-auto p-4">読み込み中...</div>
    }

    if (error) {
        return <div className="container mx-auto p-4 text-red-500">{error}</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">イベントグループ一覧</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {eventGroups.map((group) => (
                    <Link 
                        key={group.id} 
                        href={`/event-groups/${group.name}`}
                        className="block"
                    >
                        <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
                            <p className="text-sm text-gray-600">
                                マスターアドレス: {group.master_address}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                イベント数: {group.events.length}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            <Link 
                href="/event-groups/new" 
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            >
                新規グループ作成
            </Link>
        </div>
    )
}