'use client'

import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { 
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form"
import { toast } from "react-hot-toast"
import { iResponseOne } from "@/app/types/Responses"
import { Article } from "@/app/types/articles"
import editArticle from "@/app/actions/data/articles/editArticle"
import Separator from "@/app/components/Separator"
import useArticleHook from "../hooks/useArticleHook"

interface ArticleFormProps {
  article: Article
}

const ArticleForm:React.FC<ArticleFormProps> = ({article}) => {
  console.log("articulo con data", article)
  const session = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const {edit} = useArticleHook();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    } 
  } = useForm<FieldValues>({
    defaultValues:{
      title: article.title,
      volanta: article.volanta || "",
      subhead: article.subhead || "",
      content: article.content || ""
    }
  })

  // TODO: esto aca o en la page?
  useEffect(() => {
    if (session?.status !== 'authenticated') {
      router.push('/')
    }
  }, [session?.status, router])

  const onSubmit:SubmitHandler<FieldValues> = (payload) => {
    setLoading(true)
    console.log("voy a guardar", payload)
    console.log("old article", article)
    const merged = Object.assign(article, payload)
    console.log("merged", merged)
    edit(merged as Article).then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        toast.success("Nota editada correctamente")
        // router.push('/main')
      }
    })
    setLoading(false)
    // push to list todo
    router.refresh()
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
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Título"
            id="title"
            type="text"
            register={register}
            key={`article-title-${article._id}`}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Título de la nota"
          />
          <Input
            label="Volanta"
            id="volanta"
            type="text"
            register={register}
            key={`article-volanta-${article._id}`}
            disabled={loading}
            errors={errors}
            placeHolder="Volanta"
          />
          <Input
            label="Bajada"
            id="subhead"
            type="text"
            register={register}
            key={`article-subhead-${article._id}`}
            disabled={loading}
            errors={errors}
            placeHolder="Bajada"
          />
          <Separator />
          <Input
            label="Contenido"
            id="content"
            type="text"
            register={register}
            key={`article-content-${article._id}`}
            disabled={loading}
            errors={errors}
            placeHolder="Contenido"
          />
          <div>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              GUARDAR
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArticleForm