import { forwardRef, useImperativeHandle } from 'react'
import useMainImage from '@/app/hooks/image/useMainImage'
import { MainImageType } from '@/app/types/image'
import Button from '../Button'

export interface MainImageHandle {
  // uploads the pending file (if any was selected) and returns the resulting image, or the current image if nothing changed
  resolveImage: () => Promise<MainImageType | null>
}

interface MainImageProps {
  id: string
  image: MainImageType | undefined
  fileName: string
}

const MainImage = forwardRef<MainImageHandle, MainImageProps>(({id, image, fileName}, ref) => {
  const mainImage = useMainImage(image, fileName)

  useImperativeHandle(ref, () => ({
    resolveImage: mainImage.actions.resolveImage,
  }))

  return (
    <>
      <div>
        {!mainImage.state.uploadMode && (
          <section className="mb-3">
            {mainImage.state.currentImage && (
              <div>
                <img
                  src={mainImage.state.currentImage.src}
                />
              </div>
            )}
            <div className="mt-2">
              <label htmlFor={`${id}-caption`} className="block text-sm font-semibold mb-1">
                Epígrafe (pie de foto)
              </label>
              <input
                id={`${id}-caption`}
                type="text"
                className="w-full border-2 p-1"
                placeholder="Opcional"
                value={mainImage.state.caption}
                onChange={(event) => mainImage.actions.setCaption(event.target.value)}
              />
            </div>
          </section>
        )}
        {mainImage.state.uploadMode && (
          <section className="mb-3">
            {mainImage.state.preview && (
              <div>
                <div className='mb-2'>
                  <img src={mainImage.state.preview}/>
                </div>
                <div className='preview-img-upload'>
                  <img src={mainImage.state.previewSEO}/>
                </div>
              </div>
            )}
            <div className='desde-pc'>
              <input
                id={id}
                type="file"
                accept="image/*"
                onChange={event => mainImage.actions.onFileChange(event.target.files?.[0] ?? null)}
              />
            </div>
            <div className="mt-2">
              <label htmlFor={`${id}-caption`} className="block text-sm font-semibold mb-1">
                Epígrafe (pie de foto)
              </label>
              <input
                id={`${id}-caption`}
                type="text"
                className="w-full border-2 p-1"
                placeholder="Opcional"
                value={mainImage.state.caption}
                onChange={(event) => mainImage.actions.setCaption(event.target.value)}
              />
            </div>
          </section>
        )}
        <div className="space-y-2">
          {mainImage.state.uploadMode && (
            <div className="flex gap-2 align-middle justify-start">
              <Button
                danger
                disabled={!mainImage.state.currentImage || mainImage.state.uploading}
                onClick={() => {
                  mainImage.actions.onToggleMode()
                  mainImage.actions.cleanUploadTemps()
                }}
              >
                Cancelar
              </Button>
            </div>
          )}
          {!mainImage.state.uploadMode && (
            <Button
              onClick={() => mainImage.actions.onToggleMode()}
            >
              Modificar
            </Button>
          )}
        </div>
      </div>
    </>
  )
})

MainImage.displayName = "MainImage"

export default MainImage
