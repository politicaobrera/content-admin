import getCampaigns from "@/app/actions/data/campaigns/getCampaigns"
import { iResponseMany } from "@/app/types/responses"
import { CampaignType } from "@/app/types/campaign"
import ErrorMessage from "@/app/components/ErrorMessage"
import CampaignTable from "./CampaignTable"
import { Params } from "@/app/types/requests"

interface CampaignsProps {
  searchParams: Params;
}

const Campaigns: React.FC<CampaignsProps> = async ({ searchParams }) => {
  const { data, error, meta }: iResponseMany<CampaignType> = await getCampaigns(searchParams)
  if (error) {
    return <ErrorMessage error={error} />
  }

  if (!data) {
    return (<div>No hay data</div>)
  }

  return (
    <div
      className="
        h-screen
      "
    >
      <CampaignTable
        campaigns={data}
        meta={meta}
      />
    </div>
  )
}

export default Campaigns
