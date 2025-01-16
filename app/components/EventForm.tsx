"use client"

import { useState } from 'react'
import Image from 'next/image'
import { uploadToLighthouse, mintNFT } from '../../blockchain/utils/lighthouse'

export default function EventForm({ 
    eventGroupId, 
    onSubmit 
}: { 
    eventGroupId: number;
    onSubmit: (formData: FormData) => Promise<void>;
}) {
    const [loading, setLoading] = useState(false)
    const [nftEnabled, setNftEnabled] = useState(false)
    const [nftImageFile, setNftImageFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            formData.append('eventGroupId', eventGroupId.toString())
            formData.append('nftEnabled', nftEnabled.toString())
            
            if (nftEnabled && nftImageFile) {
                formData.append('nftImageFile', nftImageFile)
            }

            await onSubmit(formData)
        } catch (error) {
            console.error('Form submission error:', error)
            alert('エラーが発生しました: ' + (error as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="form-group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    イベント名
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:bg-gray-100 placeholder-gray-400"
                    required
                    placeholder="例: Web3カンファレンス2024"
                />
            </div>

            <div className="form-group">
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    説明
                </label>
                <textarea
                    id="description"
                    name="description"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:bg-gray-100 placeholder-gray-400 min-h-[120px] resize-y"
                    required
                    placeholder="イベントの詳細な説明を入力してください"
                />
            </div>

            <div className="form-group">
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                    開催日時
                </label>
                <input
                    id="date"
                    name="date"
                    type="datetime-local"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:bg-gray-100"
                    required
                />
            </div>

            <div className="form-group">
                <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={nftEnabled}
                        onChange={(e) => setNftEnabled(e.target.checked)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md transition-all duration-200"
                    />
                    <span className="text-sm font-semibold text-gray-700">NFTを有効にする</span>
                </label>
            </div>

            {nftEnabled && (
                <div className="space-y-6 border-t border-gray-200 pt-6">
                    <div className="form-group">
                        <label htmlFor="pass" className="block text-sm font-semibold text-gray-700 mb-2">
                            NFT取得用パスワード
                        </label>
                        <input
                            id="pass"
                            name="pass"
                            type="password"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:bg-gray-100 placeholder-gray-400"
                            required={nftEnabled}
                            placeholder="安全なパスワードを設定してください"
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            NFT画像
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400 transition-all duration-200">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>画像をアップロード</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setNftImageFile(e.target.files?.[0] || null)}
                                            className="sr-only"
                                            required={nftEnabled}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        {nftImageFile && (
                            <div className="mt-4">
                                <Image
                                    src={URL.createObjectURL(nftImageFile)}
                                    alt="NFT preview"
                                    width={200}
                                    height={200}
                                    className="rounded-xl object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="form-group mt-8">
                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    disabled={loading}
                >
                    {loading ? '作成中...' : 'イベントを作成'}
                </button>
            </div>
        </form>
    )
}