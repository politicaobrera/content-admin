import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import useMenuOption from "./useMenuOption"
import{
  HiMiniPencilSquare,
  HiArrowLeftOnRectangle,
  HiBookOpen,
  HiNewspaper,
  HiOutlineUserPlus,
  HiOutlineCloudArrowUp
} from 'react-icons/hi2'

const useRoutes = () => {
  const pathname = usePathname()
  // may not need this hook
  const {menuOption} = useMenuOption()
  
  const routes = useMemo(() =>[
    {
      label: 'Portada',
      href: '/main',
      icon: HiBookOpen,
      active: pathname === '/main',
    },
    {
      label: 'Notas',
      href: '/articles',
      icon: HiMiniPencilSquare,
      active: pathname === '/articles',
    },
    {
      label: 'Secciones',
      href: '/sections',
      icon: HiNewspaper,
      active: pathname === '/sections',
    },
    {
      label: 'Autores',
      href: '/authors',
      icon: HiOutlineUserPlus,
      active: pathname === '/authors',
    },
    {
      label: 'Desplegar',
      href: '/deploy',
      icon: HiOutlineCloudArrowUp,
      active: pathname === '/deploy',
    },
    {
      label: 'Logout',
      href: '#',
      icon: HiArrowLeftOnRectangle,
      onClick: () => signOut(), 
    },
  ], [pathname, menuOption])

  return routes
}

export default useRoutes