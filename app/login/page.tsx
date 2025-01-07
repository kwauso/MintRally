"use client"

import React, { useState, useEffect } from "react";
import Modal from "../components/modal";

const LoginPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setIsModalOpen(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("ログイン成功: " + data.token);
                setIsModalOpen(false);
                // トークンをローカルストレージに保存するなどの処理を行います
            } else {
                alert("ログイン失敗: " + data.error);
            }
        } catch (error) {
            alert("エラーが発生しました: " + error.message);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, address, pass: password }),
            });
            if (response.ok) {
                alert("ユーザー登録成功");
                setIsModalOpen(false);
            } else {
                const errorMessage = await response.json();
                alert("登録失敗: " + errorMessage.error);
            }
        } catch (error) {
            alert("エラーが発生しました: " + error.message);
        }
    };

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2>ログイン / ユーザー登録</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="メールアドレス"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">ログイン</button>
                </form>
                <form onSubmit={handleRegister}>
                    <h3>新規登録</h3>
                    <input
                        type="text"
                        placeholder="名前"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="住所"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="メールアドレス"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">登録</button>
                </form>
            </Modal>
        </div>
    );
};

export default LoginPage;