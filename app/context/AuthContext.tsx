"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (account: string) => void;
    logout: () => void;
    user: { account: string | null };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ account: string | null }>({ account: null });

    useEffect(() => {
        const account = localStorage.getItem('account');
        if (account) {
            setIsLoggedIn(true);
            setUser({ account });
        }
    }, []);

    const login = (account: string) => {
        localStorage.setItem('account', account);
        setIsLoggedIn(true);
        setUser({ account });
    };

    const logout = () => {
        localStorage.removeItem('account');
        setIsLoggedIn(false);
        setUser({ account: null });
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 