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
import createArticle from "@/app/actions/data/articles/createArticle"
import { toast } from "react-hot-toast"
import { iResponseOne } from "@/app/types/responses"
import { ArticleType } from "@/app/types/article"

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

  useEffect(() => {
    if (session?.status !== 'authenticated') {
      router.push('/')
    }
  }, [session, router])

  const onSubmit:SubmitHandler<FieldValues> = async (payload) => {
    setLoading(true)
    const {data, error}:iResponseOne<ArticleType> = await createArticle(payload.title)
    if (error){
      toast.error(error.message)
    } 
    if(data){
      toast.success("Nota creada correctamente")
      // router.push('/main')
    }
    setLoading(false)
    setShowForm(false)
    router.refresh()
  }

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-md
      "
    >
      <div
        className="
          bg-white
          p-4
          rounded-lg
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
                required={true}
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
              onClick={() => setShowForm(true)}
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