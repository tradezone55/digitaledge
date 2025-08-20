import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: { message?: string }
  className?: string
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300 text-left">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        required
        {...props}
      />
      <div>
        {error && (
          <p className="mt-1 text-sm text-red-400 flex flex-start text-left">
            {error.message}
          </p>
        )}
      </div>
    </div>
  )
})

Input.displayName = 'Input'

export default Input
