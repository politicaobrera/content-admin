'use server'

import { ResourceType } from "@/app/types/resource"
import { iResponseMany } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Params } from "@/app/types/requests"
import { buildQueryString } from "@/app/utils/query"

const resourcesApi = process.env.CONTENT_SERVER_URL + '/resources'

const getResources = async function (searchParams:Params):Promise<iResponseMany<ResourceType>> {
  try {
    console.log("searchParams", searchParams)
    const query = buildQueryString(searchParams)
    console.log("query", query)
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${resourcesApi}?${query}`, {headers: headers, cache: 'no-store'})

    if(!response.ok) {
      console.log(`Error al obtener los recursos (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener los recursos (${response.status}): ${response.statusText}`,
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

export default getResources