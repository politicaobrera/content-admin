'use client'

import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { 
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form"
import { toast } from "react-hot-toast"

const NewArticleForm = () => {
  const session = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    } 
  } = useForm<FieldValues>({
    defaultValues:{
      title: '',
    }
  })

  // TODO: esto aca o en la page?
  useEffect(() => {
    if (session?.status !== 'authenticated') {
      router.push('/')
    }
  }, [session?.status, router])

  const onNewArticle = () => {
    console.log("clicking")
    setShowForm(true)
  }

  const onSubmit:SubmitHandler<FieldValues> = (data) => {
    setLoading(true)
    // post de nota
  }

  return (
    <div
      className="
        mt-8
        sm:mx-auto
        sm:w-fullseparator
        sm:max-w-md
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
        {
          showForm ? (      
            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Título"
                id="title"
                type="text"
                register={register}
                disabled={loading}
                errors={errors}
                placeHolder="Título de la nota"
              />
              <div>
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                >
                  CREAR
                </Button>
              </div>
            </form>
          ) : (
            <Button
              type="button"
              fullWidth
              disabled={loading}
              onClick={onNewArticle}
            >
              NUEVA NOTA
            </Button>
          )
        }
      </div>
    </div>
  )
}

export default NewArticleForm