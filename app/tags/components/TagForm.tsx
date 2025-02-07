'use client'

import React, { useState } from "react"
import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import { useRouter } from "next/navigation"
import { 
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { toast } from "react-hot-toast"
import Separator from "@/app/components/Separator"
//import useAuthorHook from "../hooks/useAuthorHook"
import { TagType } from "@/app/types/tag"
import useTagHook from "../hooks/useTagHook"

interface TagFormProps {
  tag?: TagType
}

const TagForm:React.FC<TagFormProps> = ({tag}) => {
  console.log("tag con data", tag)
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const {edit, create} = useTagHook();

  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
    } 
  } = useForm<FieldValues | {name: string}>({
    defaultValues:{
      name: tag?.name || "",
    },
  })

  const onSubmit:SubmitHandler<FieldValues | TagType> = (payload) => {
    console.log("voy a guardar tag", payload)
    setLoading(true)
    // clean payload empty descriptions
    if (tag) {
      // edit
      console.log("old tag", tag)
      const merged:TagType = Object.assign(tag, payload)
      console.log("merged", merged)
      edit(merged).then(result => {
        if (result.error){
          toast.error(result.error.message)
        } 
        if(result.data){
          toast.success("Tag editado correctamente")
          router.push('/tags')
        }
      })
    }

    create(payload as TagType).then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        toast.success("Tag creado correctamente")
        router.push('/tags')
      }
    })

    setLoading(false)
  }

  const handleCancel = () => {
    router.push(`/tags`);
  };

  return (
    <div
      className="
        mt-8
        mx-4
      "
    >
      <div
        className="
          bg-white
          px-4
          py-8
          rounded-lg
          shadow
        "
      >
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Nombre"
            id="name"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Nombre"
          />

          <Separator />
          <div className="space-y-2">
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {
                loading ? 'Loading' : 'Guardar'
              }
            </Button>
            <Button
              fullWidth
              danger
              disabled={loading}
              onClick={handleCancel}
            >
              {
                loading ? 'Loading' : 'Cancelar'
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TagForm