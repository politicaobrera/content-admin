'use client'

import { useEffect, useState } from "react"
import { ResponseError } from "@/app/types/Responses"

interface ErrorMessageProps {
  error: ResponseError
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({error}) => {
  const [show , setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout( () => setShow(false) , 8000)
    return () => clearTimeout(timer);
  }, [])

  if (show) {
    return (
      <div className="bg-red-600 fixed top-0">
        <div className="bg-red-700">Ha sucedido el siguiente error:</div>
        <div className="px-5">{error.message}</div>
      </div>
    )
  } else {
    return <></>
  }

}

export default ErrorMessage