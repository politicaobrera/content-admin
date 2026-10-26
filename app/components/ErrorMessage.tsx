'use client'

import { signOut } from "next-auth/react"
import { ResponseError } from "@/app/types/responses"
import Button from "@/app/components/Button"

interface ErrorMessageProps {
  error: ResponseError
}

const AUTH_ERROR_STATUSES = [401, 403]

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  const isAuthError = AUTH_ERROR_STATUSES.includes(error.status)

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <div className="max-w-md w-full bg-white border-2 border-rose-200 rounded-lg shadow-sm p-6 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600 text-2xl">
          !
        </div>
        <h2 className="font-bold text-lg text-gray-900">
          {isAuthError ? "Tu sesión ya no es válida" : "Ocurrió un error"}
        </h2>
        <p className="text-sm text-gray-600">
          {isAuthError
            ? "Esto puede pasar luego de una actualización del sistema. Volvé a iniciar sesión para continuar."
            : error.message}
        </p>
        {!isAuthError && (
          <p className="text-xs text-gray-400">
            Error {error.status}{error.statusText ? ` · ${error.statusText}` : ""}
          </p>
        )}
        {isAuthError ? (
          <Button onClick={() => signOut({ callbackUrl: "/" })}>
            Volver a iniciar sesión
          </Button>
        ) : (
          <Button secondary onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
