'use server'

import { Article } from "@/types/articles"
import { iResponse } from "@/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import axios from 'axios'

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

const createArticle = async function (title:string):Promise<iResponse<Article>> {
  // await setAuthCookie()
  const headers = await getAuthorizationHeader()
  const payload = {title}
  console.log("article", articlesApi, JSON.stringify(payload))
  const response = await fetch(
    articlesApi,
    {
      headers: {...headers, 'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )
    // TODO hacer funcion que genera el objeto de error y hace console.log con el mensaje a travez de los parametros
  if(!response.ok) {
    console.log(`Error al crear el articulo (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al crear el articulo (${response.status}): ${response.statusText}`,
      },
    }
  }
  const res = await response.json()
  return {
    data: res
  }
}

export default createArticle