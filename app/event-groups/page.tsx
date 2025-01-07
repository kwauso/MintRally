"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

interface Event {
    id: number
    name: string | null
}

interface EventGroup {
    id: number
    name: string | null
    master_address: string | null
    events: Event[]
}

export default function Home() {
    const [eventGroups, setEventGroups] = useState<EventGroup[]>([])
    const { user } = useAuth()

    useEffect(() => {
        const fetchEventGroups = async () => {
            try {
                const response = await fetch('/api/eventGroup')
                const data = await response.json()
                
                // データが配列であることを確認
                if (Array.isArray(data)) {
                    setEventGroups(data)
                } else {
                    console.error('Received data is not an array:', data)
                    setEventGroups([])
                }
            } catch (error) {
                console.error('Error fetching event groups:', error)
                setEventGroups([])
            }
        }
        fetchEventGroups()
    }, [])

    // デバッグ用のログ
    console.log('Current eventGroups:', eventGroups)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">イベントグループ一覧</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(eventGroups) && eventGroups.map((group) => (
                    <div key={group.id} className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
                        <p className="text-sm text-gray-600 mb-2">主催者: {group.master_address}</p>
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">イベント:</h3>
                            <ul className="list-disc pl-5">
                                {group.events && group.events.map((event) => (
                                    <li key={event.id}>
                                        <Link href={`/event/${event.id}`} className="text-blue-500 hover:underline">
                                            {event.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {user?.account === group.master_address && (
                            <Link href={`/eventGroup/${group.id}/addEvent`} className="text-blue-500 hover:underline">
                                イベントを追加
                            </Link>
                        )}
                    </div>
                ))}
            </div>
            <Link href="/event-groups/new" className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg">
                新規グループ作成
            </Link>
        </div>
    )
}