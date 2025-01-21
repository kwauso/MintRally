"use client"

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '../../../app/context/AuthContext'
import EventForm from '../../../app/components/EventForm'
import { mintNFT } from '../../../blockchain/utils/lighthouse'

type APIResponse = {
    success: boolean;
    message?: string;
    data?: {
        event: {
            id: number;
            eventGroupId: number;
            eventGroup: {
                id: number;
                name: string;
            };
        };
    };
}

export default function CreateEvent(): React.ReactElement {
    const router = useRouter()
    const searchParams = useSearchParams()
    const groupId = searchParams.get('groupId')
    const { user } = useAuth()

    useEffect(() => {
        if (!user) {
            router.push('/login')
            return
        }

        if (!groupId) {
            alert('グループIDが指定されていません')
            router.push('/event-groups')
            return
        }
    }, [user, groupId, router])

    const handleSubmit = async (formData: FormData) => {
        if (!user || !user.account) {
            alert('ログインしてください')
            router.push('/login')
            return
        }

        try {
            formData.append('creator_address', user.account)

            const response = await fetch('/api/event', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`APIエラー: ${response.status} ${errorText}`)
            }

            const result = await response.json() as APIResponse

            if (!result.success) {
                throw new Error(result.message || '不明なエラーが発生しました')
            }

            router.push(`/event-groups/${result.data?.event.eventGroupId}`)
            router.refresh()
        } catch (error) {
            console.error('Error:', error)
            alert('エラーが発生しました: ' + (error as Error).message)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-600">
                    ログインが必要です...
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4">
                <div className="event-content">
                    <div className="event-header mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">新規イベントの作成</h1>
                    </div>

                    <div className="event-card bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <EventForm 
                                eventGroupId={Number(groupId)} 
                                onSubmit={handleSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// スタイルを追加
const styles = `
.header-container {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.event-form-container {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.form-padding {
    padding: 1.5rem;
}
`

// スタイルをページに追加
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
}
