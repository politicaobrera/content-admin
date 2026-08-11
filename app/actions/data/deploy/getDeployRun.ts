'use server'

import { Workflow } from "@/app/types/github";
import { iResponseOne } from "@/app/types/responses";

const ghtoken = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

const getDeployRun = async function (runId: number):Promise<iResponseOne<Workflow>> {
  console.log(`getting deploy run status`)
  try {
    const response:any = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}`,
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
      console.log(`Error al obtener el status del run de deploy numero: ${runId} (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener el status del run de deploy numero: ${runId} (${response.status}): ${response.statusText}`,
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

export default getDeployRun
