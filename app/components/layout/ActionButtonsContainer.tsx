interface ActionButtonsContainerProps {
  children: React.ReactNode
}

const ActionButtonsContainer = ({children}: ActionButtonsContainerProps) => {
  return (
    <div className="flex gap-2 align-middle justify-end">
      {children}
    </div>
 )
}

export default ActionButtonsContainer