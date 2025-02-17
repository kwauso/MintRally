import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../../../../../blockchain/constants'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const eventId = parseInt((await params).eventId);
        
        const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
        const nftContract = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            NFT_CONTRACT_ABI,
            provider
        );

        const creator = await nftContract.getEventCreator(eventId);
        const metadata = await nftContract.getEventNFT(eventId);

        return NextResponse.json({
            success: true,
            data: {
                isCreatorSet: creator !== ethers.ZeroAddress,
                isMetadataSet: metadata !== ''
            }
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}