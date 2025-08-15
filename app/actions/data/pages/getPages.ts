'use server'

import { PageType } from "@/app/types/sitepage"
import { iResponseMany } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Params } from "@/app/types/requests"
import { buildQueryString } from "@/app/utils/query"

const authorApi = process.env.CONTENT_SERVER_URL + '/pages'

const getPages = async function (searchParams:Params):Promise<iResponseMany<PageType>> {
  console.log("searchParams", searchParams)
  const query = buildQueryString(searchParams)
  console.log("query", query)
  const headers = await getAuthorizationHeader()
  const response = await fetch(`${authorApi}?${query}`, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener los páginas (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener los páginas (${response.status}): ${response.statusText}`,
      },
    }
  }
  const res = await response.json()
  return res
}

export default getPages