interface CardProps {
    children: React.ReactNode
    className?: string
}

export default function Card({ children, className = "" }: CardProps) {
    return (
        <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
            <div className="p-8">
                {children}
            </div>
        </div>
    )
} 