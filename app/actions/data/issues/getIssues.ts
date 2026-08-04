'use server'

import { IssueType } from "@/app/types/issue"
import { iResponseMany } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Params } from "@/app/types/requests"
import { buildQueryString } from "@/app/utils/query"

const issuesApi = process.env.CONTENT_SERVER_URL + '/issues'

const getIssues = async function (searchParams:Params):Promise<iResponseMany<IssueType>> {
  const query = buildQueryString(searchParams)
  const headers = await getAuthorizationHeader()
  const response = await fetch(`${issuesApi}?${query}`, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener los números (${response.status}): ${response.statusText}`,
      },
    }
  }
  const res = await response.json()
  return res
}

export default getIssues
