import { createEvent } from '../../lib/data'
import { prisma } from '../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { uploadToLighthouse, uploadMetadataToLighthouse } from '../../../blockchain/utils/lighthouse'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../../../blockchain/constants'

// イベント一覧を取得するGETメソッド
export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                date: 'desc'
            },
            include: {
                eventGroup: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            events
        })

    } catch (error) {
        console.error('イベント一覧取得エラー:', error)
        return NextResponse.json({
            success: false,
            message: 'イベントの取得に失敗しました',
            error: (error as Error).message
        }, { status: 500 })
    }
}

// 既存のPOSTメソッド
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        
        // フォームデータの検証
        const name = formData.get('name');
        const description = formData.get('description');
        const date = formData.get('date');
        const eventGroupId = formData.get('eventGroupId');
        const creator_address = formData.get('creator_address');
        const nftEnabled = formData.get('nftEnabled') === 'true';
        const pass = formData.get('pass');
        const nftMetadataUrl = formData.get('nftMetadataUrl');

        // 必須フィールドの検証
        if (!name || !description || !date || !eventGroupId || !creator_address) {
            return NextResponse.json({
                success: false,
                message: '必須フィールドが不足しています',
                error: 'Required fields missing'
            }, { status: 400 });
        }

        // NFTが有効な場合、メタデータURLは必須
        if (nftEnabled && !nftMetadataUrl) {
            return NextResponse.json({
                success: false,
                message: 'NFTメタデータURLが必要です',
                error: 'NFT metadata URL required'
            }, { status: 400 });
        }

        // 1. まずイベントをデータベースに保存
        const event = await prisma.event.create({
            data: {
                name: name as string,
                description: description as string,
                date: new Date(date as string),
                eventGroupId: parseInt(eventGroupId as string),
                creator_address: creator_address as string,
                nftEnabled: nftEnabled,
                nftTokenURI: nftMetadataUrl as string
            }
        });

        // 2. NFTが有効な場合、バックグラウンドで処理を開始
        if (nftEnabled && nftMetadataUrl) {
            setupNFTInBackground(
                event.id, 
                creator_address as string, 
                nftMetadataUrl as string
            );
        }

        // 3. すぐにレスポンスを返す
        return NextResponse.json({
            success: true,
            data: { event }
        });

    } catch (error) {
        console.error('Event creation error:', error);
        return NextResponse.json({
            success: false,
            message: 'イベントの作成に失敗しました',
            error: error.message
        }, { status: 500 });
    }
}

// バックグラウンド処理関数を追加
async function setupNFTInBackground(
    eventId: number,
    creatorAddress: string,
    metadataUrl: string
) {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
        const nftContract = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            NFT_CONTRACT_ABI,
            wallet
        );

        // イベント作成者とメタデータの設定
        const setCreatorTx = await nftContract.setEventCreator(eventId, creatorAddress);
        await setCreatorTx.wait();

        const setNftTx = await nftContract.setEventNFT(eventId, metadataUrl);
        await setNftTx.wait();

    } catch (error) {
        console.error('NFT setup error:', error);
        
        // エラー時はイベントを削除
        try {
            await prisma.event.delete({
                where: { id: eventId }
            });
        } catch (deleteError) {
            console.error('Event deletion error:', deleteError);
        }
    }
}