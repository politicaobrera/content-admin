import { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression'
import storage from '@/app/services/firebase/storage'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { MainImageType } from '@/app/types/image'

const compressOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  useWebWorker: true
}

const compressOptionsSEO = {
  maxSizeMB: 0.3,
  maxWidthOrHeight: 300,
  useWebWorker: true
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

  useEffect(() => {
    if (image) {
      setCurrentImage(image)
      setUploadMode(false)
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
      const compressedFile = await imageCompression(file, compressOptions)
      const compressedFileSEO = await imageCompression(file, compressOptionsSEO)
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
      const extension = imageFileReadyToUpload.name.split('.').pop()
      const storageRef = ref(storage, `/imagenes/${fileName}.${extension}`)
      await uploadBytesResumable(storageRef, imageFileReadyToUpload)
      const imageUrl = await getDownloadURL(storageRef)
      const storageSEORef = ref(storage, `/imagenes/seo/${fileName}.${extension}`)
      await uploadBytesResumable(storageSEORef, imageSEOFileReadyToUpload)
      const imageSEOUrl = await getDownloadURL(storageSEORef)
      const uploaded: MainImageType = {
        caption: currentImage?.caption || '',
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

  // uploads the pending file (if any) and returns the resulting image, or the current image if nothing changed
  const resolveImage = async (): Promise<MainImageType | null> => {
    const uploaded = await uploadPending()
    return uploaded ?? currentImage
  }

  return {
    state: {
      uploadMode,
      currentImage,
      file,
      preview,
      previewSEO,
      uploading,
    },
    actions: {
      onToggleMode,
      onFileChange,
      cleanUploadTemps,
      resolveImage,
    },
  }
}

export default useMainImage
