import { ResourceSourceType } from "@/app/types/resource"
import useResourceFile from "../hooks/useResourceFile"
import Button from "@/app/components/Button"

interface ResourceSelectorProps {
  sourceType: ResourceSourceType
  src: string
  onChange: (url:string) => void
}
const ResourceSelector = ({sourceType, src, onChange}: ResourceSelectorProps) => {
  const resource = useResourceFile(src, sourceType)

  const handleSaveFile = async () => {
    const url = await resource.actions.onUploadImage()
    if (url != ""){
      resource.actions.setIsEditing(false)
      resource.actions.cleanUploadTemp()
      onChange(url)
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
        <input
          type="file"
          accept={resource.state.accept}
          onChange={event => resource.actions.onFileChange(event.target.files?.[0] ?? null)}
        />
        <div className="flex align-middle justify-start gap-2">
          <Button
            onClick={() => handleSaveFile()}
            disabled={resource.state.loading || !resource.state.file}
          >
            Guardar
          </Button>
          <Button
            danger
            disabled={resource.state.loading || !resource.state.file}
            onClick={() => {
              resource.actions.cleanUploadTemp()
            }}
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
        <img src={resource.state.current} className="w-1/2"/>
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
}

export default ResourceSelector