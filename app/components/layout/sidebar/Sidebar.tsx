import getCurrentUser from "@/app/actions/getCurrentUser"
import DesktopSidebar from "./DesktopSidebar"
import MobileFooter from "./MobileFooter"

async function Sidebar({
  children
}:{
  children:React.ReactNode
}){
  const user = await getCurrentUser()
  return (
    <main className="flex">
      {user && <>
        <DesktopSidebar currentUser={user} />
        <MobileFooter />
      </>}
      {children}
    </main>
  )
}

export default Sidebar