import { useEffect, useState } from "react"
import imageCompression from 'browser-image-compression'
import storage from '@/app/services/firebase/storage'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { BannerType } from "@/app/types/sitepage"

const compressOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  useWebWorker: true
}

const useBanner = (banner: BannerType | null, pageName?: string) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [currentBanner, setCurrentBanner] = useState<BannerType|null>(banner)
  const [preview, setPreview] = useState<string>('')
  const [file, setFile] = useState<File|null>(null);
  const [imageFileToUpload, setImageFileToUpload] = useState<File|null>(null)

  useEffect(() => {
    processFile()
  },[file])

  const processFile = async () => {
    if (file) {
      try {
        let compressedFile = await imageCompression(file, compressOptions);
        const fileSrc = URL.createObjectURL(compressedFile);
        setPreview(fileSrc)
        setImageFileToUpload(compressedFile)
      } catch (error) {
        console.log("error processing files", error)
      }
    }
  }

  const onFileChange = async (f:File|null) => {
    setFile(f)
  }

  const cleanUploadTemp = async () => {
    setImageFileToUpload(null)
    setPreview("")
    setFile(null)
  }

  const isImageReadyForUpload = !!imageFileToUpload

  const onUploadImage = async () => {
    let url = ""
    if (imageFileToUpload) {
      setLoading(true)
      try {
        const storageRef = ref(storage, `/banners/${pageName ? `${pageName}/` : ''}${imageFileToUpload.name}`)
        await uploadBytesResumable(storageRef, imageFileToUpload);
        url = await getDownloadURL(storageRef)
        console.log("url banner", url)
        const newBanner = {...currentBanner, src: url} as BannerType
        console.log("new banner", newBanner)
        setCurrentBanner(newBanner)
        cleanUploadTemp()
      } catch (error) {
        console.log("error uploading banner", error)
      } finally {
        setLoading(false)
      }
    } else {
      console.log("error no hay archivo de imagen procesado para subir")
    }
    return url
  }

  return {
    state: {
      isEditing,
      loading,
      banner: currentBanner,
      preview,
      file,
      isImageReadyForUpload,
    },
    actions:{
      setIsEditing,
      onFileChange,
      onUploadImage,
      cleanUploadTemp,
      setCurrentBanner,
    }
  }
}

export default useBanner