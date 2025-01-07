"use client"

import React from "react";
import { useAuth } from "../context/AuthContext"; // useAuthをインポート

const MyPage: React.FC = () => {
    const { user } = useAuth(); // ユーザー情報を取得

    return (
        <div>
            <h1>マイページ</h1>
            <p>アドレス: {user.account ? user.account : "未登録"}</p> {/* アドレスを表示 */}
        </div>
    );
};

export default MyPage;