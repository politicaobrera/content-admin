import moment from 'moment';
import { ArticleType } from "@/app/types/article"
import { MainImageType } from '@/app/types/image';
import AuthorsList from './AuthorList';
import TagList from '@/app/components/tags/TagList';

interface ArticlePreviewProps {
  article: ArticleType
  mainImage: MainImageType | undefined
}
const ArticlePreview = ({article, mainImage}:ArticlePreviewProps) => {
  const date = moment( moment.utc(article.createdAt)).format('DD/MM/YYYY')
  return (
    <section id="nota-preview" className='max-w-6xl flex flex-col xl:max-w-screen-2xl md:w-[70%] text-center mx-auto'>
      <div className="mt-6 flex flex-col gap-2 items-center">
        {
          article.section && (
            <div
              style={{
                backgroundColor: article.section.style.backgroundColor,
                color: article.section.style.color || '#000',
              }}
              className='w-fit p-1 rounded-md'
            >
              <span>{article.section.name}</span>
            </div>
          )
        }
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
        <AuthorsList authors={article.authors} descriptions={article.authorsDescriptions}/>
      </div>

      <img className="w-full h-auto mt-2" src={mainImage?.src}></img>

      <div className="mt-10 text-left overflow-hidden break-all">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
      <div className='mt-5'>
        <TagList
          tags={article.tags}
        />
      </div>
    </section>
  )
}

export default ArticlePreview