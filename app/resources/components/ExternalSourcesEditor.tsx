'use client'

import { useState } from "react"
import { toast } from "react-hot-toast"
import { ExternalSource } from "@/app/types/resource"

interface ExternalSourcesEditorProps {
  sources: ExternalSource[]
  onChange: (sources: ExternalSource[]) => void
}

const ExternalSourcesEditor = ({ sources, onChange }: ExternalSourcesEditorProps) => {
  const [url, setUrl] = useState("")
  const [label, setLabel] = useState("")

  const handleAdd = () => {
    const trimmedUrl = url.trim()
    if (!trimmedUrl) return
    onChange([...sources, { url: trimmedUrl, label: label.trim() || undefined }])
    setUrl("")
    setLabel("")
  }

  const handleRemove = (index: number) => {
    onChange(sources.filter((_, i) => i !== index))
  }

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
    toast.success("URL copiada al portapapeles")
  }

  return (
    <div className="flex flex-col gap-2">
      <h5>Enlaces externos (ej: el mismo video ya subido a YouTube en otro canal)</h5>
      {sources.length > 0 && (
        <ul className="flex flex-col gap-1">
          {sources.map((source, index) => (
            <li
              key={index}
              className="flex items-center gap-2 border-2 border-black rounded-md p-1"
            >
              <span className="font-semibold">{source.label || source.url}</span>
              {source.label && <span className="text-sm text-gray-500">{source.url}</span>}
              <button
                type="button"
                className="ml-auto underline text-sm"
                onClick={() => handleCopy(source.url)}
              >
                Copiar
              </button>
              <button
                type="button"
                className="underline text-sm"
                onClick={() => handleRemove(index)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="https://youtube.com/..."
          className="border-2 p-1 flex-1 min-w-[200px]"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Etiqueta (opcional, ej: Canal del medio)"
          className="border-2 p-1 flex-1 min-w-[200px]"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button
          type="button"
          className="underline text-sm"
          onClick={handleAdd}
        >
          Agregar
        </button>
      </div>
    </div>
  )
}

export default ExternalSourcesEditor
