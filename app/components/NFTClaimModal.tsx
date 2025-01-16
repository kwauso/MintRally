import React, { useState } from 'react'
import Input from './Input'

interface NFTClaimModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (password: string) => void
    loading: boolean
}

export default function NFTClaimModal({ 
    isOpen, 
    onClose, 
    onSubmit,
    loading 
}: NFTClaimModalProps) {
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(password)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    NFTを取得
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="パスワード"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="パスワードを入力してください"
                    />
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors duration-200"
                            disabled={loading}
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? '処理中...' : '取得する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 