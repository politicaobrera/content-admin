export type ImageFocalPoint = 'top' | 'center' | 'bottom'

export type ImageTpe = {
  src: string
  caption?: string
  // fuente/autor de la foto (ej. "Foto: Juan Pérez") -- optativo, a diferencia de
  // caption (descripción, siempre visible como alt/figcaption)
  credit?: string
  // punto vertical que no se debe recortar al encuadrar la foto en una card -- optativo,
  // sin default: las notas existentes no lo tienen y el front cae a "center"
  focalPoint?: ImageFocalPoint
}

export type MainImageType = ImageTpe & {srcSEO: string}