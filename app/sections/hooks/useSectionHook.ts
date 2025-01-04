import { SubmitHandler } from "react-hook-form";
import { Section } from "../../types/sections";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import createSection from "@/app/actions/data/sections/createSection";
import editSection from "@/app/actions/data/sections/editSection";


export default function useSectionHook(){
    
    const router = useRouter();
    console.log('sectionHook')
    const create = async (data: Section) : Promise<any> =>  {
        console.log(data);
        const result = await createSection(data);
        if (result?.error) {
            toast.error(result.error.message)
          }
          else{
            toast.success("Seccion creada")
            router.push('/sections')
            router.refresh()
          }

          return result;
    }
    
    const edit = async (id:string, data: Section) : Promise<any> => {
    const result = await editSection(id, data);
        if (result?.error) {
            toast.error(result.error.message)
          }
          else{
            toast.success("Seccion editada")
            //router.push('/sections')
            router.refresh()
          }

          return;
    }
    
    
    return {create, edit}
    
}