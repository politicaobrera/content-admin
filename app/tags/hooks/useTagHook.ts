import { TagType } from "@/app/types/tag";
import editTag from "@/app/actions/data/tags/editTag";
import createTag from "@/app/actions/data/tags/createTag";

export default function useTagHook(){
    const edit = async (tag: TagType) : Promise<any> => {
        const {data, error} = await editTag(tag);
        return {data, error};
    }

    const create = async (tag: TagType) : Promise<any> => {
      const {data, error} = await createTag(tag);
      return {data, error};
    }

    // const search = async (authorName:string): Promise<any> => {
    //   const {data, error} = await getAuthors({name:authorName});
    //   return {data, error};
    // }
    
    return {edit, create}
}