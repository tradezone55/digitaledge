import React from 'react'
import { LoaderCircle } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = "Loading",
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900'

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <LoaderCircle className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
