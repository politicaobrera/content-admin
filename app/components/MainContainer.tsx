interface MainContainerProps {
  children: React.ReactNode
}

const MainContainer:React.FC<MainContainerProps> = ({children}) => {
  return (
    <div
      className="
        md:ml-[200px]
        px-4
        sm:px-6
        lg:px-8
        h-auto
        md:w-[500px]
        xl:w-[1400px]
      "
    >
      {children}
    </div>
  )
}

export default MainContainer