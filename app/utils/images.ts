import imageCompression, { Options } from 'browser-image-compression'

const isAvif = (file: File): boolean =>
  file.type === 'image/avif' || /\.avif$/i.test(file.name)

export const compressImage = async (file: File, options: Options): Promise<File> => {
  if (isAvif(file)) return file
  return imageCompression(file, options)
}

const MIME_EXTENSIONS: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/avif': 'avif',
}

export const getFileExtension = (file: File): string =>
  MIME_EXTENSIONS[file.type] ?? file.name.split('.').pop() ?? 'jpg'