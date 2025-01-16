interface InputProps {
    label: string
    type?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    placeholder?: string
    className?: string
}

export default function Input({
    label,
    type = "text",
    value,
    onChange,
    required = false,
    placeholder,
    className = ""
}: InputProps) {
    return (
        <div className="form-group">
            <label className="block text-xl font-medium text-gray-700 mb-4 ml-3">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={`
                    w-full 
                    px-10 
                    py-6 
                    bg-white 
                    border-2 
                    border-gray-100 
                    rounded-3xl 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:border-transparent 
                    transition-all 
                    duration-200 
                    ease-in-out 
                    hover:border-gray-200 
                    placeholder-gray-400 
                    text-gray-600 
                    text-xl 
                    shadow-sm 
                    outline-none
                    ${className}
                `}
            />
        </div>
    )
} 