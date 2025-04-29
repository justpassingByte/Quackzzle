interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = "font-semibold transition-all duration-200 rounded-lg flex items-center justify-center"
  
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-red-500/20",
    secondary: "bg-yellow-500 text-gray-800 hover:bg-yellow-600 shadow-md hover:shadow-yellow-500/20",
    outline: "bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30",
    ghost: "bg-transparent text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5",
    lg: "px-6 py-3 text-lg"
  }

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]}
        ${className} 
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
        hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-red-500/50 focus:outline-none
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}