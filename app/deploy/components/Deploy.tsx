import getDeployActions from "@/app/actions/data/deploy/getDeployActions"
import StartNewDeploy from "./StartNewDeploy"
import { Workflow } from "@/app/types/github"
import ViewDeployInProgress from "./ViewDeployInProgress"

const Deploy = async () => {
  const {data: gitHubActionsData, error} = await getDeployActions()
  const completed = gitHubActionsData?.workflow_runs.filter(i => i.status === "completed")
  const inProgress = gitHubActionsData?.workflow_runs.filter(i => i.status !== "completed")

  return (
    <div className="mt-5 flex flex-col gap-2">
      <StartNewDeploy />
      {
        inProgress && inProgress?.length > 0 && (
          <ViewDeployInProgress runId={inProgress[0].id}/>
        )
      }
      <h2 className="text-2xl font-bold">Procesos anteriores</h2>
      <div className="flex flex-col gap-1">
        {completed?.map((job:Workflow, idx:number) => (
          <div className="flex gap-4" key={"old-process"+idx}>
            <div>
              {job.conclusion}
            </div>
            <div>
              {job.status}
            </div>
            <div>
              {job.name}
            </div>
            <div>
              {job.created_at}
            </div>
          </div>
        ))}
      </div>
    </div>
 )
}

export default Deploy