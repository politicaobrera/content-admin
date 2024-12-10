'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArticleType } from "@/app/types/articles";
import Button from '@/app/components/Button';

interface ArticlesTableProps {
  articles: ArticleType[];
}

const ArticlesTable = ({ articles }: ArticlesTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    title: searchParams.get('title') || '',
    section: searchParams.get('section') || '',
  });
  const [sort, setSort] = useState({
    field: searchParams.get('sortField') || '',
    order: searchParams.get('sortOrder') || '',
  });

  // Actualiza los query params al cambiar filtros o sorting
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.title) params.set('title', filters.title);
    else params.delete('title');

    if (filters.section) params.set('section', filters.section);
    else params.delete('section');

    if (sort.field) params.set('sortField', sort.field);
    else params.delete('sortField');

    if (sort.order) params.set('sortOrder', sort.order);
    else params.delete('sortOrder');

    router.push(`?${params.toString()}`);
  }, [filters, sort, router, searchParams]);

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id: string) => {
    router.push(`/articles/${id}`);
  };

  return (
    // sacar a componente aparte de filtros
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Filtros</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="title"
            placeholder="Filtrar por título"
            value={filters.title}
            onChange={handleFilterChange}
            className="p-2 border rounded w-full"
          />
          <input
            name="section"
            placeholder="Filtrar por sección"
            value={filters.section}
            onChange={handleFilterChange}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort('articleId')}
              >
                ID {sort.field === 'articleId' && (sort.order === 'asc' ? '⬆️' : '⬇️')}
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Imagen</th>
              <th
                className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Título {sort.field === 'title' && (sort.order === 'asc' ? '⬆️' : '⬇️')}
              </th>
              <th
                className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer"
                onClick={() => handleSort('section')}
              >
                Sección {sort.field === 'section' && (sort.order === 'asc' ? '⬆️' : '⬇️')}
              </th>
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
                  {article.image?.src ? (
                    <img
                      src={article.image?.src}
                      alt={article.title}
                      className="h-auto w-24 object-cover rounded shadow-md"
                    />
                  ) :  (
                    <div className="flex items-center justify-center h-auto w-24 rounded bg-gray-200 shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-8 w-8 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  )}
                </td>
                <td className="px-4 py-2 border-b text-sm text-gray-600">{article.title}</td>
                <td className="px-4 py-2 border-b text-sm text-gray-600">{article.section}</td>
                <td className="px-4 py-2 border-b text-sm text-gray-600">{article.subhead}</td>
                <td className="px-4 py-2 border-b text-sm text-gray-600">{article.volanta}</td>
                <td className="px-4 py-2 border-b text-sm text-gray-600">
                  <Button
                    type="button"
                    onClick={() => handleEdit(article._id)}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticlesTable;