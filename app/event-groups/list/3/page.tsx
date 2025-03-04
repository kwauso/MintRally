"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../../app/context/AuthContext'

export default function test3Page() {
    const { user } = useAuth()
    const isOwner = user?.account?.toLowerCase() === "0x54c6535c32d7406a28abba9a6abfbfa37405e2c5"
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`/api/eventGroup/list/3`)
                const data = await response.json()
                if (data.success) {
                    setEvents(data.events)
                }
            } catch (error) {
                console.error('イベント取得エラー:', error)
            }
        }

        fetchEvents()
    }, [])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">test3</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                    マスターアドレス: 0x54c6535c32d7406a28abba9a6abfbfa37405e2c5
                </p>
                {isOwner && (
                    <div className="mt-4">
                        <Link 
                            href={`/event/new?groupId=3`}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            イベントを作成
                        </Link>
                    </div>
                )}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">イベント一覧</h2>
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="border rounded-lg p-4">
                                <h3 className="font-semibold">{event.name}</h3>
                                <p className="text-gray-600">{event.description}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(event.date).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}