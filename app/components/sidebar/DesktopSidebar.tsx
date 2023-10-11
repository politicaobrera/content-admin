'use client'

import { useState } from "react"
import useRoutes from "@/app/hooks/useRoutes"
import DesktopItem from "./DesktopItem"
import { ExtendedUser } from "@/types/nextauth"

interface DesktopSidebarProps {
  currentUser: ExtendedUser | null
}

const DesktopSidebar:React.FC<DesktopSidebarProps> = ({currentUser}) => {
  const routes = useRoutes()
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div
      className="
        hidden
        lg:fixed
        lg:inset-y-0
        lg:left-0
        lg:z-40
        lg:w-40
        lg:pb-4
        lg:overflow-y-auto
        lg:border-r-[1px]
        lg:bg-white
        lg:flex
        lg:flex-col
        justify-between
        xl:px-6
      "
    >
      <nav
        className="
          mt-4
          flex
          flex-col
          justify-between
        "
      >
        <ul
          role="list"
          className="
            flex
            flex-col
            justify-between
            items-left
          "
        >
          {routes.map( (item) => (
            <DesktopItem
              key={item.label}
              label={item.label}
              href={item.href}
              active={item.active}
              onClick={item.onClick}
              icon={item.icon}
            />
          ))}
        </ul>
      </nav>
      <nav
        className="
          mt-4
          flex
          justify-center
          items-center
        "
      >
        <div
          onClick={() => setIsOpen(true)}
          className="
            cursor-pointer
            hover:opacity-75
            transition
          "
        >
          <span>{currentUser?.name}</span>
        </div>
      </nav>
    </div>
  )
}

export default DesktopSidebar