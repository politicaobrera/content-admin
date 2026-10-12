'use server'

import { CampaignType } from "@/app/types/campaign"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const campaignsApi = process.env.CONTENT_SERVER_URL + '/campaigns'

const deleteCampaign = async function (id: string): Promise<iResponseOne<CampaignType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${campaignsApi}/${id}`, {
      headers: headers,
      cache: 'no-store',
      method: 'DELETE',
    })
    if (!response.ok) {
      console.log(`Error al eliminar la campaña ${id} (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al eliminar la campaña ${id} (${response.status}): ${response.statusText}`,
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

export default deleteCampaign
