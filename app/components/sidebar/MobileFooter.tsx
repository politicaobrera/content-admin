'use client'

import useRoutes from "@/app/hooks/useRoutes"
import MobileItem from "./MobileItem"

const MobileFooter = () => {
  const routes = useRoutes()

  return (
    <div
      className="
        fixed
        flex
        justify-between
        item-center
        w-full
        z-40
        bottom-0
        border-t-[1px]
        bg-white
        lg:hidden
      "
    >
      {routes.map((route) => (
        <MobileItem 
          key={route.label}
          label={route.label}
          href={route.href}
          active={route.active}
          onClick={route.onClick}
          icon={route.icon}
        />
      ))}
    </div>
  )
}

export default MobileFooter