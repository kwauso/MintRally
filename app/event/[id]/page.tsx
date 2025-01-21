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
    nftTokenURI: string | null
    pass: string | null
}

export default function EventDetail() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [claimingNFT, setClaimingNFT] = useState(false)
    const [pass, setPass] = useState('')
    const [showPassModal, setShowPassModal] = useState(false)
    const [passError, setPassError] = useState('')

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

        if (event.pass) {
            if (!pass) {
                setShowPassModal(true)
                return
            }
            
            if (pass !== event.pass) {
                setPassError('あいことばが正しくありません')
                return
            }
        }

        setClaimingNFT(true)
        try {
            const result = await claimEventNFT(event.id)
            alert('NFTの取得に成功しました！')
            console.log('NFT claim result:', result)
            setShowPassModal(false)
            setPass('')
            setPassError('')
        } catch (error) {
            console.error('NFT claim error:', error)
            alert('NFTの取得に失敗しました: ' + (error as Error).message)
        } finally {
            setClaimingNFT(false)
        }
    }

    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPass(e.target.value)
        setPassError('')
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
                        イベント詳細
                    </h1>
                </div>
            </div>

            <div className="events-list">
                <div className="event-card">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex-grow">
                        {event.name}
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

                    {event.nftEnabled && user && user.account !== event.creator_address && (
                        <div className="nft-claim-section">
                            <button
                                onClick={handleClaimNFT}
                                disabled={claimingNFT}
                                className="nft-claim-button"
                            >
                                {claimingNFT ? 'NFT受け取り中...' : 'NFTを受け取る'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showPassModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 className="modal-title">あいことばを入力</h3>
                        <input
                            type="password"
                            value={pass}
                            onChange={handlePassChange}
                            className={`modal-input ${passError ? 'error' : ''}`}
                            placeholder="あいことばを入力してください"
                        />
                        {passError && (
                            <p className="modal-error">{passError}</p>
                        )}
                        <div className="modal-buttons">
                            <button
                                onClick={() => {
                                    setShowPassModal(false)
                                    setPass('')
                                    setPassError('')
                                }}
                                className="modal-button modal-button-cancel"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleClaimNFT}
                                className="modal-button modal-button-confirm"
                            >
                                確認
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}