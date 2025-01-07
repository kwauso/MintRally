"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function CreateEventGroup() {
    const [name, setName] = useState('')
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!user || !user.account) {
            alert('ログインしてください')
            router.push('/login')
            return
        }

        try {
            const response = await fetch('/api/eventGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    master_address: user.account,
                }),
            })

            const result = await response.json()
            if (!result.success) {
                throw new Error(result.message)
            }

            router.push('/event-groups')
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
        <div className="create-group-container">
            <h1 className="create-group-title">新規イベントグループの作成</h1>
            
            <div className="create-group-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            グループ名
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-input"
                            required
                            placeholder="グループ名を入力してください"
                        />
                    </div>

                    <div className="wallet-info">
                        <div className="wallet-label">🦊アドレス:</div>
                        <div className="wallet-address">{user.account}</div>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={!name.trim()}
                    >
                        作成
                    </button>
                </form>
            </div>
        </div>
    )
}