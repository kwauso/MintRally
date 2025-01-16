export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="space-y-8">
                    {children}
                </div>
            </div>
        </div>
    )
} 