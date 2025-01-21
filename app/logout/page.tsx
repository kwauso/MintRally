// app/components/navi.tsx
"use client"

import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const LogoutPage: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            logout();
            window.location.href = "/";
        } else {
            window.location.href = "/";
        }
    }, [logout]);

    return null;
};

export default LogoutPage;