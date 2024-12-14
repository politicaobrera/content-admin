import { ArticleType, MainImageType } from "@/app/types/articles"

interface ArticlePreviewProps {
  article: ArticleType
  mainImage: MainImageType | undefined
}
const ArticlePreview = ({article, mainImage}:ArticlePreviewProps) => {
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
          "
        >
          {article.title}
        </h1>
        <p
          className="
            mt-1
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

      <img className="w-full h-auto" src={mainImage?.src}></img>

      <div className="mt-3">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </section>
  )
}

export default ArticlePreview