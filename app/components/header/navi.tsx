import Link from "next/link";

const links = [
    {name: "Home", href: "/"},
    {name: "Event", href:"/events"},
    {name: "Groups", href: "/event-groups"},
    {name: "Help", href: "/help"},
]

export default function Navi() {
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
                <Link href="/logout">
                    <button className="login-button">ログアウト</button>
                </Link>
                <Link href="/login">
                    <button className="login-button">ログイン</button>
                </Link>
            </div>
        </>);
}
