"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEventGroup() {
    const [name, setName] = useState('')
    const [address, setAddress] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        checkWalletConnection()
    }, [])

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
                throw new Error(result.message)
            }

            router.push('/event-groups')
            router.refresh()
        } catch (error) {
            console.error('Error:', error)
            alert('エラーが発生しました: ' + error.message)
        }
    }

    return (
        <div className="create-group-container">
            <h1 className="create-group-title">新規イベントグループの作成</h1>
            
            <div className="create-group-form">
                {!address ? (
                    <button 
                        onClick={connectWallet}
                        className="connect-wallet-button"
                    >
                        MetaMaskに接続
                    </button>
                ) : (
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
                            <div className="wallet-address">{address}</div>
                        </div>

                        <button 
                            type="submit" 
                            className="submit-button"
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