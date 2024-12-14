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
        <div className="mt-2 relative">
          <textarea
            id={id}
            rows={rows}
            disabled={disabled}
            placeholder={placeHolder}
            autoComplete={id}
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
              errors[id] && 'focus:ring-rose-500',
              disabled && 'opacity-50 cursor-default'
            )}
          />
        </div>
      </div>
    );
};


export default TextArea