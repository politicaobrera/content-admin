import { forwardRef, useImperativeHandle } from "react"
import { ResourceOrigin, ResourceSourceType } from "@/app/types/resource"
import useResourceFile from "../hooks/useResourceFile"
import Button from "@/app/components/Button"

export interface ResourceSelectorHandle {
  // uploads the pending file (if any was selected) and returns its url, or the current url if nothing changed
  resolveUrl: () => Promise<string>
}

interface ResourceSelectorProps {
  sourceType: ResourceSourceType
  src: string
  fileName: string
  origin?: ResourceOrigin
  onChange?: (url:string) => void
  // when true, selecting a file only stages it: the actual upload happens when the caller invokes resolveUrl via ref (e.g. on form submit)
  deferUpload?: boolean
}

const ResourcePreview = ({ sourceType, src }: { sourceType: ResourceSourceType, src: string }) => {
  switch (sourceType) {
    case ResourceSourceType.Video:
      return <video src={src} controls className="w-1/2" />
    case ResourceSourceType.Audio:
      return <audio src={src} controls />
    case ResourceSourceType.Document:
      return (
        <a href={src} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
          Ver documento
        </a>
      )
    case ResourceSourceType.Image:
    default:
      return <img src={src} className="w-1/2" />
  }
}

const ResourceSelector = forwardRef<ResourceSelectorHandle, ResourceSelectorProps>(({sourceType, src, fileName, origin, onChange, deferUpload}, ref) => {
  const resource = useResourceFile(src, sourceType, fileName, origin)

  useImperativeHandle(ref, () => ({
    resolveUrl: resource.actions.resolveUrl,
  }))

  const handleSaveFile = async () => {
    const url = await resource.actions.onUploadImage()
    if (url != ""){
      resource.actions.setIsEditing(false)
      resource.actions.cleanUploadTemp()
      onChange?.(url)
    }
  }

  const handleCancel = () => {
    resource.actions.cleanUploadTemp()
    if (deferUpload && resource.state.current) {
      resource.actions.setIsEditing(false)
    }
  }

  if (resource.state.isEditing) {
    return (
      <div className="flex flex-col gap-2">
        {resource.state.preview && (
          <div className='mb-2'>
            <img src={resource.state.preview} className="w-92"/>
          </div>
        )}
        {!resource.state.preview && resource.state.file && (
          <p className="text-sm text-gray-600">Archivo seleccionado: {resource.state.file.name}</p>
        )}
        <input
          type="file"
          accept={resource.state.accept}
          onChange={event => resource.actions.onFileChange(event.target.files?.[0] ?? null)}
        />
        <div className="flex align-middle justify-start gap-2">
          {!deferUpload && (
            <Button
              onClick={() => handleSaveFile()}
              disabled={resource.state.loading || !resource.state.file}
            >
              Guardar
            </Button>
          )}
          <Button
            danger
            disabled={resource.state.loading || !resource.state.file}
            onClick={handleCancel}
          >
            {
              resource.state.loading ? 'Cargando' : 'Cancelar'
            }
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {resource.state.current && (
        <ResourcePreview sourceType={sourceType} src={resource.state.current} />
      )}
      <div>
        <Button
          onClick={() => resource.actions.setIsEditing(true)}
        >
          Modificar
        </Button>
      </div>
    </div>
 )
})

ResourceSelector.displayName = "ResourceSelector"

export default ResourceSelector