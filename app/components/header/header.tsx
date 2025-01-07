"use client"

import Navi from "./navi";
import Image from "next/image";
import logo from "../../../public/logo.svg"
import Link from "next/link";
import { AuthProvider } from "../../context/AuthContext";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
    return (
        <header>
            <div className="header">
                <div className="header__logo">
                    <Link href="/">
                        <Image src={logo} alt="logo" className="logo"/>
                    </Link>
                </div>
                <Navi />
            </div>
        </header>
    );
}