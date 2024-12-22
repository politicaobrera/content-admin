import { ArticleType } from "@/app/types/article";
import editArticle from "@/app/actions/data/articles/editArticle";

export default function useArticleHook(){
    const edit = async (article: ArticleType) : Promise<any> => {
        const {data, error} = await editArticle(article);
        return {data, error};
    }
    
    return {edit}
}