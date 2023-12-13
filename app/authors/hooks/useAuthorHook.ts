import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Author } from "../types/authors";
import createAuthor from "@/app/actions/data/authors/createAuthor";
import editAuthor from "@/app/actions/data/authors/editAuthor";


export default function useAuthorHook(){
    
    const router = useRouter();
    const create = async (data: Author) : Promise<any> =>  {
        //console.log(data);
        const result = await createAuthor(data);
        if (result?.error) {
            toast.error(result.error.message)
          }
          else{
            toast.success("Autor creado")
            router.push('/authors')
            router.refresh()
          }

          return result;
    }
    
    const edit = async (id:string, data: Author) : Promise<any> => {
    const result = await editAuthor(id, data);
        if (result?.error) {
            toast.error(result.error.message)
          }
          else{
            toast.success("Autor editado")
            //router.push('/sections')
            router.refresh()
          }

          return;
    }
    
    
    return {create, edit}
    
}