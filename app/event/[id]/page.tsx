"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import NFTClaim from '../../../app/components/NFTClaim'

export default function EventDetail() {
    const [event, setEvent] = useState<any>(null)
    const params = useParams()
    const eventId = params.id as string

    return (
        <div className="container mx-auto p-4">
            {event && event.nftEnabled && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-4">NFTを取得</h2>
                    <NFTClaim eventId={parseInt(eventId)} />
                </div>
            )}
        </div>
    )
}