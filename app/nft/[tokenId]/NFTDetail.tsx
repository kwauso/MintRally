'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../../../blockchain/constants'

interface NFTDetail {
    tokenId: number
    eventId: number
    tokenURI: string
    owner: string
    metadata?: {
        name: string
        description: string
        image: string
        attributes?: Array<{
            trait_type: string
            value: string
        }>
    }
}

export default function NFTDetail({ tokenId }: { tokenId: string }) {
    const router = useRouter()
    const [nft, setNft] = useState<NFTDetail | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNFTDetails()
    }, [tokenId])

    const fetchNFTDetails = async () => {
        try {
            if (!window.ethereum) return

            const provider = new ethers.BrowserProvider(window.ethereum)
            const nftContract = new ethers.Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_CONTRACT_ABI,
                provider
            )

            const owner = await nftContract.ownerOf(tokenId)
            const eventId = await nftContract.eventIds(tokenId)
            const tokenURI = await nftContract.tokenURI(tokenId)
            
            // メタデータの取得
            const response = await fetch(tokenURI)
            const metadata = await response.json()

            setNft({
                tokenId: Number(tokenId),
                eventId: Number(eventId),
                tokenURI,
                owner,
                metadata
            })
            setLoading(false)

        } catch (error) {
            console.error('Error fetching NFT details:', error)
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="nft-detail-container">
                <div className="loading">Loading...</div>
            </div>
        )
    }

    if (!nft) {
        return (
            <div className="nft-detail-container">
                <div className="error">NFTが見つかりませんでした</div>
            </div>
        )
    }

    return (
        <div className="nft-detail-container">
            <button 
                onClick={() => router.back()} 
                className="back-button"
            >
                ← 戻る
            </button>

            <div className="nft-detail-content">
                <div className="nft-detail-image-container">
                    {nft.metadata?.image && (
                        <img 
                            src={nft.metadata.image} 
                            alt={nft.metadata.name || `NFT #${nft.tokenId}`}
                            className="nft-detail-image" 
                        />
                    )}
                </div>

                <div className="nft-detail-info">
                    <h1 className="nft-detail-title">
                        {nft.metadata?.name || `NFT #${nft.tokenId}`}
                    </h1>

                    {nft.metadata?.description && (
                        <p className="nft-detail-description">
                            {nft.metadata.description}
                        </p>
                    )}
                    
                    <div className="nft-detail-metadata">
                        <div className="metadata-item">
                            <span className="metadata-label">所有者:</span>
                            <span className="metadata-value">{nft.owner}</span>
                        </div>
                    </div>

                    {nft.metadata?.attributes && (
                        <div className="nft-attributes">
                            <h2 className="attributes-title">Information</h2>
                            <div className="attributes-grid">
                                {nft.metadata.attributes.map((attr, index) => (
                                    <div key={index} className="attribute-item">
                                        <span className="attribute-type">{attr.trait_type}</span>
                                        <span className={`attribute-value ${attr.trait_type === 'creator' ? 'address-text' : ''}`}>
                                            {attr.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 