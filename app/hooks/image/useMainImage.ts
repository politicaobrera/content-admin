import { useEffect, useState } from 'react'
import storage from '@/app/services/firebase/storage'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { MainImageType } from '@/app/types/image'
import { compressImage, getFileExtension } from '@/app/utils/images'

const compressOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  useWebWorker: true,
  fileType: 'image/webp',
}

const compressOptionsSEO = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  fileType: 'image/jpeg',
}

const useMainImage = (image: MainImageType | undefined, fileName: string) => {
  const [uploadMode, setUploadMode] = useState<boolean>(!image)
  const [uploading, setUploading] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<MainImageType | null>(image ?? null)
  const [file, setFile] = useState<File | null>(null) // archivo que suben desde la pc temporal
  const [imageFileReadyToUpload, setImageFileReadyToUpload] = useState<File | null>(null)
  const [imageSEOFileReadyToUpload, setImageSEOFileReadyToUpload] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [previewSEO, setPreviewSEO] = useState<string>('')
  const [caption, setCaption] = useState<string>(image?.caption ?? '')

  useEffect(() => {
    if (image) {
      setCurrentImage(image)
      setUploadMode(false)
      setCaption(image.caption ?? '')
      return
    }
    setUploadMode(true)
    setCurrentImage(null)
  }, [image])

  useEffect(() => {
    processFile()
  }, [file])

  const processFile = async () => {
    if (!file) return
    try {
      const compressedFile = await compressImage(file, compressOptions)
      const compressedFileSEO = await compressImage(file, compressOptionsSEO)
      setPreview(URL.createObjectURL(compressedFile))
      setPreviewSEO(URL.createObjectURL(compressedFileSEO))
      setImageFileReadyToUpload(compressedFile)
      setImageSEOFileReadyToUpload(compressedFileSEO)
    } catch (error) {
      console.log("error procesando imagen principal", error)
    }
  }

  const onToggleMode = async () => {
    setUploadMode(!uploadMode)
  }

  const onFileChange = async (f: File | null) => {
    setFile(f)
  }

  const cleanUploadTemps = () => {
    setFile(null)
    setPreview('')
    setPreviewSEO('')
    setImageFileReadyToUpload(null)
    setImageSEOFileReadyToUpload(null)
  }

  const uploadPending = async (): Promise<MainImageType | null> => {
    if (!imageFileReadyToUpload || !imageSEOFileReadyToUpload) return null
    setUploading(true)
    try {
      const extension = getFileExtension(imageFileReadyToUpload)
      const extensionSEO = getFileExtension(imageSEOFileReadyToUpload)
      const storageRef = ref(storage, `/imagenes/${fileName}.${extension}`)
      await uploadBytesResumable(storageRef, imageFileReadyToUpload)
      const imageUrl = await getDownloadURL(storageRef)
      const storageSEORef = ref(storage, `/imagenes/seo/${fileName}.${extensionSEO}`)
      await uploadBytesResumable(storageSEORef, imageSEOFileReadyToUpload)
      const imageSEOUrl = await getDownloadURL(storageSEORef)
      const uploaded: MainImageType = {
        caption,
        src: imageUrl,
        srcSEO: imageSEOUrl,
      }
      setCurrentImage(uploaded)
      cleanUploadTemps()
      setUploadMode(false)
      return uploaded
    } catch (error) {
      console.log("error uploading imagen principal", error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const resolveImage = async (): Promise<MainImageType | null> => {
    const uploaded = await uploadPending()
    if (uploaded) return uploaded
    return currentImage ? { ...currentImage, caption } : null
  }

  return {
    state: {
      uploadMode,
      currentImage,
      file,
      preview,
      previewSEO,
      uploading,
      caption,
    },
    actions: {
      onToggleMode,
      onFileChange,
      cleanUploadTemps,
      resolveImage,
      setCaption,
    },
  }
}

export default useMainImage
