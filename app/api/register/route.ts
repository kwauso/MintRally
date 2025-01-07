import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { name, address, pass } = await request.json();

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(pass, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name,
                address,
                pass: hashedPassword, // ハッシュ化したパスワードを保存
            },
        });
        return NextResponse.json({ message: 'ユーザー登録成功' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'ユーザー登録失敗: ' + error.message }, { status: 400 });
    }
}