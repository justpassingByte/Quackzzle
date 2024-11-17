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
    const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-colors"
    const variants = {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
      secondary: "bg-purple-500 text-white hover:bg-purple-600"
    }
  
    return (
      <button 
        className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    )
  }