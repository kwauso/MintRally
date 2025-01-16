"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../app/context/AuthContext'
import Link from 'next/link'
import { claimEventNFT } from '../../../blockchain/utils/lighthouse'

type Event = {
    id: number
    name: string
    description: string
    date: string
    creator_address: string
    eventGroup: {
        id: number
        name: string
    }
    nftEnabled: boolean
}

export default function EventDetail() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [claimingNFT, setClaimingNFT] = useState(false)

    useEffect(() => {
        fetchEvent()
    }, [params.id])

    const fetchEvent = async () => {
        try {
            const response = await fetch(`/api/event/${params.id}`)
            if (!response.ok) {
                throw new Error('イベントの取得に失敗しました')
            }
            const data = await response.json()
            if (data.success) {
                setEvent(data.event)
            }
        } catch (error) {
            console.error('Error fetching event:', error)
            router.push('/event-groups')
        } finally {
            setLoading(false)
        }
    }

    const handleClaimNFT = async () => {
        if (!event || !user) return

        setClaimingNFT(true)
        try {
            const result = await claimEventNFT(event.id)
            alert('NFTの取得に成功しました！')
            console.log('NFT claim result:', result)
        } catch (error) {
            console.error('NFT claim error:', error)
            alert('NFTの取得に失敗しました: ' + (error as Error).message)
        } finally {
            setClaimingNFT(false)
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

    if (!event) {
        return (
            <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                    イベントが見つかりませんでした
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {event.name}
                    </h1>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">イベント詳細</h2>
                        <h2 className="text-lg font-semibold text-gray-700">イベントグループ：
                            <Link href={`/event-groups/${event.eventGroup.id}`}>
                            {event.eventGroup.name}
                            </Link>
                            </h2>
                        <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700">開催情報</h2>
                        <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">📅</span>
                                <span className="text-lg text-gray-700">
                                    {new Date(event.date).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">👤</span>
                                <span className="text-lg text-gray-700">
                                    作成者: {event.creator_address}
                                </span>
                            </div>
                            {event.nftEnabled && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">🎫</span>
                                    <span className="text-lg text-gray-700">
                                        NFT発行可能
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {event?.nftEnabled && user && (
                        <div className="mt-6">
                            <button
                                onClick={handleClaimNFT}
                                disabled={claimingNFT}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {claimingNFT ? 'NFT取得中...' : 'NFTを取得する'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}