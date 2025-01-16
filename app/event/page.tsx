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
            <div className="loading-container">
                <div className="loading-text">読み込み中...</div>
            </div>
        )
    }

    return (
        <div className="event-container">
            <div className="event-content">
                <div className="event-header">
                    <h1 className="event-title">イベント一覧</h1>
                </div>

                <div className="event-list-container">
                    {events && events.length > 0 ? (
                        <div className="event-list" key={events.length}>
                            {events.map((event) => (
                                <Link 
                                    href={`/event/${event.id}`}
                                    className="block bg-white border-2 border-gray-100 rounded-3xl p-8 hover:border-gray-200 transition-all duration-200 shadow-sm"
                                >
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-semibold text-gray-800">
                                            {event.name}
                                        </h2>
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            {event.description}
                                        </p>
                                        <div className="flex flex-col space-y-2 text-gray-500">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">📅</span>
                                                <span className="text-lg">
                                                    {new Date(event.date).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">👤</span>
                                                <span className="text-lg">
                                                    {event.creator_address}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-message">
                            <p className="empty-text">
                                イベントはありません
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
