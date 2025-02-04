import { GitHubWorkflowRuns } from "@/app/types/github";
import { iResponseOne } from "@/app/types/Responses";

const ghtoken = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

const getDeployActions = async function ():Promise<iResponseOne<GitHubWorkflowRuns>> {
  console.log(`getting github state`)
  try {
    const response:any = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs`,
      {
        headers: {
          Authorization: `Bearer ${ghtoken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        },
      }
    );
  
    if(!response.ok) {
      console.log(`Error al obtener el status de workflows desde github (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener el status de workflows desde github (${response.status}): ${response.statusText}`,
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

export default getDeployActions