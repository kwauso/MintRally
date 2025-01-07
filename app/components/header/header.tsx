"use client"

import Navi from "./navi";
import Image from "next/image";
import logo from "../../../public/logo.svg"
import Link from "next/link";

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