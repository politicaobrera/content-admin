'use server'

import { PageType } from "@/app/types/page"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const authorApi = process.env.CONTENT_SERVER_URL + '/pages'

const getPageByName = async function (name:string):Promise<iResponseOne<PageType>> {
  // await setAuthCookie()
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(
        `${authorApi}/name/${name}`,
        {
          headers: {...headers, 'Accept': 'application/json'},
          cache: 'no-store'
        }
      )
  
    if(!response.ok) {
      console.log(`Error al obtener la página (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener la página (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return {
      data: res
    }
  } catch (error) {
    console.log(error)
    return {
      error: {
        status: 500,
        statusText: "Server Error",
        message: error as string,
      },
    }
  }
}

export default getPageByName