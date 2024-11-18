'use client'

import clsx from "clsx"

interface ButtonProps {
  type?: 'submit' | 'button' | 'reset' | undefined,
  fullWidth?: boolean,
  children?: React.ReactNode,
  onClick?: () => void,
  danger?: boolean,
  secondary?: boolean,
  disabled?: boolean,
} 
 
const Button: React.FC<ButtonProps> = ({
  type = "button",
  fullWidth,
  children,
  onClick,
  danger,
  secondary,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(`
        flex
        justify-center
        rounded-md
        px-3
        py-2
        text-sm
        font-semibold
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
      `,
      fullWidth && 'w-full',
      disabled && 'opacity-50 cursor-default',
      secondary ? 'text-gray-900' : 'text-white',
      danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
      !secondary && !danger && 'bg-gray-500 hover:bg-gray-600 focus-visible:outline-gray-600'
      )}
    >
      {children}
    </button>
  )
}

export default Button