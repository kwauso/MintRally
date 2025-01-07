"use client"

import React from 'react'

export default function ooPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">oo</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                    マスターアドレス: 0x54c6535c32d7406a28abba9a6abfbfa37405e2c5
                </p>
                <div className="mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        イベントを追加
                    </button>
                </div>
            </div>
        </div>
    )
}