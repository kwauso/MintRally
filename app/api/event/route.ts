import { createEvent } from '../../lib/data'
import { prisma } from '../../lib/prisma'
import { NextResponse } from 'next/server'
import { uploadToLighthouse, uploadMetadataToLighthouse } from '../../../blockchain/utils/lighthouse'

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
export async function POST(request: Request) {
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

        console.log('Received form data:', {
            name,
            description,
            date,
            eventGroupId,
            creator_address,
            nftEnabled,
            hasPass: !!pass,
            hasImage: !!nftImageFile
        });
        
        let nftImageUrl = '';
        let nftMetadataUrl = '';

        if (nftEnabled && nftImageFile) {
            try {
                console.log('Uploading image to Lighthouse...');
                nftImageUrl = await uploadToLighthouse(nftImageFile);
                console.log('Image uploaded successfully:', nftImageUrl);

                const metadata = {
                    name: name,
                    description: description,
                    image: nftImageUrl,
                    attributes: [
                        {
                            trait_type: "Event Date",
                            value: date
                        }
                    ]
                };

                console.log('Uploading metadata to Lighthouse...');
                nftMetadataUrl = await uploadMetadataToLighthouse(metadata);
                console.log('Metadata uploaded successfully:', nftMetadataUrl);
            } catch (uploadError) {
                console.error('Error during file upload:', uploadError);
                throw new Error(`ファイルのアップロードに失敗しました: ${uploadError.message}`);
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
                nftTokenURI: nftMetadataUrl || null
            },
            include: {
                eventGroup: true
            }
        });

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