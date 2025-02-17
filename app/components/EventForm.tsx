"use client"

import { useState } from 'react'
import Image from 'next/image'
import { uploadToLighthouse, uploadMetadataToLighthouse } from '../../blockchain/utils/lighthouse'
import { useRouter } from 'next/navigation'
import NFTSetupProgress from './NFTSetupProgress'

export default function EventForm({ 
    eventGroupId, 
    onSubmit 
}: { 
    eventGroupId: number;
    onSubmit: (formData: FormData) => Promise<void>;
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [nftEnabled, setNftEnabled] = useState(false)
    const [nftImageFile, setNftImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [createdEventId, setCreatedEventId] = useState<number | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            formData.append('eventGroupId', eventGroupId.toString())
            formData.append('nftEnabled', nftEnabled.toString())
            
            if (nftEnabled && nftImageFile) {
                try {
                    // 1. 画像のアップロード（クライアントサイドで実行）
                    console.log('Uploading image to Lighthouse...')
                    const nftImageUrl = await uploadToLighthouse(nftImageFile)
                    console.log('Image uploaded successfully:', nftImageUrl)

                    // 2. メタデータの作成とアップロード（クライアントサイドで実行）
                    const metadata = {
                        name: formData.get('name'),
                        description: formData.get('description'),
                        image: nftImageUrl,
                        attributes: [
                            {
                                trait_type: "Event Date",
                                value: formData.get('date')
                            },
                            {
                                trait_type: "Creator",
                                value: formData.get('creator_address')
                            }
                        ]
                    }

                    console.log('Uploading metadata to Lighthouse...')
                    const nftMetadataUrl = await uploadMetadataToLighthouse(metadata)
                    console.log('Metadata uploaded successfully:', nftMetadataUrl)

                    // URLをformDataに追加
                    formData.append('nftMetadataUrl', nftMetadataUrl)
                } catch (error) {
                    console.error('NFT setup error:', error)
                    throw new Error('NFTの設定に失敗しました')
                }
            }

            // onSubmitを使用してAPIリクエストを行う
            await onSubmit(formData)

            // APIレスポンスを取得
            const response = await fetch('/api/event', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()
            if (!data.success) {
                throw new Error(data.message || '不明なエラーが発生しました')
            }

            setCreatedEventId(data.data.event.id)

            if (!nftEnabled) {
                router.push(`/event-groups/${eventGroupId}`)
                router.refresh()
            }

        } catch (error) {
            console.error('Form submission error:', error)
            alert('エラーが発生しました: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">
                        イベント名
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="form-input"
                        required
                        placeholder=""
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        説明
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-input min-h-[120px] resize-y"
                        required
                        placeholder=""
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="date" className="form-label">
                        開催日時
                    </label>
                    <input
                        id="date"
                        name="date"
                        type="datetime-local"
                        className="form-input"
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
                        <span className="form-label">NFTを有効にする</span>
                    </label>
                </div>

                {nftEnabled && (
                    <div className="space-y-6 border-t border-gray-200 pt-6">
                        <div className="form-group">
                            <label htmlFor="pass" className="form-label">
                                あいことば
                            </label>
                            <input
                                id="pass"
                                name="pass"
                                type="password"
                                className="form-input"
                                required={nftEnabled}
                                placeholder=""
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                NFT画像
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400 transition-all duration-200">
                                <div className="space-y-1 text-center">
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>画像をアップロード</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null
                                                    setNftImageFile(file)
                                                    if (file) {
                                                        const reader = new FileReader()
                                                        reader.onloadend = () => {
                                                            setImagePreview(reader.result as string)
                                                        }
                                                        reader.readAsDataURL(file)
                                                    }
                                                }}
                                                className="sr-only"
                                                required={nftEnabled}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {imagePreview && (
                                <div style={{ marginTop: '1rem' }}>
                                    <p style={{ 
                                        fontSize: '0.875rem', 
                                        fontWeight: '500', 
                                        color: '#374151',
                                        marginBottom: '0.5rem' 
                                    }}>
                                        画像:
                                    </p>
                                    <div style={{ 
                                        position: 'relative',
                                        width: '256px',
                                        height: '256px',
                                        borderRadius: '0.5rem',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="form-group mt-8">
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? '作成中...' : 'イベントを作成'}
                    </button>
                </div>
            </form>

            {createdEventId && nftEnabled && (
                <div className="mt-8">
                    <NFTSetupProgress eventId={createdEventId} />
                </div>
            )}
        </div>
    )
}