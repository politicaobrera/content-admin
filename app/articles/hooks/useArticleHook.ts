import { ArticleType } from "@/app/types/articles";
import { useRouter } from "next/navigation";
import editArticle from "@/app/actions/data/articles/editArticle";

export default function useArticleHook(){
    const router = useRouter();
    console.log('articleHook')
 
    const edit = async (article: ArticleType) : Promise<any> => {
        const {data, error} = await editArticle(article);
        return {data, error};
    }
    
    return {edit}
}