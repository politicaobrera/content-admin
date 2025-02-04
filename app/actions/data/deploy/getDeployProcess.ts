'use server'

import { GitHubWorkflowJobs } from "@/app/types/github";
import { iResponseOne } from "@/app/types/Responses";

const ghtoken = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

const getDeployProcess = async function (runId: number):Promise<iResponseOne<GitHubWorkflowJobs>> {
  console.log(`getting deploy process status`)
  try {
    const response:any = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/jobs`,
      {
        headers: {
          Authorization: `Bearer ${ghtoken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        cache: 'no-store',
      }
    );
  
    if(!response.ok) {
      console.log(`Error al obtener el status del proceso de deploy numero: ${runId} (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener el status del proceso de deploy numero: ${runId} (${response.status}): ${response.statusText}`,
        },
      }
    }
    
    const res = await response.json()
    return {
      data: res
    }   
  } catch (error) {
    console.log(error)
    return {
      error: {
        status: 500,
        statusText: "Server Error",
        message: error as string,
      },
    }
  }
}

export default getDeployProcess