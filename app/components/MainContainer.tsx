interface MainContainerProps {
  children: React.ReactNode
}

const MainContainer:React.FC<MainContainerProps> = ({children}) => {
  return (
    <div
      className="
        h-auto
        w-full
        md:ml-[10rem]
      "
    >
      {children}
    </div>
  )
}

export default MainContainer