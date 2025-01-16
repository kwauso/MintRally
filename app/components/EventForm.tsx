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

    const inputClassName = `
        w-full 
        px-15 
        py-6 
        bg-white 
        border-2 
        border-gray-100 
        rounded-3xl 
        focus:ring-2 
        focus:ring-blue-500
        focus:border-transparent 
        transition-all 
        duration-200 
        ease-in-out 
        hover:border-gray-200 
        placeholder-gray-400 
        text-gray-600 
        text-xl 
        shadow-sm 
        outline-none
        min-w-[500px]
    `

    return (
        <form onSubmit={handleSubmit} className="space-y-12 w-full max-w-4xl mx-auto">
            <div className="form-group">
                <label htmlFor="name" className="block text-xl font-medium text-gray-700 mb-4 ml-3">
                    イベント名
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                    placeholder=""
                />
            </div>

            <div className="form-group">
                <label htmlFor="description" className="block text-xl font-medium text-gray-700 mb-4 ml-3">
                    説明
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`${inputClassName} min-h-[240px] resize-y`}
                    required
                    placeholder="イベントの説明を入力"
                />
            </div>

            <div className="form-group">
                <label htmlFor="date" className="block text-xl font-medium text-gray-700 mb-4 ml-3">
                    開催日時
                </label>
                <input
                    id="date"
                    name="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={handleChange}
                    className={inputClassName}
                    required
                />
            </div>

            <div className="form-group">
                <label className="flex items-center space-x-4 p-8 bg-white border-2 border-gray-100 rounded-3xl hover:border-gray-200 transition-all duration-200 cursor-pointer shadow-sm">
                    <input
                        type="checkbox"
                        name="nftEnabled"
                        checked={formData.nftEnabled}
                        onChange={handleChange}
                        className="h-8 w-8 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-xl transition-all duration-200"
                    />
                    <span className="text-xl font-medium text-gray-700">NFTを有効にする</span>
                </label>
            </div>

            {formData.nftEnabled && (
                <div className="space-y-10 border-t-2 border-gray-100 pt-12">
                    <div className="form-group">
                        <label htmlFor="pass" className="block text-xl font-medium text-gray-700 mb-4 ml-3">
                            NFT取得用パスワード
                        </label>
                        <input
                            id="pass"
                            name="pass"
                            type="password"
                            value={formData.pass}
                            onChange={handleChange}
                            className={inputClassName}
                            required={formData.nftEnabled}
                            placeholder="パスワードを設定"
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-xl font-medium text-gray-700 mb-4 ml-3">
                            NFT画像
                        </label>
                        <div className="w-full">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full text-xl text-gray-600 file:mr-4 file:py-5 file:px-10 file:rounded-3xl file:border-0 file:text-xl file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-all file:duration-200"
                                required={formData.nftEnabled}
                            />
                        </div>
                        {previewUrl && (
                            <div className="mt-8">
                                <Image
                                    src={previewUrl}
                                    alt="NFT preview"
                                    width={400}
                                    height={400}
                                    className="rounded-3xl object-cover shadow-md"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="form-group mt-14">
                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-2xl font-medium px-10 py-8 rounded-3xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    disabled={!formData.name.trim()}
                >
                    {initialData ? '更新する' : 'イベントを作成'}
                </button>
            </div>
        </form>
    );
}