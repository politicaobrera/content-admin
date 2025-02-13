import { BannerType, PageType } from "@/app/types/page";
import editPage from "@/app/actions/data/pages/editPage";
import { iResponseOne } from "@/app/types/responses";
import { ArticleType } from "@/app/types/article";

export default function usePortada(){
  const saveArticles = async (articles: ArticleType[], id:string) : Promise<iResponseOne<PageType>> => {
      const {data, error} = await editPage({articles, _id: id});
      return {data, error};
  }

  const saveBanners = async (banners: BannerType[], id:string) : Promise<iResponseOne<PageType>> => {
    console.log("a guardar banners", banners)
    const {data, error} = await editPage({banners, _id: id});
    return {data, error};
}
  
  return {saveArticles, saveBanners}
}