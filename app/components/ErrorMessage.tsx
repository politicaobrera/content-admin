'use client'

import { useEffect, useState } from "react"
import { ResponseError } from "@/app/types/responses"
import { toast } from "react-hot-toast"

interface ErrorMessageProps {
  error: ResponseError
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({error}) => {
  const [show , setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout( () => setShow(false) , 4000)
    toast.error(error.message)
    return () => clearTimeout(timer);
  }, [])

  if (show) {
    return (
      <div className="bg-red-300 fixed top-0 left-auto">
        <div className="bg-red-400">Ha sucedido el siguiente error:</div>
        <div className="px-5">{error.message}</div>
      </div>
    )
  } else {
    return <></>
  }

}

export default ErrorMessage