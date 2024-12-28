'use client'

import React, { useState } from "react"
import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import { useRouter } from "next/navigation"
import { 
  FieldValues,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form"
import { toast } from "react-hot-toast"
import { AuthorType } from "@/app/types/author"
import Separator from "@/app/components/Separator"
import useAuthorHook from "../hooks/useAuthorHook"

interface AuthorFormProps {
  author?: AuthorType
}

const AuthorForm:React.FC<AuthorFormProps> = ({author}) => {
  console.log("autor con data", author)
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const {edit, create} = useAuthorHook();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: {
      errors,
    } 
  } = useForm<FieldValues | {name: string, descriptions: string[]}>({
    defaultValues:{
      name: author?.name || "",
      descriptions: author?.descriptions || [""],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "descriptions",
  });

  const onSubmit:SubmitHandler<FieldValues> = (payload) => {
    setLoading(true)
    if (author) {
      // edit
      console.log("voy a guardar", payload)
      console.log("old author", author)
      const merged:AuthorType = Object.assign(author, payload)
      console.log("merged", merged)
  
      edit(merged).then(result => {
        if (result.error){
          toast.error(result.error.message)
        } 
        if(result.data){
          toast.success("Autor editada correctamente")
          router.push('/authors')
        }
      })
    }

    create(payload as AuthorType).then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        toast.success("Autor creado correctamente")
        router.push('/authors')
      }
    })

    setLoading(false)
  }

  const handleCancel = () => {
    router.push(`/authors`);
  };

  return (
    <div
      className="
        mt-8
        sm:mx-auto
      "
    >
      <div
        className="
          bg-white
          px-4
          py-8
          sm:rounded-lg
          sm:px-10
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
            placeHolder="Nombre autor"
          />
          <Separator />
          {/* <Input
            label="Descripciones"
            id="description"
            type="text"
            register={register}
            key={`author-descriptions-${author._id}`}
            disabled={loading}
            errors={errors}
            placeHolder="Descripciones"
          /> */}
          {fields.map((field, index) => (
            <div key={field.id} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <input
                {...register(`descriptions.${index}`)}
                placeholder={`Descripción ${index + 1}`}
                disabled={loading}
                style={{ flex: 1, marginRight: "8px" }}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={loading}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Borrar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append("")}
            disabled={loading}
            style={{ marginTop: "8px" }}
          >
            Agregar descripción
          </button>
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

export default AuthorForm