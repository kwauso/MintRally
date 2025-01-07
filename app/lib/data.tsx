"use server"

import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function createEventGroup(name: string, master_address: string) {
    try {
        console.log('データベース作成開始:', { name, master_address }) // デバッグログ

        // データベースに保存
        const result = await prisma.eventgroup.create({
            data: {
                name,
                master_address,
            }
        })

        console.log('データベース作成結果:', result) // デバッグログ

        // 結果がnullの場合はエラーを投げる
        if (!result) {
            throw new Error('データベースへの保存に失敗しました')
        }

        // ディレクトリの作成は成功/失敗に関わらず、データベースの結果を返す
        try {
            const dirPath = path.join(process.cwd(), 'app', 'event-groups', name)
            await fs.mkdir(dirPath, { recursive: true })
            
            // page.tsxファイルを作成
            const pageContent = `"use client"

import React from 'react'

export default function ${name.replace(/[^a-zA-Z0-9]/g, '')}Page() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">${name}</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                    マスターアドレス: ${master_address}
                </p>
                {user?.account === "${master_address}" && (
                    <div className="mt-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            イベントを追加
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}`

            await fs.writeFile(path.join(dirPath, 'page.tsx'), pageContent)
            console.log('ディレクトリとファイルを作成:', dirPath)
        } catch (error) {
            console.error('ディレクトリ作成エラー:', error)
            // ディレクトリ作成の失敗は無視する
        }

        // 必ずデータベースの結果を返す
        return result

    } catch (error) {
        console.error('イベントグループ作成エラー:', error)
        throw error
    }
}

export async function showALLEventGroup() {
    try {
        const eventGroups = await prisma.eventgroup.findMany({
            include: {
                events: true
            }
        })
        
        console.log('取得したイベントグループ:', eventGroups) // デバッグログ
        
        // 必ず配列を返す
        return eventGroups || []
    } catch (error) {
        console.error('イベントグループ取得エラー:', error)
        return [] // エラーの場合は空配列を返す
    }
}

export async function createEvent(name: string, eventGroupId: number) {
    try {
        const result = await prisma.event.create({
            data: {
                name,
                event: {
                    connect: { id: eventGroupId }
                }
            }
        })
        return result
    } catch (error) {
        console.error('Error creating event:', error)
        throw error
    }
}
