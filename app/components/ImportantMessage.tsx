interface ImportantMessageProps {
  message: string
}

const ImportantMessage = ({message}: ImportantMessageProps) => {
  return (
    <div className="bg-slate-100 border-l-4 border-slate-300 p-4 rounded-md shadow-sm">
      <p className="text-slate-800 text-sm font-medium">
        {message}
      </p>
    </div>
 )
}

export default ImportantMessage