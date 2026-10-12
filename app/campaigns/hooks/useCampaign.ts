import { CampaignType } from "@/app/types/campaign";
import editCampaign from "@/app/actions/data/campaigns/editCampaign";
import createCampaign from "@/app/actions/data/campaigns/createCampaign";
import deleteCampaign from "@/app/actions/data/campaigns/deleteCampaign";

export default function useCampaign(){
    const edit = async (campaign: Partial<CampaignType>) : Promise<any> => {
        const {data, error} = await editCampaign(campaign);
        return {data, error};
    }

    const create = async (campaign: Partial<CampaignType>) : Promise<any> => {
      const {data, error} = await createCampaign(campaign);
      return {data, error};
    }

    const remove = async (id: string) : Promise<any> => {
      const {data, error} = await deleteCampaign(id);
      return {data, error};
    }

    return {edit, create, remove}
}
