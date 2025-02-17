'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select from 'react-select'
import { ArticleStatus, ArticleType } from "@/app/types/article";
import Button from '@/app/components/Button';
import { NumericKeyDown } from '@/app/utils/inputs';
import { PaginationMeta } from '@/app/types/responses';
import clsx from 'clsx';
import SectionsContext from '@/app/context/SectionsContext';
import { OptionType } from '@/app/types/select';

interface ArticlesTableProps {
  articles: ArticleType[];
  meta: PaginationMeta | undefined;
}

const ArticlesTable = ({ articles, meta }: ArticlesTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sections } = useContext(SectionsContext)
  const options = sections.map(sec => ({value: sec._id, label: sec.name}))

  // TODO: useTable factor out
  const [filters, setFilters] = useState({
    articleId: searchParams.get('articleId') || '',
    title: searchParams.get('title') || '',
    section: searchParams.get('section') || '',
  });
  const [sort, setSort] = useState({
    field: searchParams.get('sortField') || '',
    order: searchParams.get('sortOrder') || '',
  });

  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page') || String(meta?.page) || '1', 10),
    perPage: parseInt(searchParams.get('perPage') || String(meta?.perPage) || '50', 10)
  });
  const totalPages = Math.ceil(meta?.total || 1 / pagination.perPage);

  // Actualiza los query params al cambiar filtros o sorting

  useEffect(() => {
    handleFilterSubmit()
  }, [sort, pagination, router, searchParams]);

  const handleFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.articleId) params.set('articleId', filters.articleId);
    else params.delete('articleId');

    if (filters.title) params.set('title', filters.title);
    else params.delete('title');

    if (filters.section) params.set('section', filters.section);
    else params.delete('section');

    if (sort.field) params.set('sortField', sort.field);
    else params.delete('sortField');

    if (sort.order) params.set('sortOrder', sort.order);
    else params.delete('sortOrder');

    params.set('page', String(pagination.page || 1));
    params.set('perPage', String(pagination.perPage || 30));

    router.push(`?${params.toString()}`);
  } 

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

  const handleClickEdit = (id: string) => {
    router.push(`/articles/${id}`);
  };

  const handleSectionChange = (val: OptionType|null) => {
    if(val) {
      const selectedSection = sections.find(sec => sec._id === val.value)
      if (selectedSection) {
        setFilters((prev) => ({ ...prev, section: selectedSection._id }));
      }
    }
  }

  return (
    // sacar a componente aparte de filtros
    <div className="space-y-4 w-full">
      <div
        className="
          bg-white
          p-4
          rounded-lg
          shadow
        "
      >
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Filtros</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="articleId"
              onKeyDown={NumericKeyDown}
              placeholder="Filtrar por ID"
              value={filters.articleId}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            />
            <input
              name="title"
              placeholder="Filtrar por título"
              value={filters.title}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            />
            <div>
              <span>Seccion: </span>
              <Select
                options={options}
                defaultValue={null}
                onChange={handleSectionChange}
              />
            </div>
          </div>
          <div className='mt-4 flex justify-end'>
            <Button
              type="button"
              onClick={() => handleFilterSubmit()}
            >
              Filtrar
            </Button>
          </div>
        </div>
      </div>
      <div
        className="
          bg-white
          p-4
          rounded-lg
          shadow
        "
      >
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
           <p className="text-lg text-gray-600 font-medium">No hay artículos para mostrar</p>
           <p className="text-gray-500">Intenta ajustar los filtros o agrega nuevos artículos.</p>
         </div>
        ) : (
          <>
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
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 w-20">Bajada</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Volanta</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article.articleId}
                      className={clsx(`
                        hover:bg-gray-50`,
                        article.status === ArticleStatus.Published && 'border-l-gray-700 border-l-4'
                      )}
                    >
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
                      <td className="px-4 py-2 border-b text-sm text-gray-600">{article.section?.name || "-"}</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-600">{article.subhead}</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-600">{article.volanta}</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-600">
                        <Button
                          type="button"
                          onClick={() => handleClickEdit(article._id)}
                        >
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Paginación */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Artículos por página:</span>
                <select
                  className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-600"
                  value={pagination.perPage}
                  onChange={(e) => setPagination({ perPage: Number(e.target.value), page: 1 })}
                >
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-600 disabled:opacity-50"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-600">
                  Página {pagination.page} de {totalPages}
                </span>
                <button
                  className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-600 disabled:opacity-50"
                  disabled={pagination.page === totalPages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                >
                  Siguiente
                </button>
              </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticlesTable;