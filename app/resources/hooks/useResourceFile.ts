import { useEffect, useState } from "react"
import imageCompression from 'browser-image-compression'
import storage from '@/app/services/firebase/storage'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { ResourceSourceType } from "@/app/types/resource"

const compressOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  useWebWorker: true
}

const getFileAcceptType = (sourceType: ResourceSourceType) => {
  switch (sourceType) {
    case ResourceSourceType.Video:
      return "video/*"
    case ResourceSourceType.Audio:
      return "audio/*"
    case ResourceSourceType.Image:
      return "image/*"
    case ResourceSourceType.Document:
      return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.html,.htm"
    default:
      return ""
  }
};

const useResourceFile = (source: string | null, sourceType: ResourceSourceType) => {
  const [isEditing, setIsEditing] = useState<boolean>(source ? false : true)
  const [loading, setLoading] = useState<boolean>(false)
  const [accept, setAccept] = useState<string>("")
  const [current, setCurrent] = useState<string|null>(source)
  const [preview, setPreview] = useState<string>('')
  const [file, setFile] = useState<File|null>(null);
  const [imageFileToUpload, setImageFileToUpload] = useState<File|null>(null)

  useEffect(() => {
    processFile()
  },[file])

  useEffect(() =>{
    setAccept(getFileAcceptType(sourceType))
  }, [sourceType])

  const processFile = async () => {
    if (file) {
      try {
        let compressedFile = await imageCompression(file, compressOptions);
        const fileSrc = URL.createObjectURL(compressedFile);
        setPreview(fileSrc)
        setImageFileToUpload(compressedFile)
      } catch (error) {
        console.log("error procesando archivo de recurso", error)
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
        const storageRef = ref(storage, `/recursos/${imageFileToUpload.name}`)
        await uploadBytesResumable(storageRef, imageFileToUpload);
        url = await getDownloadURL(storageRef)
        console.log("url recurso", url)
        setCurrent(url)
        cleanUploadTemp()
      } catch (error) {
        console.log("error uploading recurso", error)
      } finally {
        setLoading(false)
      }
    } else {
      console.log("error no hay archivo para subir")
    }
    return url
  }

  return {
    state: {
      isEditing,
      loading,
      current,
      preview,
      file,
      isImageReadyForUpload,
      accept
    },
    actions:{
      setIsEditing,
      onFileChange,
      onUploadImage,
      cleanUploadTemp,
      setCurrent,
    }
  }
}

export default useResourceFile