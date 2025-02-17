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
                    console.log("nftMetadataUrl:", nftMetadataUrl)
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
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="name" style={{ marginBottom: '0.5rem' }}>
                        イベント名
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                        required
                        placeholder=""
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="description" style={{ marginBottom: '0.5rem' }}>
                        説明
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem', minHeight: '120px', resize: 'vertical' }}
                        required
                        placeholder=""
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="date" style={{ marginBottom: '0.5rem' }}>
                        開催日時
                    </label>
                    <input
                        id="date"
                        name="date"
                        type="datetime-local"
                        style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={nftEnabled}
                            onChange={(e) => setNftEnabled(e.target.checked)}
                            style={{ height: '1.25rem', width: '1.25rem', accentColor: '#2563eb', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                        />
                        <span style={{ marginBottom: '0.5rem' }}>NFTを有効にする</span>
                    </label>
                </div>

                {nftEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label htmlFor="pass" style={{ marginBottom: '0.5rem' }}>
                                あいことば
                            </label>
                            <input
                                id="pass"
                                name="pass"
                                type="password"
                                style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                                required={nftEnabled}
                                placeholder=""
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ marginBottom: '0.5rem' }}>
                                NFT画像
                            </label>
                            <div style={{ padding: '1.5rem', border: '2px dashed #e5e7eb', borderRadius: '0.75rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                    <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                                        <label htmlFor="file-upload" style={{ color: '#2563eb', cursor: 'pointer' }}>
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
                                                style={{ display: 'none' }}
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
                                        プレビュー:
                                    </p>
                                    <div style={{ 
                                        position: 'relative',
                                        width: '128px',
                                        height: '128px',
                                        backgroundColor: '#f3f4f6',
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

                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem' }}>
                    <button 
                        type="submit" 
                        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                        disabled={loading}
                    >
                        {loading ? '作成中...' : 'イベントを作成'}
                    </button>
                </div>
            </form>

            {createdEventId && nftEnabled && (
                <div style={{ marginTop: '2rem' }}>
                    <NFTSetupProgress eventId={createdEventId} />
                </div>
            )}
        </div>
    )
}