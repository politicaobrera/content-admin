'use server'
import { iResponseOne } from "@/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Section } from "@/app/sections/types/sections"

const sectionsApi = process.env.CONTENT_SERVER_URL + '/sections'

const getSection = async function (id: string):Promise<iResponseOne<Section>> {
  // TODO changeit for get headers
  const headers = await getAuthorizationHeader()
  console.log("obteniendo", id)
  console.log("headers", headers)
  console.log("url", `${sectionsApi}/${id}`)

  const response = await fetch(`${sectionsApi}/${id}`, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener la seccion (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener la seccion (${response.status}): ${response.statusText}`,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default getSection