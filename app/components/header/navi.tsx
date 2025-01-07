"use client"

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

const links = [
    {name: "Home", href: "/"},
    {name: "Event", href:"/events"},
    {name: "Groups", href: "/event-groups"},
    {name: "Help", href: "/help"},
]

export default function Navi() {
    const {isLoggedIn, logout} = useAuth();
    return(
        <>
            {links.map((link) => {
                return(
                    <div key={link.name}>
                        <Link href={link.href}>
                            <button className="Button_link">
                                {link.name}
                            </button>
                        </Link>
                    </div>
                );
            })}
            <div className="login-container">
                {!isLoggedIn ? (
                    <></>
                ) : (
                <Link href="/logout">
                    <button className="login-button">ログアウト</button>
                </Link>
                )}
                {!isLoggedIn ? (
                    <Link href="/login">
                        <button className="login-button">ログイン</button>
                    </Link>
                ) : (
                <Link href="/mypage">
                    <button className="login-button">マイページ</button>
                </Link>
                )}
            </div>
        </>);
}
