'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { CampaignType } from "@/app/types/campaign"

const campaignsApi = process.env.CONTENT_SERVER_URL + '/campaigns'

const editCampaign = async function (data: Partial<CampaignType>): Promise<iResponseOne<CampaignType>> {
  try {
    const auth = await getAuthorizationHeader()
    const headers = { ...auth, 'Content-Type': 'application/json' }
    const response = await fetch(`${campaignsApi}/${data._id}`,
      {
        headers: headers,
        cache: 'no-store',
        method: 'PATCH',
        body: JSON.stringify(data)
      })

    if (!response.ok) {
      console.log(`Error al editar la campaña ${data._id} (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al editar la campaña ${data._id} (${response.status}): ${response.statusText}`,
        },
      }
    }

    return {
      data: await response.json()
    }
  } catch (error) {
    return {
      error: {
        status: 401,
        statusText: "Unauthorized",
        message: error instanceof Error ? error.message : "No autenticado",
      },
    }
  }
}

export default editCampaign
