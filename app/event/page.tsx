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
                        <div className="event-list">
                            {events.map((event) => (
                                <div key={event.id} className="event-card">
                                    <div className="event-card-content">
                                        <div className="event-info">
                                            <h2 className="event-name">{event.name}</h2>
                                            <p className="event-description">{event.description}</p>
                                            <div className="event-meta">
                                                <p className="event-meta-item">
                                                    📅 開催日時: {new Date(event.date).toLocaleString()}
                                                </p>
                                                <p className="event-meta-item">
                                                    📁 グループ: {event.eventGroup.name}
                                                </p>
                                                <p className="event-meta-item">
                                                    👤 作成者: {event.creator_address}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
