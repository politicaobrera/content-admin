import { ArticleType } from "@/app/types/article";
import editArticle from "@/app/actions/data/articles/editArticle";
import { iResponseOne } from "@/app/types/Responses";

export default function useArticle(){
    const edit = async (article: Partial<ArticleType>) : Promise<iResponseOne<ArticleType>> => {
        const {data, error} = await editArticle(article);
        return {data, error};
    }
    
    return {edit}
}