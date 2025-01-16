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
            <div className="empty-container">
                <div className="empty-text">読み込み中...</div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="empty-container">
                <div className="empty-text">イベントが見つかりませんでした</div>
            </div>
        )
    }

    return (
        <div className="events-container">
            <div className="header-container">
                <div>
                    <Link 
                        href={`/event-groups/${event.eventGroup.id}`}
                        className="back-link"
                    >
                        イベントグループに戻る
                    </Link>
                    <h1 className="event-groups-title">
                        {event.name}
                    </h1>
                </div>
            </div>

            <div className="events-list">
                <div className="event-card">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex-grow">
                            イベント詳細
                        </h2>
                        {event.nftEnabled && (
                            <span className="small-square">
                                NFT対応
                            </span>
                        )}
                    </div>

                    <p className="text-gray-600 mb-6">
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
            </div>
        </div>
    )
}