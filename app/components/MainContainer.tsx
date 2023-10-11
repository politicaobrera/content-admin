interface MainContainerProps {
  children: React.ReactNode
}

const MainContainer:React.FC<MainContainerProps> = ({children}) => {
  return (
    <div
      className="
        px-4
        py-8
        sm:px-6
        lg:px-8
        h-full
        flex
        justify-center
        bg-gray-100
      "
    >
      <div className="flex items-center text-center flex-col">
        {children}
      </div>
    </div>
  )
}

export default MainContainer