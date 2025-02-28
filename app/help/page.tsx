"use client"

import React, {useState, useEffect} from "react"

export default function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true); // トークンが存在する場合はログイン状態
        }
    }, []);

    return (
        <div>
            {isLoggedIn ? (
                <h1>Your are in help</h1>
            ) : (
                <h1>Not logged in</h1> // ログインしていない場合はログインページを表示する
            )}
        </div>
    );

}