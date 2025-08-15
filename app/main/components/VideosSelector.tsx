'use client'

import { useState } from "react"
import { toast } from "react-hot-toast"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { Video } from "@/app/types/sitepage"
import Input from "@/app/components/inputs/Input"
import Button from "@/app/components/Button"
import usePortada from "../hooks/usePortada"

interface VideosSelectorProps {
  current: Video[]
  id: string
}

interface VideoFormValues {
  title1?: string
  url1?: string
  title2?: string
  url2?: string
  title3?: string
  url3?: string
  title4?: string
  url4?: string
}


function videoArrayToFlatStructure(array: Video[]): {[key:string]:string} {
  const result:any = {}
  array.forEach((item, index) => {
    const num = index + 1
    result[`title${num}`] = item.title || ''; // Asigna el título o un string vacío si no existe
    result[`url${num}`] = item.src || '';     // Asigna la URL o un string vacío si no existe
  });

  // Si el array tiene menos de 4 elementos, rellena los campos restantes con strings vacíos
  for (let i = array.length + 1; i <= 4; i++) {
    result[`title${i}`] = '';
    result[`url${i}`] = '';
  }

  return result;
}

function flatStructureToVideoArray(values: {[key:string]:string}): Video[] {
  const result = [];

  for (let i = 1; i <= 4; i++) {
    const titleKey = `title${i}`;
    const urlKey = `url${i}`;

    // Solo agrega al array si tanto el título como la URL tienen valores
    if (values[titleKey] || values[urlKey]) {
      result.push({
        src: values[urlKey] || '', // Usa un string vacío si no hay URL
        title: values[titleKey] || '' // Usa un string vacío si no hay título
      });
    }
  }

  return result;
}

const VideosSelector = ({id, current}: VideosSelectorProps) => {
  const [currentVideos, setCurrentVideos] = useState(current)
  const [loading, setLoading] = useState<boolean>(false)
  const {saveVideos}= usePortada()
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    } 
  } = useForm<FieldValues>({
    // defaultValues:{
    //   title1: '',
    //   url1: '',
    //   title2: '',
    //   url2: '',
    //   title3: '',
    //   url3: '',
    //   title4: '',
    //   url4: '',
    // }
    defaultValues: videoArrayToFlatStructure(currentVideos)
  })

  const onSubmit:SubmitHandler<FieldValues> = async (payload) => {
    console.log(payload)
    setLoading(true)
    const newVids:Video[] = flatStructureToVideoArray(payload)
    console.log("newVids", newVids)
    saveVideos(newVids, id).then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        toast.success("videos de portada actualizado correctamente")
      }
      setLoading(false)
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <h5>Videos</h5>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <Input
            label="1"
            id="title1"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Título del primer video"
          />
          <Input
            id="url1"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="url del video"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            label="2"
            id="title2"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Título del segundo video"
          />
          <Input
            id="url2"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="url del video"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            label="Título 3"
            id="title3"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Título del tercero video"
          />
          <Input
            id="url3"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="url del video"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            label="Título 4"
            id="title4"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Título del cuarto video"
          />
          <Input
            id="url4"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="url del video"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
        >
          Guardar
        </Button>
      </form>
    </div>
 )
}

export default VideosSelector