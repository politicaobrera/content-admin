import { useEffect, useState } from "react"
import imageCompression from 'browser-image-compression'
import storage from '@/app/services/firebase/storage'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { ResourceOrigin, ResourceSourceType } from "@/app/types/resource"
import { sluged } from "@/app/utils/strings"

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

const useResourceFile = (
  source: string | null,
  sourceType: ResourceSourceType,
  fileName: string,
  origin: ResourceOrigin = ResourceOrigin.Resources
) => {
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
    if (!file) return
    if (sourceType !== ResourceSourceType.Image) {
      setImageFileToUpload(file)
      return
    }
    try {
      let compressedFile = await imageCompression(file, compressOptions);
      const fileSrc = URL.createObjectURL(compressedFile);
      setPreview(fileSrc)
      setImageFileToUpload(compressedFile)
    } catch (error) {
      console.log("error procesando archivo de recurso", error)
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

  const uploadFile = async (fileToUpload: File): Promise<string> => {
    setLoading(true)
    try {
      const extension = fileToUpload.name.split('.').pop()
      const slug = sluged(fileName) || sluged(fileToUpload.name.replace(/\.[^/.]+$/, ''))
      const originPath = origin === ResourceOrigin.Publications ? 'publications/' : ''
      const storageRef = ref(storage, `/recursos/${originPath}${slug}.${extension}`)
      await uploadBytesResumable(storageRef, fileToUpload);
      const url = await getDownloadURL(storageRef)
      setCurrent(url)
      cleanUploadTemp()
      return url
    } catch (error) {
      console.log("error uploading recurso", error)
      return ""
    } finally {
      setLoading(false)
    }
  }

  const onUploadImage = async () => {
    if (!imageFileToUpload) {
      console.log("error no hay archivo para subir")
      return ""
    }
    return uploadFile(imageFileToUpload)
  }

  // uploads the pending file (if any) and returns the resulting url, or the current url if nothing changed
  const resolveUrl = async (): Promise<string> => {
    if (imageFileToUpload) {
      const uploaded = await uploadFile(imageFileToUpload)
      if (uploaded) return uploaded
    }
    return current || ""
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
      resolveUrl,
      cleanUploadTemp,
      setCurrent,
    }
  }
}

export default useResourceFile