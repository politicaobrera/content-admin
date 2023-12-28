'use server'
import { Section } from "../../../sections/types/sections"
import { iResponseMany } from "@/app/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const sectionsApi = process.env.CONTENT_SERVER_URL + '/sections'

const getSections = async function ():Promise<iResponseMany<Section>> {
  // await setAuthCookie()
  const headers = await getAuthorizationHeader()
  const response = await fetch(sectionsApi, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener las secciones (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener las secciones (${response.status}): ${response.statusText}`,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default getSections