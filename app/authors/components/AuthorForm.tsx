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
import ActionButtonsContainer from "@/app/components/layout/ActionButtonsContainer"

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

  const onSubmit:SubmitHandler<FieldValues | AuthorType> = (payload) => {
    console.log("voy a guardar", payload)
    setLoading(true)
    // clean payload empty descriptions
    const cleanPayload: Partial<AuthorType> = {
      ...payload,
      descriptions: payload.descriptions.filter((i:string) => i !== "")
    }
    console.log("cleanPayload", cleanPayload)
    if (author) {
      // edit
      console.log("old author", author)
      const merged:AuthorType = Object.assign(author, cleanPayload)
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

    create(cleanPayload as AuthorType).then(result => {
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

          <div>
            <label
              className="
                block
                text-sm
                text-gray-900
                font-medium
                leading-6
              "
              htmlFor={"descriptions"}
            >
              {"Descripciones"}
            </label>
            {fields.map((field, index) => (
              <div key={field.id} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <input
                  {...register(`descriptions.${index}`)}
                  placeholder={`Descripción ${index + 1}`}
                  disabled={loading}
                  style={{ flex: 1, marginRight: "8px" }}
                />
                <Button
                  onClick={() => remove(index)}
                  disabled={loading}
                  secondary
                >
                  Borrar
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={() => append("")}
            disabled={loading}
          >
            Agregar descripción
          </Button>
          <Separator />
          <ActionButtonsContainer>
            <Button
              type="submit"
              disabled={loading}
            >
              {
                loading ? 'Loading' : 'Guardar'
              }
            </Button>
            <Button
              danger
              disabled={loading}
              onClick={handleCancel}
            >
              {
                loading ? 'Loading' : 'Cancelar'
              }
            </Button>
          </ActionButtonsContainer>
        </form>
      </div>
    </div>
  )
}

export default AuthorForm