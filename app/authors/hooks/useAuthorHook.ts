import { AuthorType } from "@/app/types/author";
import editAuthor from "@/app/actions/data/authors/editAuthor";
import createAuthor from "@/app/actions/data/authors/createAuthor";

export default function useAuthorHook(){
    const edit = async (author: AuthorType) : Promise<any> => {
        const {data, error} = await editAuthor(author);
        return {data, error};
    }

    const create = async (author: AuthorType) : Promise<any> => {
      const {data, error} = await createAuthor(author);
      return {data, error};
    }
    
    return {edit, create}
}