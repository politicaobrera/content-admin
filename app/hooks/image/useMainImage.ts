import { useEffect, useState } from 'react'
import storage from '@/app/services/firebase/storage'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { ImageFocalPoint, MainImageType } from '@/app/types/image'
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

const compressOptionsMobile = {
  maxSizeMB: 1,
  maxWidthOrHeight: 480,
  useWebWorker: true,
  fileType: 'image/webp',
}

const useMainImage = (image: MainImageType | undefined, fileName: string) => {
  const [uploadMode, setUploadMode] = useState<boolean>(!image)
  const [uploading, setUploading] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<MainImageType | null>(image ?? null)
  const [file, setFile] = useState<File | null>(null) // archivo que suben desde la pc temporal
  const [imageFileReadyToUpload, setImageFileReadyToUpload] = useState<File | null>(null)
  const [imageSEOFileReadyToUpload, setImageSEOFileReadyToUpload] = useState<File | null>(null)
  const [imageMobileFileReadyToUpload, setImageMobileFileReadyToUpload] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [previewSEO, setPreviewSEO] = useState<string>('')
  const [previewMobile, setPreviewMobile] = useState<string>('')
  const [caption, setCaption] = useState<string>(image?.caption ?? '')
  const [credit, setCredit] = useState<string>(image?.credit ?? '')
  const [focalPoint, setFocalPoint] = useState<ImageFocalPoint | undefined>(image?.focalPoint)

  useEffect(() => {
    if (image) {
      setCurrentImage(image)
      setUploadMode(false)
      setCaption(image.caption ?? '')
      setCredit(image.credit ?? '')
      setFocalPoint(image.focalPoint)
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
      const compressedFileMobile = await compressImage(file, compressOptionsMobile)
      setPreview(URL.createObjectURL(compressedFile))
      setPreviewSEO(URL.createObjectURL(compressedFileSEO))
      setPreviewMobile(URL.createObjectURL(compressedFileMobile))
      setImageFileReadyToUpload(compressedFile)
      setImageSEOFileReadyToUpload(compressedFileSEO)
      setImageMobileFileReadyToUpload(compressedFileMobile)
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
    setPreviewMobile('')
    setImageFileReadyToUpload(null)
    setImageSEOFileReadyToUpload(null)
    setImageMobileFileReadyToUpload(null)
  }

  const uploadPending = async (): Promise<MainImageType | null> => {
    if (!imageFileReadyToUpload || !imageSEOFileReadyToUpload || !imageMobileFileReadyToUpload) return null
    setUploading(true)
    try {
      const extension = getFileExtension(imageFileReadyToUpload)
      const extensionSEO = getFileExtension(imageSEOFileReadyToUpload)
      const extensionMobile = getFileExtension(imageMobileFileReadyToUpload)
      const storageRef = ref(storage, `/imagenes/${fileName}.${extension}`)
      await uploadBytesResumable(storageRef, imageFileReadyToUpload)
      const imageUrl = await getDownloadURL(storageRef)
      const storageSEORef = ref(storage, `/imagenes/seo/${fileName}.${extensionSEO}`)
      await uploadBytesResumable(storageSEORef, imageSEOFileReadyToUpload)
      const imageSEOUrl = await getDownloadURL(storageSEORef)
      const storageMobileRef = ref(storage, `/imagenes/mobile/${fileName}.${extensionMobile}`)
      await uploadBytesResumable(storageMobileRef, imageMobileFileReadyToUpload)
      const imageMobileUrl = await getDownloadURL(storageMobileRef)
      const uploaded: MainImageType = {
        caption,
        credit,
        focalPoint,
        src: imageUrl,
        srcSEO: imageSEOUrl,
        srcMobile: imageMobileUrl,
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
    return currentImage ? { ...currentImage, caption, credit, focalPoint } : null
  }

  return {
    state: {
      uploadMode,
      currentImage,
      file,
      preview,
      previewSEO,
      previewMobile,
      uploading,
      caption,
      credit,
      focalPoint,
    },
    actions: {
      onToggleMode,
      onFileChange,
      cleanUploadTemps,
      resolveImage,
      setCaption,
      setCredit,
      setFocalPoint,
    },
  }
}

export default useMainImage
