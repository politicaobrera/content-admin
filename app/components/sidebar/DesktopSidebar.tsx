'use client'

import useRoutes from "@/app/hooks/useRoutes"
import DesktopItem from "./DesktopItem"
import { ExtendedUser } from "@/app/types/nextauth"

interface DesktopSidebarProps {
  currentUser: ExtendedUser | null
}

const DesktopSidebar:React.FC<DesktopSidebarProps> = ({currentUser}) => {
  const routes = useRoutes()
  return (
    <div
      className="
        hidden
        md:fixed
        md:inset-y-0
        md:left-0
        md:z-40
        md:w-50
        md:pb-4
        md:overflow-y-auto
        md:border-r-[1px]
        md:bg-white
        md:flex
        md:flex-col
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
          items-center
        "
      >
        <div className="mb-4">
          <span>{currentUser?.name}</span>
        </div>
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
    </div>
  )
}

export default DesktopSidebar