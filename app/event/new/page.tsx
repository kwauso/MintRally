"use client"

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../../app/context/AuthContext'
import EventForm from '../../../app/components/EventForm'

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
    }, [user, groupId])

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

            const result = await response.json()
            if (!result.success) {
                throw new Error(result.message)
            }

            router.push(`/event-groups/list/${result.data.eventGroup.name}`)
            router.refresh()
        } catch (error) {
            console.error('Error:', error)
            alert('エラーが発生しました: ' + (error as Error).message)
        }
    }

    if (!user) {
        return <div>ログインが必要です...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">新規イベントの作成</h1>
            
            <div className="bg-white shadow rounded-lg p-6">
                <EventForm 
                    eventGroupId={Number(groupId)} 
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    )
}
