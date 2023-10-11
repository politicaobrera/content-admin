'use client'

import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { 
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form"
import { toast } from "react-hot-toast"

const AuthForm = () => {
  const session = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    } 
  } = useForm<FieldValues>({
    defaultValues:{
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/main')
    }
  }, [session?.status, router])

  const onSubmit:SubmitHandler<FieldValues> = (data) => {
    setLoading(true)
    // login
    signIn('credentials', {
      ...data,
      redirect: false,
    }).then((callback) => {
      if (callback?.error) {
        toast.error("sing in error")
      }
      if (callback?.ok && !callback.error) {
        toast.success("logged innnggg")
        router.push('/main')
        router.refresh()
      }
    }).finally(() => setLoading(false))
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
            label="Email"
            id="email"
            type="email"
            register={register}
            disabled={loading}
            errors={errors}
            placeHolder="obreros@alpoder.com"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            disabled={loading}
            register={register}
            errors={errors}
          />
          <div>
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              Login
            </Button>
          </div>
        </form>

        {/* <Separator label="o continua con" />

        <div className="flex gap-2 mt-6">
          <AuthSocialButton
            icon={BsGoogle}
            onClick={() => socialAction('google')}
          />
        </div> */}
      </div>
    </div>
  )
}

export default AuthForm