interface ImportantMessageProps {
  message: string
}

const ImportantMessage = ({message}: ImportantMessageProps) => {
  return (
    <div className="bg-gray-100 border-l-4 border-gray-300 p-4 rounded-md shadow-sm">
      <p className="text-gray-800 text-sm font-medium">
        {message}
      </p>
    </div>
 )
}

export default ImportantMessage