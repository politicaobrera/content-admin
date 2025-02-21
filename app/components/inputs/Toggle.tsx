import clsx from "clsx";
import { useState } from "react";

interface ToggleProps {
  labelConfig: {
    isChecked: string
    isNotChecked: string
  },
  onChange: (checked: boolean) => void
  value: boolean
  disabled: boolean
}

const Toggle = ({labelConfig, onChange, value = false, disabled = false}: ToggleProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(value)
  const [isLocked, setIsLocked] = useState<boolean>(false)

  const handleToggle = () => {
    if (disabled || isLocked) return
    setIsLocked(true);
    setIsChecked((prev) => {
      const newValue = !prev
      onChange(newValue)
      setTimeout(() => setIsLocked(false), 300);
      return newValue
    })
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-black">{labelConfig.isNotChecked}</span>
      <label
        className={clsx(`
          relative
          inline-flex
          items-center`,
          !disabled && 'cursor-pointer'
        )}
      >
        <input 
          type="checkbox"
          className="sr-only peer"
          checked={isChecked}
          disabled={disabled}
          onChange={handleToggle}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500"></div>
        <span className="ml-3 text-sm font-medium text-black">{labelConfig.isChecked}</span>
      </label>
    </div>
  )
}

export default Toggle