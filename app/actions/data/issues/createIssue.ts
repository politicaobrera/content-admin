'use server'

import { IssueType } from "@/app/types/issue"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const issueApi = process.env.CONTENT_SERVER_URL + '/issues'

const createIssue = async function (data:Partial<IssueType>):Promise<iResponseOne<IssueType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(issueApi, {
      headers: {...headers, 'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(data)
    })
    if(!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al crear el número (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return { data: res }
  } catch (error) {
    return { error: { status: 500, statusText: "Server Error", message: error as string } }
  }
}

export default createIssue
