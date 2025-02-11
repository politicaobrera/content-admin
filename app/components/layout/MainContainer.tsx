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
        mb-5
        mr-5
      "
    >
      {children}
    </div>
  )
}

export default MainContainer