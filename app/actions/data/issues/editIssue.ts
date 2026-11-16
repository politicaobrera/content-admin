'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { IssueType } from "@/app/types/issue"

const issueApi = process.env.CONTENT_SERVER_URL + '/issues'

const editIssue = async function (data:Partial<IssueType>):Promise<iResponseOne<IssueType>> {
  try {
    const auth = await getAuthorizationHeader()
    const headers = {...auth, 'Content-Type': 'application/json'}
    const response = await fetch(`${issueApi}/${data._id}`, {
      headers: headers,
      cache: 'no-store',
      method: 'PATCH',
      body: JSON.stringify(data)
    })

    if(!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al editar el número ${data._id}(${response.status}): ${response.statusText}`,
        },
      }
    }

    return { data: await response.json() }
  } catch (error) {
    return {
      error: {
        status: 401,
        statusText: "Unauthorized",
        message: error instanceof Error ? error.message : "No autenticado",
      },
    }
  }
}

export default editIssue
