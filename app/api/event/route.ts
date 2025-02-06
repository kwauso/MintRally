import { createEvent } from '../../lib/data'
import { prisma } from '../../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { uploadToLighthouse, uploadMetadataToLighthouse } from '../../../blockchain/utils/lighthouse'
import { ethers } from 'ethers'
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from '../../../blockchain/constants'

// イベント一覧を取得するGETメソッド
export async function GET(request: NextRequest) {
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
        const nftImageFile = formData.get('nftImageFile') as File | null;

        // 必須フィールドの検証
        if (!name || !description || !date || !eventGroupId || !creator_address) {
            return NextResponse.json({
                success: false,
                message: '必須フィールドが不足しています',
                error: 'Required fields missing'
            }, { status: 400 });
        }

        // NFTが有効な場合、画像ファイルは必須
        if (nftEnabled && !nftImageFile) {
            return NextResponse.json({
                success: false,
                message: 'NFTを有効にする場合は画像が必要です',
                error: 'NFT image required'
            }, { status: 400 });
        }

        let nftMetadataUrl = null;

        // NFTが有効な場合、先にアップロードと設定を完了
        if (nftEnabled && nftImageFile) {
            try {
                // 1. 画像のアップロード
                console.log('Uploading image to Lighthouse...');
                const nftImageUrl = await uploadToLighthouse(nftImageFile);
                console.log('Image uploaded successfully:', nftImageUrl);

                // 2. メタデータの作成とアップロード
                const metadata = {
                    name: name,
                    description: description,
                    image: nftImageUrl,
                    attributes: [
                        {
                            trait_type: "Event Date",
                            value: date
                        },
                        {
                            trait_type: "Creator",
                            value: creator_address
                        }
                    ]
                };

                console.log('Uploading metadata to Lighthouse...');
                nftMetadataUrl = await uploadMetadataToLighthouse(metadata);
                console.log('Metadata uploaded successfully:', nftMetadataUrl);

            } catch (error) {
                console.error('NFT setup error:', error);
                return NextResponse.json({
                    success: false,
                    message: 'NFTの設定に失敗しました',
                    error: error.message
                }, { status: 500 });
            }
        }

        // イベントをデータベースに保存
        const event = await prisma.event.create({
            data: {
                name: name as string,
                description: description as string,
                date: new Date(date as string),
                eventGroupId: parseInt(eventGroupId as string),
                creator_address: creator_address as string,
                pass: pass as string || null,
                nftEnabled: nftEnabled,
                nftTokenURI: nftMetadataUrl
            },
            include: {
                eventGroup: true
            }
        });

        // NFTが有効な場合、スマートコントラクトの設定
        if (nftEnabled && nftMetadataUrl) {
            try {
                // Alchemyのプロバイダー設定
                const alchemyUrl = process.env.ALCHEMY_API_URL;
                if (!alchemyUrl) {
                    throw new Error('Alchemy URL is not configured');
                }

                console.log('Connecting to Alchemy...');
                const provider = new ethers.JsonRpcProvider(alchemyUrl);

                // プロバイダーの接続確認
                try {
                    const network = await provider.getNetwork();
                    console.log('Connected to network:', network.name);
                } catch (error) {
                    console.error('Failed to connect to Alchemy:', error);
                    throw new Error('ブロックチェーンネットワークへの接続に失敗しました');
                }

                const privateKey = process.env.PRIVATE_KEY;
                if (!privateKey) {
                    throw new Error('Private key is not configured');
                }

                const wallet = new ethers.Wallet(privateKey, provider);
                console.log('Wallet connected:', wallet.address);

                const nftContract = new ethers.Contract(
                    NFT_CONTRACT_ADDRESS,
                    NFT_CONTRACT_ABI,
                    wallet
                );

                // イベント作成者を設定
                console.log('Setting event creator...');
                const setCreatorTx = await nftContract.setEventCreator(event.id, creator_address);
                console.log('Waiting for setCreator transaction...');
                await setCreatorTx.wait();
                console.log('Event creator set successfully');

                // NFTメタデータURIを設定
                console.log('Setting NFT metadata...');
                const setNftTx = await nftContract.setEventNFT(event.id, nftMetadataUrl);
                console.log('Waiting for setNFT transaction...');
                await setNftTx.wait();
                console.log('NFT metadata set successfully');

            } catch (error) {
                console.error('Smart contract error:', error);
                // スマートコントラクトの設定に失敗した場合、作成したイベントを削除
                await prisma.event.delete({
                    where: { id: event.id }
                });

                return NextResponse.json({
                    success: false,
                    message: 'スマートコントラクトの設定に失敗しました',
                    error: error.message
                }, { status: 500 });
            }
        }

        return NextResponse.json({
            success: true,
            data: { event }
        });

    } catch (error) {
        console.error('Error in POST /api/event:', error);
        return NextResponse.json({
            success: false,
            message: 'イベントの作成に失敗しました',
            error: error.message || 'Unknown error'
        }, { status: 500 });
    }
}