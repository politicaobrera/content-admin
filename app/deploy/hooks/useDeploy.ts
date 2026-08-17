import getDeployProcess from "@/app/actions/data/deploy/getDeployProcess";
import getDeployRun from "@/app/actions/data/deploy/getDeployRun";
import throwDeployProcess from "@/app/actions/data/deploy/throwDeployProcess";
import { GitHubWorkflowJobs, Workflow } from "@/app/types/github";
import { iResponseOne } from "@/app/types/responses";

export default function useDeploy(){
  const throwProcess = async (fullRebuild: boolean = false) : Promise<iResponseOne<any>> => {
    const {data, error} = await throwDeployProcess(fullRebuild);
    return {data, error};
  }

  const getProcess = async (runId: number) : Promise<iResponseOne<GitHubWorkflowJobs>> => {
    const {data, error} = await getDeployProcess(runId);
    return {data, error};
  }

  const getRun = async (runId: number) : Promise<iResponseOne<Workflow>> => {
    const {data, error} = await getDeployRun(runId);
    return {data, error};
  }

  return {throwProcess, getProcess, getRun}

}