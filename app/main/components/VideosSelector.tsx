'use client'

import { useState } from "react"
import { toast } from "react-hot-toast"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { Video } from "@/app/types/sitepage"
import Input from "@/app/components/inputs/Input"
import Button from "@/app/components/Button"
import VideoPreviewPlayer from "./VideoPreviewPlayer"
import usePortada from "../hooks/usePortada"
import Separator from "@/app/components/layout/Separator"

interface VideosSelectorProps {
  current: Video[]
  id: string
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
  const [loading, setLoading] = useState<boolean>(false)
  const {saveVideos}= usePortada()
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: videoArrayToFlatStructure(current)
  })

  const onSubmit:SubmitHandler<FieldValues> = async (payload) => {
    setLoading(true)
    const newVids:Video[] = flatStructureToVideoArray(payload)
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
      <Separator heading label="Videos" />
      <p className="text-sm text-gray-500">
        Estos 4 videos se muestran en el carrousel de la portada del sitio público. El preview
        refleja exactamente cómo se va a ver cada video ahí.
      </p>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex flex-col gap-2 rounded-md border-2 border-gray-200 p-3">
              <span className="text-sm font-semibold text-gray-700">Video {num}</span>
              <VideoPreviewPlayer
                url={watch(`url${num}`)}
                title={watch(`title${num}`)}
              />
              <Input
                id={`title${num}`}
                type="text"
                register={register}
                required={true}
                disabled={loading}
                errors={errors}
                placeHolder={`Título del video ${num}`}
              />
              <Input
                id={`url${num}`}
                type="text"
                register={register}
                required={true}
                disabled={loading}
                errors={errors}
                placeHolder="url del video"
              />
            </div>
          ))}
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
