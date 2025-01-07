"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../app/context/AuthContext'
import Link from 'next/link'

type Event = {
    id: number
    name: string
    description: string
    date: string
    creator_address: string
    eventGroupId: number
    eventGroup: {
        name: string
    }
}

export default function EventList() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/event')
            if (!response.ok) {
                throw new Error('イベントの取得に失敗しました')
            }
            const data = await response.json()
            if (data.success) {
                setEvents(data.events)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="container mx-auto p-4">読み込み中...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">イベント一覧</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <div key={event.id} className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="text-sm text-gray-500 mb-2">
                            開催日時: {new Date(event.date).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                            グループ: {event.eventGroup.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                            作成者: {event.creator_address}
                        </div>
                    </div>
                ))}
                {events.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        イベントがありません
                    </div>
                )}
            </div>
        </div>
    )
}
