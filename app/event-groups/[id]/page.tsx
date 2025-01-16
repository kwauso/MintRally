"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../app/context/AuthContext'

type Event = {
    id: number
    name: string
    description: string
    date: string
    creator_address: string
    nftEnabled: boolean
}

type EventGroup = {
    id: number
    name: string
    events: Event[]
}

export default function EventGroupDetail() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const [eventGroup, setEventGroup] = useState<EventGroup | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params && params.id) {
            fetchEventGroup()
        }
    }, [params])

    const fetchEventGroup = async () => {
        try {
            const response = await fetch(`/api/eventGroup/${params.id}`)
            if (!response.ok) {
                throw new Error('イベントグループの取得に失敗しました')
            }
            const data = await response.json()
            if (data.success) {
                setEventGroup(data.eventGroup)
            }
        } catch (error) {
            console.error('Error fetching event group:', error)
            router.push('/event-groups')
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

    if (!eventGroup) {
        return (
            <div className="empty-container">
                <div className="empty-text">イベントグループが見つかりませんでした</div>
            </div>
        )
    }

    return (
        <div className="events-container">
            <div className="header-container">
                <div>
                    <Link 
                        href="/event-groups"
                        className="back-link"
                    >
                        イベントグループ一覧に戻る
                    </Link>
                    <h1 className="event-groups-title">
                        {eventGroup.name}
                    </h1>
                </div>
                {user && (
                    <Link
                        href={`/event/new?groupId=${eventGroup.id}`}
                        className="new-group-link"
                    >
                        新規イベント作成
                    </Link>
                )}
            </div>

            <div className="event-group-list">
                {eventGroup.events.length > 0 ? (
                    <div className="space-y-6">
                        {eventGroup.events.map((event) => (
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
                                            {event.nftEnabled && (
                                                <span className="small-square">
                                                    NFT対応
                                                </span>
                                            )}
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