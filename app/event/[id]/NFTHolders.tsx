'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../../../blockchain/constants'

interface NFTHolder {
    tokenId: number
    owner: string
}

export default function NFTHolders({ eventId }: { eventId: number }) {
    const [holders, setHolders] = useState<NFTHolder[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNFTHolders()
    }, [eventId])

    const fetchNFTHolders = async () => {
        try {
            if (!window.ethereum) return

            const provider = new ethers.BrowserProvider(window.ethereum)
            const nftContract = new ethers.Contract(
                NFT_CONTRACT_ADDRESS,
                NFT_CONTRACT_ABI,
                provider
            )

            // イベントに関連するすべてのTransferイベントを取得
            const filter = nftContract.filters.Transfer()
            const events = await nftContract.queryFilter(filter)
            
            const holderMap = new Map<number, string>() // tokenId -> owner

            // 最新の所有者情報を取得
            for (const event of events) {
                const log = event as unknown as { args: [string, string, bigint] }
                const [, to, tokenId] = log.args
                
                try {
                    // このトークンIDがこのイベントのものか確認
                    const tokenEventId = await nftContract.eventIds(tokenId)
                    if (Number(tokenEventId) === eventId) {
                        // 現在の所有者を確認
                        const currentOwner = await nftContract.ownerOf(tokenId)
                        holderMap.set(Number(tokenId), currentOwner)
                    }
                } catch (error) {
                    console.error(`Error processing token ${tokenId}:`, error)
                    continue
                }
            }

            // Map を配列に変換
            const holdersList = Array.from(holderMap.entries()).map(([tokenId, owner]) => ({
                tokenId,
                owner
            }))

            setHolders(holdersList)
            setLoading(false)

        } catch (error) {
            console.error('Error fetching NFT holders:', error)
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="loading">Loading holders...</div>
    }

    return (
        <div className="nft-holders">
            <br></br>
            <h2 className="holders-title">
                NFT Holders ({holders.length})
            </h2>
            {holders.length === 0 ? (
                <p className="no-holders">No NFT Holders</p>
            ) : (
                <div className="holders-list">
                    {holders.map((holder) => (
                        <div key={holder.tokenId} className="holder-item">
                            <span className="holder-token">Token #{holder.tokenId}</span>
                            <span className="holder-address">{holder.owner}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
} 