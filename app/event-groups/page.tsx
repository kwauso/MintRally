"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type EventGroup = {
    id: number
    name: string
    master_address: string
    events: any[]
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
        return (
            <div className="event-groups-container">
                <div className="empty-message">読み込み中...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="event-groups-container">
                <div className="empty-message" style={{ color: '#ef4444' }}>{error}</div>
            </div>
        )
    }

    // グループを3つずつの配列に分割
    const groupedEvents = eventGroups.reduce((acc, curr, i) => {
        const groupIndex = Math.floor(i / 3)
        if (!acc[groupIndex]) {
            acc[groupIndex] = []
        }
        acc[groupIndex].push(curr)
        return acc
    }, [] as EventGroup[][])

    return (
        <div className="event-groups-container">
            <div className="header-container">
                <h1 className="event-groups-title">イベントグループ一覧</h1>
                <Link 
                    href="/event-groups/new" 
                    className="new-group-link"
                >
                    新規作成
                </Link>
            </div>
            
            <div className="event-groups-grid">
                {groupedEvents.map((row, rowIndex) => (
                    <div key={rowIndex} className="event-groups-row">
                        {row.map((group) => (
                            <Link 
                                key={group.id} 
                                href={`/event-groups/${group.name}`}
                                className="event-group-card"
                            >
                                <h2 className="event-group-name">
                                    {group.name}
                                </h2>
                            </Link>
                        ))}
                    </div>
                ))}

                {eventGroups.length === 0 && (
                    <div className="empty-message">
                        イベントグループがありません
                    </div>
                )}
            </div>
        </div>
    )
}