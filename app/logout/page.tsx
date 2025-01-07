// app/components/navi.tsx
"use client"

import React, { useEffect, useState } from "react";

const Logout: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token"); // トークンを削除
        alert("ログアウトしました");
        window.location.reload(); // ページをリロードしてログイン状態を更新
    };

    return (
        <nav>
            <h1>ログアウト</h1>
            {!isLoggedIn ? (
                <button onClick={handleLogout}>ログアウト</button> // ログアウトボタン
            ) : (
                <button onClick={() => setIsModalOpen(true)}>ログイン</button> // ログインボタン
            )}
            {/* モーダルの表示 */}
        </nav>
    );
};

export default Logout;