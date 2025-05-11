import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { redirect } from 'next/navigation'
import { signOut } from "next-auth/react"
import useMenuOption from "./useMenuOption"
import{
  HiMiniPencilSquare,
  HiArrowLeftOnRectangle,
  HiBookOpen,
  HiNewspaper,
  HiOutlineUserPlus,
  HiOutlineCloudArrowUp,
  HiOutlineTag,
  HiDocument
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
      label: 'Autores',
      href: '/authors',
      icon: HiOutlineUserPlus,
      active: pathname === '/authors',
    },
    {
      label: 'Secciones',
      href: '/sections',
      icon: HiNewspaper,
      active: pathname === '/sections',
    },
    {
      label: 'Tags',
      href: '/tags',
      icon: HiOutlineTag,
      active: pathname === '/tags',
    },
    {
      label: 'Recursos',
      href: '/resources',
      icon: HiDocument,
      active: pathname === '/resources',
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
      onClick: () => {
        signOut({ callbackUrl: '/' })
      }, 
    },
  ], [pathname, menuOption])

  return routes
}

export default useRoutes