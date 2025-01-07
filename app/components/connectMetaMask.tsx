"use client"

import React, { useState } from "react";
import { ethers } from "ethers";
import { useAuth } from "../context/AuthContext";

const ConnectButton: React.FC = () => {
    const { login } = useAuth();
    const [account, setAccount] = useState<string | null>(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                // MetaMaskに接続
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]); // 最初のアカウントを設定
                login(accounts[0]); // アカウントを使用してログイン
            } catch (error) {
                console.error("Wallet connection failed:", error);
            }
        } else {
            alert("MetaMaskがインストールされていません。");
        }
    };

    return (
        <div>
            {account ? (
                <p>接続中: {account}</p> // 接続中のアカウントを表示
            ) : (
                <button onClick={connectWallet}>MetaMaskに接続</button> // 接続ボタン
            )}
        </div>
    );
};

export default ConnectButton;