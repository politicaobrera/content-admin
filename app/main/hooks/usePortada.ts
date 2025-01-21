import { PageType } from "@/app/types/page";
import editPage from "@/app/actions/data/pages/editPage";
import { iResponseOne } from "@/app/types/Responses";
import { ArticleType } from "@/app/types/article";

export default function usePortada(){
  // TODO: edit any must be of type of response
  const saveArticles = async (articles: ArticleType[], id:string) : Promise<iResponseOne<PageType>> => {
      const {data, error} = await editPage({articles, _id: id});
      return {data, error};
  }
  
  return {saveArticles}
}