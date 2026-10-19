'use client';

import { Fragment, useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "react-hot-toast"
import { ArticleStatus, ArticleType } from "@/app/types/article";
import Button from '@/app/components/Button';
import { PaginationMeta } from '@/app/types/responses';
import clsx from 'clsx';
import SectionsContext from '@/app/context/SectionsContext';
import useArticle from '../hooks/useArticle';
import useAuthor from '@/app/authors/hooks/useAuthor';
import useTag from '@/app/tags/hooks/useTag';
import { hasPendingChangesSincePublish } from '@/app/utils/articles';
import { getArticleChangesSincePublish } from '@/app/utils/articleChanges';
import FilterBar, { FilterField } from '@/app/components/table/FilterBar';
import { OptionType } from '@/app/types/select';

interface ArticlesTableProps {
  articles: ArticleType[];
  meta: PaginationMeta | undefined;
}

const ArticlesTable = ({ articles, meta }: ArticlesTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sections } = useContext(SectionsContext)
  const {remove} = useArticle();
  const {search: searchAuthors} = useAuthor();
  const {searchByName: searchTags} = useTag();
  const sectionOptions = sections.map(sec => ({value: sec._id, label: sec.name}))
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  // TODO: useTable factor out
  const [filters, setFilters] = useState<Record<string, any>>({
    articleId: searchParams.get('articleId') || '',
    title: searchParams.get('title') || '',
    section: searchParams.get('section') || '',
    tags: searchParams.getAll('tags'),
    authors: searchParams.getAll('authors'),
    changedSincePublish: searchParams.get('changedSincePublish') === 'true',
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

  // debounce para no navegar en cada tecla tipeada
  useEffect(() => {
    const timeout = setTimeout(() => handleFilterSubmit(), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, pagination]);

  const handleFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete('articleId');
    if (filters.articleId) params.set('articleId', filters.articleId);

    if (filters.title) params.set('title', filters.title);
    else params.delete('title');

    if (filters.section) params.set('section', filters.section);
    else params.delete('section');

    params.delete('tags');
    (filters.tags || []).forEach((id: string) => params.append('tags', id));

    params.delete('authors');
    (filters.authors || []).forEach((id: string) => params.append('authors', id));

    if (filters.changedSincePublish) params.set('changedSincePublish', 'true');
    else params.delete('changedSincePublish');

    if (sort.field) params.set('sortField', sort.field);
    else params.delete('sortField');

    if (sort.order) params.set('sortOrder', sort.order);
    else params.delete('sortOrder');

    params.set('page', String(pagination.page || 1));
    params.set('perPage', String(pagination.perPage || 30));

    const newQuery = params.toString();
    if (newQuery !== searchParams.toString()) {
      router.push(`?${newQuery}`);
    }
  }

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (name: string, value: any) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilters({
      articleId: '',
      title: '',
      section: '',
      tags: [],
      authors: [],
      changedSincePublish: false,
    });
  };

  const handleClickEdit = (id: string) => {
    router.push(`/articles/${id}`);
  };

  const handleClickDelete = async (article: ArticleType) => {
    if (!window.confirm(`¿Eliminar el artículo "${article.title}"? Esta acción no se puede deshacer.`)) {
      return
    }
    const result = await remove(article._id)
    if (result.error) {
      toast.error(result.error.message)
    }
    if (result.data) {
      toast.success("Artículo eliminado correctamente")
      router.refresh()
    }
  }

  const filterFields: FilterField[] = [
    { type: 'text', name: 'articleId', label: 'ID', placeholder: 'Filtrar por ID', numeric: true },
    { type: 'text', name: 'title', label: 'Título', placeholder: 'Filtrar por título' },
    { type: 'select', name: 'section', label: 'Sección', options: sectionOptions, placeholder: 'Todas las secciones' },
    {
      type: 'asyncMultiSelect',
      name: 'tags',
      label: 'Tags',
      placeholder: 'Buscar tags...',
      loadOptions: async (query: string): Promise<OptionType[]> => {
        if (query.length < 2) return []
        const { data } = await searchTags(query)
        return (data || []).map((tag: any) => ({ value: tag._id, label: tag.name }))
      },
    },
    {
      type: 'asyncMultiSelect',
      name: 'authors',
      label: 'Autores',
      placeholder: 'Buscar autores...',
      loadOptions: async (query: string): Promise<OptionType[]> => {
        if (query.length < 2) return []
        const { data } = await searchAuthors(query)
        return (data || []).map((author: any) => ({ value: author._id, label: author.name }))
      },
    },
  ];

  return (
    <div className="space-y-4 w-full">
      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        extra={
          <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={filters.changedSincePublish}
              onChange={(e) => handleFilterChange('changedSincePublish', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            Publicadas con cambios pendientes (últimos 7 días)
          </label>
        }
      />
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
                  {articles.map((article) => {
                    const pendingChanges = hasPendingChangesSincePublish(article);
                    const changes = pendingChanges ? getArticleChangesSincePublish(article) : null;
                    const isExpanded = expandedArticleId === article._id;
                    return (
                    <Fragment key={article.articleId}>
                    <tr
                      className={clsx(`
                        hover:bg-gray-50`,
                        article.status === ArticleStatus.Published && 'border-l-gray-700 border-l-4',
                        pendingChanges && 'bg-yellow-50 border-l-yellow-500'
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
                      <td className="px-4 py-2 border-b text-sm text-gray-600">
                        {article.title}
                        {pendingChanges && (
                          <button
                            type="button"
                            className="ml-2 rounded bg-yellow-500 px-2 py-0.5 text-xs font-semibold text-white"
                            onClick={() => setExpandedArticleId(isExpanded ? null : article._id)}
                          >
                            Cambios sin publicar {isExpanded ? '▲' : '▼'}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-2 border-b text-sm text-gray-600">{article.section?.name || "-"}</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-600">{article.subhead}</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-600">{article.volanta}</td>
                      <td className="px-4 py-2 border-b text-sm text-gray-600 w-40">
                        <div className='flex gap-2'>
                          <Button
                            type="button"
                            onClick={() => handleClickEdit(article._id)}
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            danger
                            onClick={() => handleClickDelete(article)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && changes && (
                      <tr key={`${article.articleId}-changes`} className="bg-yellow-50">
                        <td colSpan={7} className="px-4 py-3 border-b text-sm text-gray-700">
                          <p className="font-semibold mb-1">
                            Cambios desde la última publicación
                            {article.lastModifiedBy && ` (por ${article.lastModifiedBy})`}:
                          </p>
                          {changes.fieldChanges.length === 0 && !changes.contentChanged && (
                            <p>Sin cambios detectados en los campos comparados.</p>
                          )}
                          <ul className="list-disc list-inside">
                            {changes.fieldChanges.map((change) => (
                              <li key={change.field}>
                                <span className="font-medium">{change.label}:</span> &quot;{change.from}&quot; → &quot;{change.to}&quot;
                              </li>
                            ))}
                            {changes.contentChanged && (
                              <li><span className="font-medium">Contenido:</span> cambió</li>
                            )}
                          </ul>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                    );
                  })}
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
