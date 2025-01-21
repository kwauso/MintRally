'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../../blockchain/constants'

interface NFTInfo {
    tokenId: number
    eventId: number
    tokenURI: string
    metadata?: {
        name: string
        description: string
        image: string
    }
    eventGroupId?: number
    eventGroupName?: string
}

interface GroupedNFTs {
    [key: string]: {
        groupName: string
        nfts: NFTInfo[]
    }
}

// メタデータキャッシュ
const metadataCache = new Map<string, any>()

export default function MyPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [nfts, setNfts] = useState<GroupedNFTs>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            router.push('/login')
            return
        }

        fetchUserNFTs()
    }, [user])

    const fetchMetadata = async (tokenURI: string) => {
        try {
            if (metadataCache.has(tokenURI)) {
                return metadataCache.get(tokenURI)
            }

            const response = await fetch(tokenURI)
            const metadata = await response.json()
            metadataCache.set(tokenURI, metadata)
            return metadata
        } catch (error) {
            console.error('Error fetching metadata:', error)
            return null
        }
    }

    const fetchUserNFTs = async () => {
        try {
            if (!window.ethereum || !user?.account) {
                console.log('MetaMask not found or user not connected')
                return
            }

            const provider = new ethers.BrowserProvider(window.ethereum)
            const nftContract = new ethers.Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_CONTRACT_ABI,
                provider
            )

            // Transfer イベントをフィルタリング
            const filter = nftContract.filters.Transfer(null, user.account, null)
            const transferEvents = await nftContract.queryFilter(filter)
            console.log('Found Transfer events:', transferEvents.length)

            const tempNFTs: NFTInfo[] = []

            // NFT情報の取得
            for (const event of transferEvents) {
                const log = event as unknown as { args: [string, string, bigint] }
                const tokenId = log.args[2]
                
                if (!tokenId) continue

                try {
                    const currentOwner = await nftContract.ownerOf(tokenId)
                    
                    if (currentOwner.toLowerCase() === user.account.toLowerCase()) {
                        const eventId = await nftContract.eventIds(tokenId)
                        const tokenURI = await nftContract.tokenURI(tokenId)
                        const metadata = await fetchMetadata(tokenURI)

                        tempNFTs.push({
                            tokenId: Number(tokenId),
                            eventId: Number(eventId),
                            tokenURI,
                            metadata
                        })
                    }
                } catch (error) {
                    console.error(`Error processing token ${tokenId}:`, error)
                    continue
                }
            }

            // イベントグループ情報の取得
            const groupedNFTs: GroupedNFTs = {}
            
            // APIからイベント情報を取得
            const eventsResponse = await fetch('/api/event')
            const eventsData = await eventsResponse.json()
            const eventsList = eventsData.events

            // NFTをグループごとに整理
            for (const nft of tempNFTs) {
                const event = eventsList.find((e: any) => e.id === nft.eventId)
                if (event) {
                    const groupId = event.eventGroupId
                    const groupName = event.eventGroup.name || 'その他'
                    
                    if (!groupedNFTs[groupId]) {
                        groupedNFTs[groupId] = {
                            groupName,
                            nfts: []
                        }
                    }
                    groupedNFTs[groupId].nfts.push({
                        ...nft,
                        eventGroupId: groupId,
                        eventGroupName: groupName
                    })
                }
            }

            setNfts(groupedNFTs)
            setLoading(false)

        } catch (error) {
            console.error('Error fetching NFTs:', error)
            setLoading(false)
        }
    }

    const handleNFTClick = (tokenId: number) => {
        router.push(`/nft/${tokenId}`)
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-lg">ログインが必要です...</p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-lg">NFTを読み込み中...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mypage-container">
            <strong><h1 className="mypage-title" style={{ color: '#552306' }}>NFT Collection</h1></strong>
            
            <div className="wallet-section">
                <h2 className="wallet-title">アドレス</h2>
                <p>
                    {user.account}
                </p>
            </div>

            <div className="nft-section">
                {Object.keys(nfts).length === 0 ? (
                    <div className="nft-empty">
                        <p className="text-gray-600">NFTを保有していません</p>
                    </div>
                ) : (
                    <div>
                        {Object.entries(nfts).map(([groupId, group]) => (
                            <div key={groupId} className="nft-group">
                                <h3 className="nft-group-title">
                                    {group.groupName}
                                </h3>
                                <div className="nft-grid">
                                    {group.nfts.map((nft) => (
                                        <div 
                                            key={nft.tokenId} 
                                            className="nft-card"
                                            onClick={() => handleNFTClick(nft.tokenId)}
                                            role="button"
                                            tabIndex={0}
                                        >
                                            {nft.metadata?.image && (
                                                <div className="nft-image-container">
                                                    <img 
                                                        src={nft.metadata.image} 
                                                        alt={nft.metadata.name || `NFT #${nft.tokenId}`} 
                                                        className="nft-image"
                                                        style={{ maxHeight: '128px' }}
                                                    />
                                                </div>
                                            )}
                                            <h3 className="nft-name">
                                                {nft.metadata?.name || `NFT #${nft.tokenId}`}
                                            </h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}