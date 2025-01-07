"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../app/context/AuthContext'
import Link from 'next/link'

type EventGroup = {
    id: number
    name: string
    master_address: string
    events: Event[]
}

type Event = {
    id: number
    name: string
    description: string
    date: string
    creator_address: string
    eventGroup: {
        name: string
    }
}

export default function MyPage() {
    const [myEventGroups, setMyEventGroups] = useState<EventGroup[]>([])
    const [myEvents, setMyEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (!user) {
            router.push('/login')
            return
        }
        fetchMyData()
    }, [user])

    const fetchMyData = async () => {
        if (!user?.account) return

        try {
            // イベントグループの取得
            const groupResponse = await fetch(`/api/eventGroup?address=${user.account}`)
            if (!groupResponse.ok) throw new Error('イベントグループの取得に失敗しました')
            const groupData = await groupResponse.json()
            if (groupData.success && Array.isArray(groupData.eventGroups)) {
                setMyEventGroups(groupData.eventGroups)
            } else {
                setMyEventGroups([])
            }

            // イベントの取得
            const eventResponse = await fetch(`/api/event?address=${user.account}`)
            if (!eventResponse.ok) throw new Error('イベントの取得に失敗しました')
            const eventData = await eventResponse.json()
            if (eventData.success && Array.isArray(eventData.events)) {
                setMyEvents(eventData.events)
            } else {
                setMyEvents([])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            setMyEventGroups([])
            setMyEvents([])
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return <div>ログインが必要です...</div>
    }

    if (loading) {
        return <div>読み込み中...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-8">マイページ</h1>

            <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">作成したイベントグループ</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {myEventGroups && myEventGroups.map((group) => (
                        <div key={group.id} className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                イベント数: {group.events?.length || 0}
                            </p>
                            <Link
                                href={`/event-groups/list/${group.name}`}
                                className="text-blue-500 hover:text-blue-600"
                            >
                                詳細を見る
                            </Link>
                        </div>
                    ))}
                    {(!myEventGroups || myEventGroups.length === 0) && (
                        <div className="col-span-full text-center text-gray-500">
                            作成したイベントグループはありません
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">作成したイベント</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {myEvents && myEvents.map((event) => (
                        <div key={event.id} className="bg-white shadow rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                            <p className="text-gray-600 mb-2">{event.description}</p>
                            <p className="text-sm text-gray-500 mb-2">
                                開催日時: {new Date(event.date).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                                グループ: {event.eventGroup.name}
                            </p>
                        </div>
                    ))}
                    {(!myEvents || myEvents.length === 0) && (
                        <div className="col-span-full text-center text-gray-500">
                            作成したイベントはありません
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}