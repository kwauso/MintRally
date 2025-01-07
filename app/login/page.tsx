"use client"

import React, { useEffect, useState } from "react";
import Modal from "../components/modal";
import ConnectButton from "../components/connectMetaMask";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const { login } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [loginName, setLoginName] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerAddress, setRegisterAddress] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    useEffect(() => {
        setIsModalOpen(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: loginName, pass: loginPassword }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                alert("ログイン失敗: " + errorMessage);
                return;
            }

            const data = await response.json();
            if (data && data.token) {
                localStorage.setItem("token", data.token);
                login(loginName);
                alert("ログイン成功");
                setIsModalOpen(false);
                window.location.href = "/";
            } else {
                alert("ログイン失敗: 不明なエラー");
            }
        } catch (error) {
            alert("エラーが発生しました: " + error.message);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, address: registerAddress, pass: registerPassword }),
            });
            if (response.ok) {
                login(name);
                alert("ユーザー登録成功");
                setIsModalOpen(false);
                window.location.href = "/";
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
                <ConnectButton />
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="名前"
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="パスワード"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
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
                        placeholder="アドレス"
                        value={registerAddress}
                        onChange={(e) => setRegisterAddress(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="パスワード"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                    />
                    <button type="submit">登録</button>
                </form>
            </Modal>
        </div>
    );
};

export default LoginPage;