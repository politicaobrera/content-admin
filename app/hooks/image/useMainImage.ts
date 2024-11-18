import { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression'
import storage from '@/app/services/firebase/storage'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { MainImageType } from "@/app/types/articles"

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

const emptyImage:MainImageType = {
  caption: '',
  src: '',
  srcSEO: '',
}

const useMainImage = (image:MainImageType | undefined, fileName:string, onUpload: (img:MainImageType) => void) => {
  const [uploadMode, setUploadMode] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<MainImageType|null>(image ?? null)
  const [file, setFile] = useState<File|null>(null); // archivo que suben desde la pc temporal
  const [imageFileReadyToUpload, setImageFileReadyToUpload] = useState<File|null>(null)
  const [imageSEOFileReadyToUpload, setImageSEOFileReadyToUpload] = useState<File|null>(null)
  const [preview, setPreview] = useState<string>('')
  const [previewSEO, setPreviewSEO] = useState<string>('')
  const [percent, setPercent] = useState<number>(0)// revisar luego

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
  },[file])

  const processFile = async () => {
    if (file) {
      try {
        let compressedFile = await imageCompression(file, compressOptions);
        let compressedFileSEO = await imageCompression(file, compressOptionsSEO);
        const fileSrc = URL.createObjectURL(compressedFile);
        const fileSrcSEO = URL.createObjectURL(compressedFileSEO);
        setPreview(fileSrc)
        setPreviewSEO(fileSrcSEO)
        setImageFileReadyToUpload(compressedFile)
        setImageSEOFileReadyToUpload(compressedFileSEO)
      } catch (error) {
        console.log("error processing files", error)
      }
    }
  }
  
  const onToggleMode = async () => {
    setUploadMode(!uploadMode)
  }

  const onFileChange = async (f:File|null) => {
    setFile(f)
  }

  const cleanUploadTemps = () => {
    setPreview('')
    setPreviewSEO('')
    setImageFileReadyToUpload(null)
    setImageSEOFileReadyToUpload(null)
  }

  const onSave = async () => {
    if (imageFileReadyToUpload && imageSEOFileReadyToUpload) {
      setUploading(true)
      try {
        const extension = imageFileReadyToUpload.name.split('.').pop()
        const storageRef = ref(storage, `/imagenes/${fileName}.${extension}`)
        await uploadBytesResumable(storageRef, imageFileReadyToUpload);
        const imageUrl = await getDownloadURL(storageRef)
        const storageRefSEO = ref(storage, `/imagenes/seo/${fileName}.${extension}`)
        await uploadBytesResumable(storageRefSEO, imageSEOFileReadyToUpload);
        const imageUrlSEO = await getDownloadURL(storageRefSEO)
        console.log("url", imageUrl)
        console.log("urlSEO", imageUrlSEO)
        // TODO add caption from missing textfield
        const notaImg:MainImageType = {...emptyImage,src:imageUrl, srcSEO: imageUrlSEO}
        setCurrentImage(notaImg)
        onUpload(notaImg)
        cleanUploadTemps()
        onToggleMode()
      } catch (error) {
        console.log("error uploading", error)
        // TODO inform to final user propperly
      } finally {
        setUploading(false)
      }
    } else {
      console.log("error no hay archivo de imagen y de seo!!!!!!!")
    }
  }

  return {
    state: {
      uploadMode,
      currentImage,
      file,
      percent,
      preview,
      previewSEO,
      uploading
    },
    actions: { 
      onToggleMode,
      cleanUploadTemps,
      onFileChange,
      onSave,
    },
  }
}

export default useMainImage