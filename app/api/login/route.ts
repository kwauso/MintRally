import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { name, pass } = await request.json(); // nameとpassを取得

    // ユーザーをデータベースから取得
    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) {
        return NextResponse.json({ error: 'ユーザーまたはパスワードが無効です' }, { status: 400 });
    }

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(pass, user.pass || '');
    if (!isPasswordValid) {
        return NextResponse.json({ error: 'ユーザーまたはパスワードが無効です' }, { status: 400 });
    }

    // JWTトークンの生成
    const token = jwt.sign({ id: user.id, name: user.name }, 'secret_key', { expiresIn: '1h' });
    return NextResponse.json({ token });
}