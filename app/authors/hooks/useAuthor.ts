import { AuthorType } from "@/app/types/author";
import editAuthor from "@/app/actions/data/authors/editAuthor";
import createAuthor from "@/app/actions/data/authors/createAuthor";
import getAuthors from "@/app/actions/data/authors/getAuthors";

export default function useAuthor(){
    const edit = async (author: AuthorType) : Promise<any> => {
        const {data, error} = await editAuthor(author);
        return {data, error};
    }

    const create = async (author: AuthorType) : Promise<any> => {
      const {data, error} = await createAuthor(author);
      return {data, error};
    }

    const search = async (authorName:string): Promise<any> => {
      const {data, error} = await getAuthors({name:authorName});
      return {data, error};
    }
    
    return {edit, create, search}
}