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
        return (
            <div className="empty-container">
                <div className="empty-text">読み込み中...</div>
            </div>
        )
    }

    return (
        <div className="events-container">
            <div className="header-container">
                <div>
                    <h1 className="event-groups-title">
                        イベント一覧
                    </h1>
                </div>
                {user && (
                    <Link
                        href="/event/new"
                        className="new-group-link"
                    >
                        新規イベント作成
                    </Link>
                )}
            </div>

            <div className="events-list">
                {events.length > 0 ? (
                    <div>
                        {events.map((event) => (
                            <div key={event.id} className="w-full">
                                <Link 
                                    href={`/event/${event.id}`}
                                    className="block w-full h-full"
                                >
                                    <div className="event-card">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800 line-clamp-2 flex-grow">
                                                {event.name}
                                            </h2>

                                        </div>

                                        <p className="text-gray-600 mb-6 line-clamp-3">
                                            {event.description || 'イベントの説明はありません'}
                                        </p>

                                        <div className="space-y-3 text-sm text-gray-500 border-t pt-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-600">開催日時：</span>
                                                <span>
                                                    {new Date(event.date).toLocaleString('ja-JP', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-600">作成者：</span>
                                                <span className="font-mono">
                                                    {event.creator_address}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-container">
                        <div className="empty-text">
                            イベントはまだありません
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
