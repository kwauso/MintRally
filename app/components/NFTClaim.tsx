"use client"

import { useState } from 'react'
import { useContract } from '../../app/hooks/useContract'

export default function NFTClaim({ eventId }: { eventId: number }) {
    const [pass, setPass] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { contract } = useContract()

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!contract) return

        try {
            setIsLoading(true)

            const response = await fetch(`/api/event/${eventId}/verify-pass`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pass })
            })

            if (!response.ok) {
                throw new Error('パスワードが正しくありません')
            }

            const tx = await contract.claimNFT(eventId)
            await tx.wait()

            alert('NFTの取得に成功しました！')
            setPass('')
        } catch (error) {
            console.error('NFT取得エラー:', error)
            alert('NFTの取得に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleClaim} className="space-y-4">
            <input
                type="text"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="パスワードを入力"
                className="input input-bordered w-full"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
            >
                {isLoading ? 'NFT取得中...' : 'NFTを取得'}
            </button>
        </form>
    )
}