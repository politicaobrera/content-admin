'use client'

import clsx from "clsx"
import { 
  FieldValues,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form"

interface InputProps {
  label: string,
  id: string,
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors,
  type?: string,
  required?: boolean,
  disabled?: boolean,
  placeHolder?: string,
}
// TODO aceptar un mensaje de error optativo, si lo hay, agregar el mensaje de error bajo el input ?
// aceptar objeto validaciones y agregarlas en el register 
const Input:React.FC<InputProps> = ({
  label,
  id,
  register,
  errors,
  type,
  required,
  disabled,
  placeHolder,
}) => {
  return (
    <div>
      <label
        className="
          block
          text-sm
          text-gray-900
          font-medium
          leading-6
        " 
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          disabled={disabled}
          placeholder={placeHolder}
          autoComplete={id}
          {...register(id, {required})}
          className={clsx(`
            form-input
            block
            w-full
            rounded-md
            border-0
            py-1.5
            text-black
            shadow-sm
            ring-1
            ring-inset
            ring-gray-300
            focus:ring-2
            focus:ring-inset
            focus:ring-gray-900
            placeholder:text-gray-400
            sm:text-sm
            sm:leading-6`,
            errors[id] && 'focus:ring-rose-500',
            disabled && 'opacity-50 cursor-default'
            )}
        />
      </div>
    </div>
  )
} 

export default Input