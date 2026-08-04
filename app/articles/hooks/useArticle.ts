import { ArticleType } from "@/app/types/article";
import editArticle from "@/app/actions/data/articles/editArticle";
import deleteArticle from "@/app/actions/data/articles/deleteArticle";
import { iResponseOne } from "@/app/types/responses";

export default function useArticle(){
    const edit = async (article: Partial<ArticleType>) : Promise<iResponseOne<ArticleType>> => {
        const {data, error} = await editArticle(article);
        return {data, error};
    }

    const remove = async (id: string) : Promise<iResponseOne<ArticleType>> => {
        const {data, error} = await deleteArticle(id);
        return {data, error};
    }

    return {edit, remove}
}