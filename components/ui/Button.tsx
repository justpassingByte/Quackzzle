interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary'
    isLoading?: boolean
  }
  
  export function Button({ 
    children, 
    variant = 'primary', 
    isLoading, 
    className = '', 
    ...props 
  }: ButtonProps) {
    const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200"
    const variants = {
      primary: "bg-indigo-500 text-white hover:bg-indigo-600",
      secondary: "bg-purple-500 text-white hover:bg-purple-600"
    }
  
    return (
      <button 
        className={`
          ${baseStyles} 
          ${variants[variant]} 
          ${className} 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          hover:shadow-lg
        `}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    )
  }