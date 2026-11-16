'use server'

import { WorkType } from "@/app/types/work"
import { iResponseMany } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Params } from "@/app/types/requests"
import { buildQueryString } from "@/app/utils/query"

const worksApi = process.env.CONTENT_SERVER_URL + '/works'

const getWorks = async function (searchParams: Params): Promise<iResponseMany<WorkType>> {
  try {
    const query = buildQueryString(searchParams)
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${worksApi}?${query}`, { headers: headers, cache: 'no-store' })

    if (!response.ok) {
      console.log(`Error al obtener las obras (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener las obras (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return res
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

export default getWorks
