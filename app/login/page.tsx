"use client"

import React, { useEffect, useState } from "react";
import Modal from "../components/modal";
import ConnectButton from "../components/connectMetaMask";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const { login } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [loginName, setLoginName] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerAddress, setRegisterAddress] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [activeTab, setActiveTab] = useState("login"); // login または register

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
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-center">アカウント</h2>
                    
                    <div className="flex mb-6 border-b">
                        <button
                            className={`popup-button flex-1 pb-2 text-center ${
                                activeTab === "login" 
                                    ? "border-b-2 border-blue-500 text-blue-500" 
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("login")}
                        >
                            ログイン
                        </button>
                        <button
                            className={`popup-button flex-1 pb-2 text-center ${
                                activeTab === "register" 
                                    ? "border-b-2 border-blue-500 text-blue-500" 
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("register")}
                        >
                            新規登録
                        </button>
                    </div>

                    <div className="mb-6">
                        <ConnectButton />
                    </div>

                    {activeTab === "login" ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="text"
                                placeholder="名前"
                                value={loginName}
                                onChange={(e) => setLoginName(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="password"
                                placeholder="パスワード"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <button
                                type="submit"
                                className="popup-button"
                            >
                                ログイン
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <input
                                type="text"
                                placeholder="名前"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="アドレス"
                                value={registerAddress}
                                onChange={(e) => setRegisterAddress(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <input
                                type="password"
                                placeholder="パスワード"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                            <button
                                type="submit"
                                className="popup-button"
                            >
                                登録
                            </button>
                        </form>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default LoginPage;