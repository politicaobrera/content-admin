'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { AuthorType } from "@/app/types/author"

const authorApi = process.env.CONTENT_SERVER_URL + '/authors'

const editAuthor = async function (data:AuthorType):Promise<iResponseOne<AuthorType>> {
  const auth = await getAuthorizationHeader()
  const headers = {...auth, 'Content-Type': 'application/json'}
  console.log('data',data);
  const response = await fetch(`${authorApi}/${data._id}`,
   {
    headers: headers,
    cache: 'no-store',
    method: 'PATCH', 
    body: JSON.stringify(data)
  })

  if(!response.ok) {
    // el backend devuelve un `messaje` específico en el body (ej. choque de nombre/slug
    // duplicado) -- sin leerlo, el toast siempre mostraba el statusText genérico
    // ("Bad Request"/"Conflict") sin decir la causa real.
    const body = await response.json().catch(() => null)
    const specificMessage = body?.messaje
    console.log(`Error al editar el autor ${data._id} (${response.status}): ${response.statusText}`, body)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: specificMessage || `Error al editar el autor ${data._id}(${response.status}): ${response.statusText}`,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default editAuthor