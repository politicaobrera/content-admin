'use client'

import { forwardRef, useImperativeHandle } from 'react'
import useResourceFile from '@/app/resources/hooks/useResourceFile'
import { ResourceSourceType } from '@/app/types/resource'
import Button from '@/app/components/Button'

export interface WorkPdfUploadHandle {
  // sube el pdf pendiente (si se eligió uno) y devuelve la url resultante, o la url
  // actual si no se tocó nada -- mismo patrón que MainImageHandle.resolveImage()
  resolvePdfUrl: () => Promise<string>
}

interface WorkPdfUploadProps {
  id: string
  pdfUrl: string | null
  fileName: string
}

// reusa useResourceFile (ya usado en app/resources para subir a Firebase Storage) en
// vez de crear un Resource aparte -- acá solo interesa la url resultante, que se guarda
// directo en Work.pdfUrl (ver nota en work.model.ts)
const WorkPdfUpload = forwardRef<WorkPdfUploadHandle, WorkPdfUploadProps>(({ id, pdfUrl, fileName }, ref) => {
  const { state, actions } = useResourceFile(pdfUrl, ResourceSourceType.Document, fileName)

  useImperativeHandle(ref, () => ({
    resolvePdfUrl: actions.resolveUrl,
  }))

  return (
    <div className="flex flex-col gap-2">
      {state.current && !state.isEditing && (
        <div className="flex items-center gap-2">
          <a href={state.current} target="_blank" rel="noopener noreferrer" className="underline text-sm text-gray-900">
            Ver PDF actual
          </a>
          <Button onClick={() => actions.setIsEditing(true)}>Reemplazar</Button>
        </div>
      )}
      {(state.isEditing || !state.current) && (
        <div className="flex flex-col gap-2">
          <input
            id={id}
            type="file"
            accept={state.accept}
            onChange={(event) => actions.onFileChange(event.target.files?.[0] ?? null)}
          />
          {state.current && (
            <Button
              danger
              onClick={() => {
                actions.setIsEditing(false)
                actions.cleanUploadTemp()
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      )}
    </div>
  )
})

WorkPdfUpload.displayName = 'WorkPdfUpload'

export default WorkPdfUpload
