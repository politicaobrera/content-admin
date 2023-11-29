'use server'
import { iResponse, iResponseId } from "@/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Section } from "@/app/sections/types/sections"

const sectionsApi = process.env.CONTENT_SERVER_URL + '/sections'

const getSections = async function (id: string):Promise<iResponseId<Section>> {
  const headers = await getAuthorizationHeader()
  const response = await fetch(`${sectionsApi}/${id}`, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener la seccion (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener la seccion (${response.status}): ${response.statusText}`,
      },
      data: undefined
    }
  }
  
  return {
    data: await response.json()
  }
}

export default getSections