'use client'

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import useDeploy from "../hooks/useDeploy"
import useArticle from "@/app/articles/hooks/useArticle"
import { toast } from "react-hot-toast"
import { Job } from "@/app/types/github"
import { calculateDuration } from "@/app/utils/time"

interface ViewDeployInProgressProps {
  runId: number
}

const ViewDeployInProgress = ({ runId }: ViewDeployInProgressProps) => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const {getProcess, getRun} = useDeploy()
    const {markPublishedSynced} = useArticle()
    const router = useRouter()
    const handledCompletionRef = useRef(false)

    const fetchProgress = useCallback(async () => {
      if (!runId) return;
      try {
        const result = await getProcess(runId);
        if (result.error) {
          toast.error(result.error.message);
        }
        if (result.data) {
          setJobs(result.data.jobs || []);
        }
      } catch (error) {
        console.error("Error al obtener progreso:", error);
      } finally {
        setLoading(false);
      }
    }, [runId, getProcess]);

    const checkRunCompletion = useCallback(async (onComplete: () => void) => {
      if (!runId || handledCompletionRef.current) return;
      const result = await getRun(runId);
      if (result.data?.status !== "completed") return;

      handledCompletionRef.current = true;
      onComplete();

      if (result.data.conclusion === "success") {
        const syncResult = await markPublishedSynced();
        if (syncResult.error) {
          toast.error(syncResult.error.message);
        } else {
          toast.success("Deploy exitoso: se actualizó el estado de las notas publicadas con cambios pendientes");
        }
      }
      router.refresh();
    }, [runId, getRun, markPublishedSynced, router]);

    useEffect(() => {
      fetchProgress();
      const interval = setInterval(() => {
        fetchProgress();
        checkRunCompletion(() => clearInterval(interval));
      }, 5000);
      return () => clearInterval(interval);
    }, [fetchProgress, checkRunCompletion]);
  
    if (loading) return <p>🔄 Cargando progreso...</p>
    if (jobs.length === 0) return <p>📭 No hay información de progreso.</p>
  
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Proceso Actual</h2>
        {/* <h3>📊 Progreso del Workflow</h3> */}
        {jobs.map((job) => (
          <div key={job.id} className="flex flex-col gap-2">
            <h4 className="text-xl font-bold">🛠 {job.name}</h4>
            <ul>
              {job.steps.map((step, index) => (
                <li key={index}>
                  {step.name} → {step.status === "completed" ? "✅ in "+calculateDuration(step.started_at, step.completed_at)+"s" : step.status === "in_progress" ? "⏳" : "🕒"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
}

export default ViewDeployInProgress