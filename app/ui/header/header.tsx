import Navi from "./navi";
import Image from "next/image";
import logo from "../../../public/logo.svg"

export default function Header() {
    return(
        <header>
            <div className="header">
                <div className="header__logo">
                    <Image src={logo} alt="logo" className="logo"/>
                </div>
                <Navi/>
            </div>
        </header>
    );
}