import "./style/global.css";
import Header from "./components/header/header";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <Header />
        {children}
        </body>
        </html>
    )
}