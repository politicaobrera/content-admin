export type ImageTpe = {
  src: string
  caption?: string
  // fuente/autor de la foto (ej. "Foto: Juan Pérez") -- optativo, a diferencia de
  // caption (descripción, siempre visible como alt/figcaption)
  credit?: string
}

export type MainImageType = ImageTpe & {srcSEO: string}