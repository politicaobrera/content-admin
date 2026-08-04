import { ResourceType } from "@/app/types/resource"
import createResource from "@/app/actions/data/resources/createResource"
import editResource from "@/app/actions/data/resources/editResource";
import deleteResource from "@/app/actions/data/resources/deleteResource";

export default function useResource(){
    const edit = async (resource: ResourceType) : Promise<any> => {
        const {data, error} = await editResource(resource);
        return {data, error};
    }

    const create = async (resource: ResourceType) : Promise<any> => {
      const {data, error} = await createResource(resource);
      return {data, error};
    }

    const remove = async (id: string) : Promise<any> => {
      const {data, error} = await deleteResource(id);
      return {data, error};
    }

    return {create, edit, remove}
}