'use client'

import Button from "@/app/components/Button"
import useDeploy from "../hooks/useDeploy"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

const StartNewDeploy = () => {
  const router = useRouter()
  const {throwProcess} = useDeploy()
  const handleThrowDeployProcess = async () => {
    throwProcess().then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        toast.success("Proceso de build y deploy lanzado exitosamente")
      }
    })
    router.refresh()
  }

  return (
    <div>
      <Button
        onClick={handleThrowDeployProcess}
      >
        Lanzar proceso de despliegue
      </Button>
    </div>
 )
}

export default StartNewDeploy