'use server'

import { AuthorType } from "@/app/types/author"
import { iResponseMany } from "@/app/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Params } from "@/app/types/Requests"
import { buildQueryString } from "@/app/utils/query"

const authorApi = process.env.CONTENT_SERVER_URL + '/authors'

const getAuthors = async function (searchParams:Params):Promise<iResponseMany<AuthorType>> {
  console.log("searchParams", searchParams)
  const query = buildQueryString(searchParams)
  console.log("query", query)
  const headers = await getAuthorizationHeader()
  const response = await fetch(`${authorApi}?${query}`, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener los articulos (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener los articulos (${response.status}): ${response.statusText}`,
      },
    }
  }
  const res = await response.json()
  return res
}

export default getAuthors