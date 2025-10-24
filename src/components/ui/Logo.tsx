import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {

  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-12 h-12 text-white font-bold text-xl',
  }
  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeMap[size]} bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center`}>
        <div className="text-white font-bold">D</div>
      </div>
      <div className={`text-${size} font-semibold text-white`}>
        <span className="text-orange-400">DIGITAL</span>
        <span className="text-blue-400">EDGE</span>
      </div>
    </div>
  )
}

export default Logo
