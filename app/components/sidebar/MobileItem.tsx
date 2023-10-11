'use client'

import clsx from "clsx"
import Link from "next/link"
import { useCallback } from "react"

interface MobileItemProps {
  label: string
  href: string
  icon: any
  active?: boolean
  onClick?: () => void
}

const MobileItem:React.FC<MobileItemProps> = ({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = useCallback(() =>{
    if (onClick) {
      return onClick()
    }
  }, [onClick])
  
  return (
    <Link 
      href={href}
      onClick={handleClick}
      className={clsx(`
        group
        flex
        gap-x-3
        text-sm
        leading-6
        font-semibold
        justify-center
        w-full
        p-4
        text-gray-500
        hover:text-black
        hover:bg-gray-100
      `,
        active && 'bg-gray-100 text-black'
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  )
}

export default MobileItem