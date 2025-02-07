'use server'

import { TagType } from "@/app/types/tag"
import { iResponseMany } from "@/app/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Params } from "@/app/types/Requests"
import { buildQueryString } from "@/app/utils/query"

const tagsApi = process.env.CONTENT_SERVER_URL + '/tags'

const getTags = async function (searchParams:Params):Promise<iResponseMany<TagType>> {
  console.log("searchParams", searchParams)
  const query = buildQueryString(searchParams)
  console.log("query", query)
  const headers = await getAuthorizationHeader()
  const response = await fetch(`${tagsApi}?${query}`, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener los tags (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener los tags (${response.status}): ${response.statusText}`,
      },
    }
  }
  const res = await response.json()
  return res
}

export default getTags