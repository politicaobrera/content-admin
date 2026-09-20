'use client'

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import clsx from "clsx"
import Button from "@/app/components/Button"
import useCreateArticlesFromWord from "@/app/articles/hooks/useCreateArticlesFromWord"

const ACCEPTED_EXTENSIONS = [".doc", ".docx"]

const NewArticlesFromWordForm = () => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)
  const { loading, createFromFiles } = useCreateArticlesFromWord()

  const processFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const files = Array.from(fileList).filter((file) =>
      ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
    )
    if (files.length === 0) {
      toast.error("Seleccioná uno o más archivos Word (.doc, .docx)")
      return
    }

    const results = await createFromFiles(files)

    if (results.success.length > 0) {
      toast.success(
        results.success.length === 1
          ? `Nota "${results.success[0]}" creada correctamente`
          : `${results.success.length} notas creadas correctamente`
      )
    }
    if (results.errors.length > 0) {
      results.errors.forEach(({ fileName, reason }) => {
        toast.error(`${fileName}: ${reason}`)
      })
    }

    router.refresh()
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingOver(false)
    processFiles(event.dataTransfer.files)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingOver(true)
  }

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingOver(false)
  }

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-md
      "
    >
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={clsx(`
          bg-white
          p-4
          rounded-lg
          shadow
          border-2
          border-dashed
          text-center
          space-y-2
        `,
        isDraggingOver ? 'border-gray-500 bg-gray-50' : 'border-gray-200'
        )}
      >
        <p className="text-sm text-gray-500">
          Arrastrá uno o más archivos Word aquí, o
        </p>
        <Button
          type="button"
          fullWidth
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          {loading ? 'PROCESANDO...' : 'CREAR DESDE WORD'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          multiple
          hidden
          disabled={loading}
          onChange={(event) => {
            processFiles(event.target.files)
            event.target.value = ""
          }}
        />
      </div>
    </div>
  )
}

export default NewArticlesFromWordForm
