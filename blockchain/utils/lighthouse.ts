import lighthouse from '@lighthouse-web3/sdk';

const API_KEY = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || '';

if (!API_KEY) {
    throw new Error('Lighthouse API key is not set');
}

export async function uploadToLighthouse(file: File) {
    try {
        console.log('Starting file upload to Lighthouse...');
        
        // ファイルをArrayBufferに変換
        const arrayBuffer = await file.arrayBuffer();
        console.log('File converted to ArrayBuffer');
        
        // ArrayBufferをBufferに変換
        const buffer = Buffer.from(arrayBuffer);
        console.log('ArrayBuffer converted to Buffer');

        // Bufferを使用してアップロード
        console.log('Uploading buffer to Lighthouse...');
        const response = await lighthouse.uploadBuffer(
            buffer,
            API_KEY
        );
        console.log('Upload response:', response);

        if (!response.data || !response.data.Hash) {
            throw new Error('Invalid response from Lighthouse');
        }

        const url = `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
        console.log('File uploaded successfully to:', url);
        return url;

    } catch (error: any) {
        console.error('Detailed error in uploadToLighthouse:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        throw new Error(`Lighthouse upload failed: ${error.message}`);
    }
}

export async function uploadMetadataToLighthouse(metadata: any) {
    try {
        console.log('Starting metadata upload to Lighthouse...');
        
        // メタデータをJSON文字列に変換
        const jsonString = JSON.stringify(metadata);
        console.log('Metadata converted to JSON string');
        
        // 文字列をBufferに変換
        const buffer = Buffer.from(jsonString);
        console.log('JSON string converted to Buffer');

        console.log('Uploading metadata buffer to Lighthouse...');
        const response = await lighthouse.uploadBuffer(
            buffer,
            API_KEY
        );
        console.log('Metadata upload response:', response);

        if (!response.data || !response.data.Hash) {
            throw new Error('Invalid response from Lighthouse');
        }

        const url = `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`;
        console.log('Metadata uploaded successfully to:', url);
        return url;

    } catch (error: any) {
        console.error('Detailed error in uploadMetadataToLighthouse:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        throw new Error(`Lighthouse metadata upload failed: ${error.message}`);
    }
}