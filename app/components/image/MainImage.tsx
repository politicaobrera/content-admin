import {FC} from 'react'
import useMainImagen from '@/app/hooks/image/useMainImage'
import { MainImageType } from '@/app/types/image'
import Button from '../Button'

interface MainImageProps {
  id: string
  image: MainImageType | undefined
  fileName: string
  entity?: string
  onUpload: (img: MainImageType) => void
}

const MainImage:FC<MainImageProps> = ({id, image, fileName, onUpload}) => {
  const mainImagen = useMainImagen(image, fileName, onUpload)
  return (
    <>
        <h5>Imagen principal</h5>
        <div>
        {!mainImagen.state.uploadMode && (
            // TODO: Extraer a un nuevo componente
            <section className="mb-3">
            {
              mainImagen.state.currentImage && (
                <div>
                  <img
                    src={mainImagen.state.currentImage.src}
                  />
                </div>
              )
            }
            </section>
        )}
        {mainImagen.state.uploadMode && (
          // TODO: MOVE TO EXTERNAL COMPONENT
          <section className="mb-3">
            {mainImagen.state.preview && (
              <div>
                <div className='mb-2'>
                  <img src={mainImagen.state.preview}/>
                </div>
                <div className='preview-img-upload'>
                  <img src={mainImagen.state.previewSEO}/>
                </div>
              </div>
            )}
            <div className='desde-pc'>
              {/* TODO: Cambiar por un dropzone? */}
              <input
                id={id}
                type="file"
                accept="image/*"
                onChange={event => mainImagen.actions.onFileChange(event.target.files?.[0] ?? null)}
              />
            </div>
          </section>
        )}
        <div className="
          space-y-2
        ">
          {mainImagen.state.uploadMode && (
            <div className="flex gap-2 align-middle justify-start">
              <Button
                disabled={!mainImagen.state.file || mainImagen.state.uploading}
                onClick={() => mainImagen.actions.onSave()}
              >
                {
                  mainImagen.state.uploading ? 'Loading':'Guardar'
                }
              </Button>
              <Button
                danger
                disabled={!mainImagen.state.currentImage || mainImagen.state.uploading}
                onClick={() => {
                  mainImagen.actions.onToggleMode()
                  mainImagen.actions.cleanUploadTemps()
                }}
              >
                {
                  mainImagen.state.uploading ? 'Loading':'Cancelar'
                }
              </Button>
            </div>
          )}
          {
            !mainImagen.state.uploadMode && (
              <Button
                onClick={() => mainImagen.actions.onToggleMode()}
              >
                Modificar
              </Button>
            )
          }
        </div>
      </div>
    </>
  )
}

export default MainImage