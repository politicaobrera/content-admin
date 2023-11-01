import { Section } from "@/types/sections"
import { iResponse } from "@/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const sectionsApi = process.env.CONTENT_SERVER_URL + '/sections'

const createSection = async function (data: any):Promise<iResponse<Section>> {
  const auth = await getAuthorizationHeader()
  const headers = {...auth, 'Content-Type': 'application/json'}
  console.log(headers);
  console.log(data);
  
  const response = await fetch("http://localhost:4000/sections", {headers: headers, cache: 'no-store', method: 'POST', body: data})

  
  console.log(response);

  if(!response.ok) {
    console.log(`Error al crear la sección (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener las secciones (${response.status}): ${response.statusText}`,
      },
      data: []
    }
  }
  
  return {
    data: await response.json()
  }
}

export default createSection