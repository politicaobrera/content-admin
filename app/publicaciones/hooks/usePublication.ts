import { PublicationType } from "@/app/types/publication"
import createPublication from "@/app/actions/data/publications/createPublication"
import editPublication from "@/app/actions/data/publications/editPublication"
import deletePublication from "@/app/actions/data/publications/deletePublication"

export default function usePublication(){
    const edit = async (publication: Partial<PublicationType>) : Promise<any> => {
        const {data, error} = await editPublication(publication);
        return {data, error};
    }

    const create = async (publication: Partial<PublicationType>) : Promise<any> => {
      const {data, error} = await createPublication(publication);
      return {data, error};
    }

    const remove = async (id: string) : Promise<any> => {
      const {data, error} = await deletePublication(id);
      return {data, error};
    }

    return {create, edit, remove}
}
