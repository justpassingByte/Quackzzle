"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'danger' | 'liberation'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant = 'default', size = 'md', showValue = false, ...props }, ref) => {
  const variants = {
    default: "bg-red-600",
    gradient: "bg-gradient-to-r from-red-600 via-red-500 to-yellow-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    liberation: "bg-gradient-to-r from-red-600 to-yellow-400 relative after:absolute after:content-['★'] after:text-yellow-400 after:text-xs after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2"
  }

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4"
  }

  return (
    <div className="flex flex-col gap-1.5">
      <ProgressPrimitive.Root
        ref={ref}
        className={`relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${sizes[size]} ${className || ''}`}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={`h-full w-full flex-1 transition-all duration-300 ease-in-out ${variants[variant]}`}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 text-right">
          {value}%
        </div>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }