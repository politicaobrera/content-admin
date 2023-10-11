import { useMemo } from "react"
import { useParams } from "next/navigation"

const useMenuOption = () => {
  const params = useParams()

  const menuOption = useMemo(() =>{
    if (!params?.menuOption) {
      return ''
    }
    return params.menuOption as string
  }, [params?.menuOption])

  const isSelected = useMemo(() => !!menuOption, [menuOption])

  return useMemo(() => ({
    menuOption,
    isSelected,
  }), [menuOption,isSelected])
}

export default useMenuOption