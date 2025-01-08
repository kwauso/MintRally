"use client"

import { useState } from 'react'

type EventFormProps = {
    initialData?: {
        name: string;
        description: string;
        date: string;
        pass?: string;
        nftEnabled: boolean;
    };
    eventGroupId: number;
    onSubmit: (data: {
        name: string;
        description: string;
        date: string;
        pass?: string;
        nftEnabled: boolean;
        eventGroupId: number;
    }) => void;
};

export default function EventForm({ initialData, eventGroupId, onSubmit }: EventFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        date: initialData?.date || '',
        pass: initialData?.pass || '',
        nftEnabled: initialData?.nftEnabled || false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            eventGroupId
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
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
                    placeholder="イベント名を入力してください"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="イベントの説明を入力してください"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    開催日時
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

            <div className="form-control">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="nftEnabled"
                        checked={formData.nftEnabled}
                        onChange={handleChange}
                        className="checkbox"
                    />
                    <span className="label-text">NFTを有効にする</span>
                </label>
            </div>

            {formData.nftEnabled && (
                <div className="mb-4">
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
                        placeholder="パスワードを入力してください"
                    />
                </div>
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