"use client"

import { useState } from 'react'
import Image from 'next/image'

type EventFormProps = {
    initialData?: {
        name: string;
        description: string;
        date: string;
        pass?: string;
        nftEnabled: boolean;
    };
    eventGroupId: number;
    onSubmit: (data: FormData) => void;
};

export default function EventForm({ initialData, eventGroupId, onSubmit }: EventFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        date: initialData?.date || '',
        pass: initialData?.pass || '',
        nftEnabled: initialData?.nftEnabled || false
    });

    const [nftImageFile, setNftImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNftImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formDataToSubmit = new FormData();

        formDataToSubmit.append('name', formData.name);
        formDataToSubmit.append('description', formData.description);
        formDataToSubmit.append('date', formData.date);
        formDataToSubmit.append('eventGroupId', eventGroupId.toString());
        formDataToSubmit.append('nftEnabled', formData.nftEnabled.toString());

        if (formData.nftEnabled && formData.pass) {
            formDataToSubmit.append('pass', formData.pass);
        }

        if (formData.nftEnabled && nftImageFile) {
            formDataToSubmit.append('nftImageFile', nftImageFile);
        }

        console.log('Submitting form data:', {
            name: formData.name,
            description: formData.description,
            date: formData.date,
            eventGroupId: eventGroupId,
            nftEnabled: formData.nftEnabled,
            hasPass: !!formData.pass,
            hasImage: !!nftImageFile
        });

        onSubmit(formDataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    イベント名
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    開催日
                </label>
                <input
                    id="date"
                    name="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="nftEnabled"
                        checked={formData.nftEnabled}
                        onChange={handleChange}
                        className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">NFTを有効にする</span>
                </label>
            </div>

            {formData.nftEnabled && (
                <>
                    <div>
                        <label htmlFor="pass" className="block text-sm font-medium text-gray-700 mb-1">
                            NFT取得用パスワード
                        </label>
                        <input
                            id="pass"
                            name="pass"
                            type="password"
                            value={formData.pass}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required={formData.nftEnabled}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            NFT画像
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full"
                            required={formData.nftEnabled}
                        />
                        {previewUrl && (
                            <div className="mt-2">
                                <Image
                                    src={previewUrl}
                                    alt="NFT preview"
                                    width={200}
                                    height={200}
                                    className="rounded-lg"
                                />
                            </div>
                        )}
                    </div>
                </>
            )}

            <button 
                type="submit" 
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
                disabled={!formData.name.trim()}
            >
                {initialData ? '更新' : '作成'}
            </button>
        </form>
    );
}