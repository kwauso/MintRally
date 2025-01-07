"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CreateEvent(): React.ReactElement {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [pass, setPass] = useState('')
    const [address, setAddress] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const groupId = searchParams.get('groupId')

    useEffect(() => {
        if (!groupId) {
            alert('グループIDが指定されていません')
            router.push('/event-groups')
            return
        }
        checkWalletConnection()
    }, [groupId])

    const checkWalletConnection = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ 
                    method: 'eth_accounts' 
                })
                if (accounts.length > 0) {
                    setAddress(accounts[0])
                }
            } catch (error) {
                console.error('Error checking wallet connection:', error)
            }
        }
    }

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                })
                setAddress(accounts[0])
            } catch (error) {
                console.error('Error connecting to MetaMask:', error)
                alert('MetaMaskへの接続に失敗しました')
            }
        } else {
            alert('MetaMaskをインストールしてください')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!address) {
            alert('MetaMaskに接続してください')
            return
        }

        try {
            const response = await fetch('/api/event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description,
                    date: date ? new Date(date).toISOString() : null,
                    eventGroupId: Number(groupId),
                    creator_address: address,
                    pass
                }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`APIエラー: ${response.status} ${errorText}`)
            }

            const result = await response.json()
            if (!result.success) {
                throw new Error(result.message)
            }

            const groupResponse = await fetch(`/api/eventGroup/${groupId}/events`)
            if (!groupResponse.ok) {
                const errorText = await groupResponse.text()
                throw new Error(`グループ情報の取得に失敗: ${groupResponse.status} ${errorText}`)
            }

            const groupData = await groupResponse.json()
            if (!groupData.success) {
                throw new Error(groupData.message)
            }

            router.push(`/event-groups/list/${result.data.eventGroup.name}`)
            router.refresh()
        } catch (error) {
            console.error('Error:', error)
            alert('エラーが発生しました: ' + (error as Error).message)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">新規イベントの作成</h1>
            
            <div className="bg-white shadow rounded-lg p-6">
                {!address ? (
                    <button 
                        onClick={connectWallet}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        MetaMaskに接続
                    </button>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                イベント名
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                required
                                placeholder="イベント名を入力してください"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                説明
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                                placeholder="イベントの説明を入力してください"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                開催日時
                            </label>
                            <input
                                id="date"
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="pass" className="block text-sm font-medium text-gray-700 mb-1">
                                パスワード
                            </label>
                            <input
                                id="pass"
                                type="password"
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                required
                                placeholder="イベントのパスワードを入力してください"
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded mb-6">
                            <div className="text-sm text-gray-600">作成者アドレス:</div>
                            <div className="font-mono text-sm">{address}</div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
                            disabled={!name.trim()}
                        >
                            作成
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
