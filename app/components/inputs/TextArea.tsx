'use client'

import clsx from "clsx"
import { 
  FieldValues,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form"

export interface TextAreaProps {
  label: string,
  id: string,
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors,
  required?: boolean,
  disabled?: boolean,
  placeHolder?: string,
  rows?: number
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  id,
  register,
  errors,
  required,
  disabled,
  placeHolder,
  rows = 3,
}) => {
  
    const error = errors[id]

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
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        <div className="mt-2 relative">
          <textarea
            id={id}
            rows={rows}
            disabled={disabled}
            placeholder={placeHolder}
            autoComplete={id}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            {...register(id, { required })}
            className={
              clsx(`
                form-input
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
                sm:leading-6
              `,
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


export default TextArea