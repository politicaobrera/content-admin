import { forwardRef, useImperativeHandle } from 'react'
import clsx from 'clsx'
import useMainImage from '@/app/hooks/image/useMainImage'
import { ImageFocalPoint, MainImageType } from '@/app/types/image'
import Button from '../Button'

const FOCAL_POINT_OPTIONS: { value: ImageFocalPoint; label: string }[] = [
  { value: 'top', label: 'Arriba' },
  { value: 'center', label: 'Centro' },
  { value: 'bottom', label: 'Abajo' },
]

interface FocalPointPickerProps {
  value: ImageFocalPoint | undefined
  onChange: (value: ImageFocalPoint | undefined) => void
}

// selector del punto vertical de la foto que no se debe recortar al encuadrarla en una
// card (object-position en el front) -- optativo, por eso "Automático" permite volver a
// undefined en vez de forzar siempre un valor
const FocalPointPicker = ({ value, onChange }: FocalPointPickerProps) => (
  <div className="mt-2">
    <span className="block text-sm font-semibold mb-1">
      Foco de la imagen (qué no recortar en las tarjetas)
    </span>
    <div className="flex gap-2">
      {FOCAL_POINT_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(value === option.value ? undefined : option.value)}
          className={clsx(
            'px-3 py-1 rounded-md text-sm font-semibold border-2',
            value === option.value
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-900 border-gray-300 hover:border-gray-500'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
    <p className="text-xs text-gray-500 mt-1">
      Opcional. Sin elegir, se recorta desde el centro.
    </p>
  </div>
)

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
                <span
                  className={`inline-block mt-1 mr-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    mainImage.state.currentImage.srcSEO
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {mainImage.state.currentImage.srcSEO ? 'Imagen SEO generada' : 'Sin imagen SEO'}
                </span>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    mainImage.state.currentImage.srcMobile
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {mainImage.state.currentImage.srcMobile ? 'Imagen mobile generada' : 'Sin imagen mobile'}
                </span>
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
            <div className="mt-2">
              <label htmlFor={`${id}-credit`} className="block text-sm font-semibold mb-1">
                Crédito (fuente/autor de la foto)
              </label>
              <input
                id={`${id}-credit`}
                type="text"
                className="w-full border-2 p-1"
                placeholder="Opcional, ej: Foto: Juan Pérez"
                value={mainImage.state.credit}
                onChange={(event) => mainImage.actions.setCredit(event.target.value)}
              />
            </div>
            <FocalPointPicker
              value={mainImage.state.focalPoint}
              onChange={mainImage.actions.setFocalPoint}
            />
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
                <div className='preview-img-upload'>
                  <img src={mainImage.state.previewMobile}/>
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
            <div className="mt-2">
              <label htmlFor={`${id}-credit`} className="block text-sm font-semibold mb-1">
                Crédito (fuente/autor de la foto)
              </label>
              <input
                id={`${id}-credit`}
                type="text"
                className="w-full border-2 p-1"
                placeholder="Opcional, ej: Foto: Juan Pérez"
                value={mainImage.state.credit}
                onChange={(event) => mainImage.actions.setCredit(event.target.value)}
              />
            </div>
            <FocalPointPicker
              value={mainImage.state.focalPoint}
              onChange={mainImage.actions.setFocalPoint}
            />
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
