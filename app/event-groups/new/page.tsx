"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEventGroup() {
    const [name, setName] = useState('')
    const [address, setAddress] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        connectWallet()
    }, [])

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                })
                setAddress(accounts[0])
                console.log('Connected address:', accounts[0])
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
            const response = await fetch('/api/eventGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    master_address: address,
                }),
            })

            const result = await response.json()
            
            if (!result.success) {
                throw new Error(result.message || 'イベントグループの作成に失敗しました')
            }

            alert('イベントグループを作成しました')
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Error:', error)
            alert('エラーが発生しました: ' + error.message)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">新規イベントグループの作成</h1>
            {!address ? (
                <div className="text-center">
                    <button 
                        onClick={connectWallet}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        MetaMaskに接続
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            グループ名
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="グループ名を入力してください"
                        />
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            マスターアドレス: {address}
                        </p>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        作成
                    </button>
                </form>
            )}
        </div>
    )
}