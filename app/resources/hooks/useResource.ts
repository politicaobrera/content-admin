import { ResourceType } from "@/app/types/resource"
import createResource from "@/app/actions/data/resources/createResource"

export default function useResource(){
    // const edit = async (tag: TagType) : Promise<any> => {
    //     const {data, error} = await editTag(tag);
    //     return {data, error};
    // }

    const create = async (resource: ResourceType) : Promise<any> => {
      const {data, error} = await createResource(resource);
      return {data, error};
    }
    
    return {create}
}