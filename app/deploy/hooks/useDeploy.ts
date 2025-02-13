import getDeployProcess from "@/app/actions/data/deploy/getDeployProcess";
import throwDeployProcess from "@/app/actions/data/deploy/throwDeployProcess";
import { GitHubWorkflowJobs, Job } from "@/app/types/github";
import { iResponseOne } from "@/app/types/responses";

export default function useDeploy(){
  const throwProcess = async () : Promise<iResponseOne<any>> => {
    const {data, error} = await throwDeployProcess();
    return {data, error};
  }

  const getProcess = async (runId: number) : Promise<iResponseOne<GitHubWorkflowJobs>> => {
    const {data, error} = await getDeployProcess(runId);
    return {data, error};
  }

  return {throwProcess, getProcess}

}