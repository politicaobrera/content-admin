'use client'

import { useState } from "react"
import Button from "@/app/components/Button"
import useDeploy from "../hooks/useDeploy"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

const StartNewDeploy = () => {
  const router = useRouter()
  const {throwProcess} = useDeploy()
  const [fullRebuild, setFullRebuild] = useState(false)

  const handleThrowDeployProcess = async () => {
    throwProcess(fullRebuild).then(result => {
      if (result.error){
        toast.error(result.error.message)
      }
      if(result.data){
        toast.success(
          fullRebuild
            ? "Proceso de build completo (desde cero) lanzado exitosamente"
            : "Proceso de build incremental lanzado exitosamente"
        )
      }
    })
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          id="full-rebuild"
          type="checkbox"
          checked={fullRebuild}
          onChange={(e) => setFullRebuild(e.target.checked)}
        />
        <label htmlFor="full-rebuild">
          Build completo desde cero (ignora la cache; usar si algo quedó mal generado)
        </label>
      </div>
      <Button
        onClick={handleThrowDeployProcess}
      >
        Lanzar proceso de despliegue
      </Button>
    </div>
 )
}

export default StartNewDeploy