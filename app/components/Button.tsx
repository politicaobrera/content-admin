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
  // cuando está en loading se deshabilita igual que disabled, pero además muestra un
  // spinner junto al label (sin reemplazarlo por texto estático, para que el botón no
  // "achique" su contenido ni el usuario pierda de vista qué acción está corriendo)
  loading?: boolean,
}

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

const Button: React.FC<ButtonProps> = ({
  type = "button",
  fullWidth,
  children,
  onClick,
  danger,
  secondary,
  disabled,
  loading,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clsx(`
        flex
        items-center
        justify-center
        gap-2
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
      (disabled || loading) && 'opacity-50 cursor-default',
      secondary ? 'text-gray-900 border-2' : 'text-white',
      danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
      !secondary && !danger && 'bg-gray-500 hover:bg-gray-600 focus-visible:outline-gray-600'
      )}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

export default Button