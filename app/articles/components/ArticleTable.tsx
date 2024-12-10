'use client'

import { ArticleType } from "@/app/types/articles";
import { useRouter } from "next/navigation";

interface ArticlesTableProps {
  articles: ArticleType[]
}

const ArticlesTable = ({articles}:ArticlesTableProps) => {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/articles/${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Imagen</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Título</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Sección</th>
            {/* <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Autores</th> */}
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Subhead</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Volanta</th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.articleId} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-sm text-gray-600">{article.articleId}</td>
              <td className="px-4 py-2 border-b">
                <img
                  src={article.image?.src}
                  alt={article.title}
                  className="h-12 w-12 rounded object-cover shadow-md"
                />
              </td>
              <td className="px-4 py-2 border-b text-sm text-gray-600">{article.title}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-600">{article.section}</td>
              {/* <td className="px-4 py-2 border-b text-sm text-gray-600">
                {article.authors.join(', ')}
              </td> */}
              <td className="px-4 py-2 border-b text-sm text-gray-600">{article.subhead}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-600">{article.volanta}</td>
              <td className="px-4 py-2 border-b text-sm text-gray-600">
                <button 
                  className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                  onClick={() => handleEdit(article._id)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticlesTable;