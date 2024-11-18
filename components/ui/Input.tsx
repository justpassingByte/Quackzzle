interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
  }
  
  export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          className={`
            w-full px-4 py-2 rounded-lg 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
            transition-all duration-200
            ${error ? 'border-red-300' : 'border-purple-100'} 
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }