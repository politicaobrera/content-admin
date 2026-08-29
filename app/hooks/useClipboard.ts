import { useState, useEffect } from 'react'

export const useClipboard = () => {
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    setIsAvailable(typeof navigator !== 'undefined' && !!navigator.clipboard)
  }, [])

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!isAvailable) {
      // Fallback con document.execCommand
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        textArea.style.top = '-9999px'
        document.body.appendChild(textArea)
        textArea.select()
        const success = document.execCommand('copy')
        document.body.removeChild(textArea)
        return success
      } catch {
        return false
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  return { copyToClipboard, isAvailable }
}