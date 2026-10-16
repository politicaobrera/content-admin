'use client'

import clsx from "clsx"
import { 
  FieldValues,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form"

export interface InputProps {
  label?: string,
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

const Input: React.FC<InputProps> = ({
  label,
  id,
  register,
  errors,
  type,
  required,
  disabled,
  placeHolder,
}) => {
  
    const error = errors[id]

    return (
      <div>
        {label && (
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
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        )}
        <div className="mt-2">
          <input
            id={id}
            type={type}
            disabled={disabled}
            placeholder={placeHolder}
            autoComplete={id}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            {...register(id, { required })}
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
              error && 'ring-rose-400 focus:ring-rose-500',
              disabled && 'opacity-50 cursor-default'
            )}
          />
        </div>
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-rose-600">
            {typeof error.message === 'string' && error.message
              ? error.message
              : 'Este campo es obligatorio'}
          </p>
        )}
      </div>
    );
};


export default Input