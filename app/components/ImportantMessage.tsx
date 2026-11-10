interface ImportantMessageProps {
  message: string
  warning?: boolean
}

const ImportantMessage = ({message, warning}: ImportantMessageProps) => {
  return (
    <div className={
      warning
        ? "bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md shadow-sm"
        : "bg-gray-100 border-l-4 border-gray-300 p-4 rounded-md shadow-sm"
    }>
      <p className={warning ? "text-amber-900 text-sm font-medium" : "text-gray-800 text-sm font-medium"}>
        {message}
      </p>
    </div>
 )
}

export default ImportantMessage