import moment from 'moment';
import { ArticleType, MainImageType } from "@/app/types/article"

interface ArticlePreviewProps {
  article: ArticleType
  mainImage: MainImageType | undefined
}
const ArticlePreview = ({article, mainImage}:ArticlePreviewProps) => {
  const date = moment( moment.utc(article.createdAt)).format('DD/MM/YYYY')
  return (
    <section id="nota-preview">
      <div className="mt-6">
        <span
          className="
            mt-1
            font-semibold
            text-lg
          "
        >
          {article.volanta}
        </span>
        <h1
          className="
            mt-1
            font-bold
            text-4xl
            mb-5
          "
        >
          {article.title}
        </h1>
        <div 
          className="
            mt-1
            font-semibold
            text-sm
          "
        >
          <time dateTime={date}>
            {date}
          </time>
        </div>
        <p
          className="
            mt-5
            font-semibold
            italic
            text-lg
            text-center
            whitespace-pre-wrap
            break-all
          "
        >
          {article.subhead}
        </p>
      </div>

      <img className="w-full h-auto mt-2" src={mainImage?.src}></img>

      <div className="mt-10 text-left">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </section>
  )
}

export default ArticlePreview