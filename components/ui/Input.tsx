interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
    variant?: 'default' | 'filled' | 'outlined' | 'liberation'
  }
  
  export function Input({ 
    label, 
    error, 
    icon, 
    variant = 'default',
    className = '', 
    ...props 
  }: InputProps) {
    const variants = {
      default: "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
      filled: "bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800",
      outlined: "bg-transparent border-2 border-red-200 dark:border-red-800 focus:border-red-500",
      liberation: "border-2 border-yellow-400 bg-white dark:bg-gray-800 focus:border-yellow-500 focus:ring-yellow-500/40"
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            className={`
              w-full px-4 py-2.5 rounded-lg 
              ${icon ? 'pl-10' : ''} 
              ${variants[variant]}
              focus:ring-2 focus:ring-red-500/50 focus:border-red-500 
              placeholder-gray-400 dark:placeholder-gray-500
              transition-all duration-200
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50' : ''} 
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>
        )}
      </div>
    )
  }