import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import getCampaign from "@/app/actions/data/campaigns/getCampaign"
import ErrorMessage from "@/app/components/ErrorMessage"
import CampaignForm from "../components/CampaignForm"
import { CampaignType } from "@/app/types/campaign"

const CampaignPage = async ({
  params,
} : {
  params: Promise<{ id: string }>,
}) => {

  const {id} = await params
  const {data, error}:iResponseOne<CampaignType> = await getCampaign(id)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Campaña</div>
  }

  return (
    <MainContainer>
      <CampaignForm campaign={data}/>
    </MainContainer>
  )
}

export default CampaignPage
