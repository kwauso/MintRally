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
                <></>
            ) : (
                <button onClick={connectWallet} className="popup-button">
                    🦊 MetaMaskに接続
                </button>
            )}
        </div>
    );
};

export default ConnectButton;