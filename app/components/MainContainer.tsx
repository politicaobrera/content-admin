interface MainContainerProps {
  children: React.ReactNode
}

const MainContainer:React.FC<MainContainerProps> = ({children}) => {
  return (
    <div
      className="
        px-4
        sm:px-6
        lg:px-8
        h-auto
        flex
        items-center
        justify-center
      "
    >
      {children}
    </div>
  )
}

export default MainContainer