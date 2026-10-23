import { BannerType, PageType, Video } from "@/app/types/sitepage";
import editPage from "@/app/actions/data/pages/editPage";
import { iResponseOne } from "@/app/types/responses";
import { ArticleType } from "@/app/types/article";
import { EventType } from "@/app/types/event";
import { IssueType } from "@/app/types/issue";
import { LayoutInstance } from "../layoutCatalog";

export default function usePortada(){
  const saveArticles = async (articles: Partial<ArticleType>[], id:string) : Promise<iResponseOne<PageType>> => {
      const {data, error} = await editPage({articles, _id: id});
      return {data, error};
  }

  const saveFeaturedEvents = async (featuredEvents: Partial<EventType>[], id:string) : Promise<iResponseOne<PageType>> => {
    const {data, error} = await editPage({featuredEvents, _id: id});
    return {data, error};
  }

  const saveFeaturedIssues = async (featuredIssues: Partial<IssueType>[], id:string) : Promise<iResponseOne<PageType>> => {
    const {data, error} = await editPage({featuredIssues, _id: id});
    return {data, error};
  }

  const saveBanners = async (banners: BannerType[], id:string) : Promise<iResponseOne<PageType>> => {
    console.log("a guardar banners", banners)
    const {data, error} = await editPage({banners, _id: id});
    return {data, error};
  }

  const saveVideos = async (videos: Video[], id:string) : Promise<iResponseOne<PageType>> => {
    console.log("a guardar videos", videos)
    const {data, error} = await editPage({videos, _id: id});
    return {data, error};
  }

  const saveLayouts = async (layouts: LayoutInstance[], id:string) : Promise<iResponseOne<PageType>> => {
    const {data, error} = await editPage({layouts, _id: id});
    return {data, error};
  }

  return {saveArticles, saveBanners, saveVideos, saveLayouts, saveFeaturedEvents, saveFeaturedIssues}
}