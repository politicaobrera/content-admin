import { ArticleWithID } from "@/app/main/components/ArticlesSorter";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import ImageThumb from "../../components/image/ImageThumb";

interface DraggableArticleProps {
  article: ArticleWithID
  idx: number
  showIndex?: boolean
}

function DraggableArticle({ article, idx, showIndex = true }: DraggableArticleProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: article.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="
        relative
        bg-white
        rounded-md
        shadow-md
        text-slate-950
        border-solid
        border-2
        flex
        border-black
        my-1
      "
    >
      {showIndex && (
        <div 
          className={clsx(`
            font-bold
            text-4xl
            w-10
            flex
            flex-shrink-0
            justify-center
            items-center
          `)}
        >
          {idx +1}
        </div>
      )}
      <ImageThumb image={article.image}/>
      <div 
        className="
          font-bold
          text-md
          pl-2
          py-5
          break-words
          overflow-hidden
          w-full
        "
        style={article.section && {backgroundColor: article.section?.style?.backgroundColor ?? 'white', color: article.section?.style?.color ?? 'black'}}
      >
        {article.title}
      </div>
      <div className="absolute bottom-0 right-0 bg-white text-black p-1">
        {article.articleId}
      </div>
    </div>
  );
}

export default DraggableArticle;