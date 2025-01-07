import "./style/global.css";
import Header from "./components/header/header";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <AuthProvider>
            <Header />
            {children}
        </AuthProvider>
        </body>
        </html>
    )
}