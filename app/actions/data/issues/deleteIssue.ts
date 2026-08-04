'use server'

import { IssueType } from "@/app/types/issue"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const issueApi = process.env.CONTENT_SERVER_URL + '/issues'

const deleteIssue = async function (id:string):Promise<iResponseOne<IssueType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${issueApi}/${id}`, {
      headers: headers,
      cache: 'no-store',
      method: 'DELETE',
    })
    if(!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al eliminar el número ${id} (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return { data: res }
  } catch (error) {
    return { error: { status: 500, statusText: "Server Error", message: error as string } }
  }
}

export default deleteIssue
