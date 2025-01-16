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
        fetchEventGroup()
    }, [params.id])

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
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center text-gray-600 text-lg">
                    読み込み中...
                </div>
            </div>
        )
    }

    if (!eventGroup) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                    イベントグループが見つかりませんでした
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                    <Link 
                        href="/event-groups"
                        className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-lg"
                    >
                        イベントグループ一覧に戻る
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {eventGroup.name}
                    </h1>
                </div>
                {user && (
                    <Link
                        href={`/event/new?groupId=${eventGroup.id}`}
                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-colors duration-200 text-lg font-medium"
                    >
                        新規イベント作成
                    </Link>
                )}
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-8">
                    {eventGroup.events.length > 0 ? (
                        <div className="space-y-6">
                            {eventGroup.events.map((event) => (
                                <Link 
                                    key={event.id}
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
                                            {event.nftEnabled && (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">🎫</span>
                                                    <span className="text-lg">
                                                        NFT発行可能
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-600">
                                イベントはまだありません
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
} 