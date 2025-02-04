'use server'

import { GitHubWorkflowRuns } from "@/app/types/github";
import { iResponseOne } from "@/app/types/Responses";

const ghtoken = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const workflow = process.env.WORKFLOW;

const throwDeployProcess = async function ():Promise<iResponseOne<any>> {
  console.log(`throwing github build and deploy action`)
  try {
    const response:any = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
      {
        headers: {
          Authorization: `Bearer ${ghtoken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
        cache: 'no-store',
        method: 'POST',
        body: JSON.stringify({ref: "master"})
      }
    );
    if(!response.ok) {
      console.log(`Error al lanzar proceso build y deploy en github (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al lanzar proceso build y deploy en github (${response.status}): ${response.statusText}`,
        },
      }
    }
    return {
      data: "OK"
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

export default throwDeployProcess