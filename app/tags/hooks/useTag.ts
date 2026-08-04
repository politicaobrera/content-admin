import { TagType } from "@/app/types/tag";
import editTag from "@/app/actions/data/tags/editTag";
import createTag from "@/app/actions/data/tags/createTag";
import getTags from "@/app/actions/data/tags/getTags";
import deleteTag from "@/app/actions/data/tags/deleteTag";

export default function useTag(){
    const edit = async (tag: TagType) : Promise<any> => {
        const {data, error} = await editTag(tag);
        return {data, error};
    }

    const create = async (tag: TagType) : Promise<any> => {
      const {data, error} = await createTag(tag);
      return {data, error};
    }

    const searchByName = async (tagName:string): Promise<any> => {
      const {data, error} = await getTags({name:tagName});
      return {data, error};
    }

    const remove = async (id: string) : Promise<any> => {
      const {data, error} = await deleteTag(id);
      return {data, error};
    }

    return {edit, create, searchByName, remove}
}