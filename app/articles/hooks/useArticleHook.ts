import { Article } from "@/app/types/articles";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import editArticle from "@/app/actions/data/articles/editArticle";


export default function useArticleHook(){
    
    const router = useRouter();
    console.log('articleHook')
 
    const edit = async (article: Article) : Promise<any> => {
        const {data, error} = await editArticle(article);
        return {data, error};
    }
    
    return {edit}
    
}