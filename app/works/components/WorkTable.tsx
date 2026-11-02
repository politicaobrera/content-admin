'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WorkType } from '@/app/types/work';
import Button from '@/app/components/Button';
import { PaginationMeta } from '@/app/types/responses';
import FilterBar, { FilterField } from '@/app/components/table/FilterBar';

interface WorkTableProps {
  works: WorkType[];
  meta: PaginationMeta | undefined;
}

// Read-only por ahora: las obras se crean/actualizan vía el scraper
// (content-server/scripts/import-marxists-works.ts), no desde el CMS todavía --
// acá solo se listan y se puede ver el detalle de cada una.
const WorkTable = ({ works, meta }: WorkTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Record<string, any>>({
    title: searchParams.get('title') || '',
  });
  const [sort, setSort] = useState({
    field: searchParams.get('sortField') || '',
    order: searchParams.get('sortOrder') || '',
  });

  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page') || String(meta?.page) || '1', 10),
    perPage: parseInt(searchParams.get('perPage') || String(meta?.perPage) || '30', 10)
  });

  const totalPages = Math.ceil(meta?.totalPages || 1 / pagination.perPage);

  // debounce para no navegar en cada tecla tipeada
  useEffect(() => {
    const timeout = setTimeout(() => handleFilterSubmit(), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, pagination]);

  const handleFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.title) params.set('title', filters.title);
    else params.delete('title');

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
    setFilters({ title: '' });
  };

  const handleClickView = (id: string) => {
    router.push(`/works/${id}`);
  };

  const filterFields: FilterField[] = [
    { type: 'text', name: 'title', label: 'Título', placeholder: 'Filtrar por título' },
  ];

  return (
    <div className="space-y-4 w-full">
      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />
      <div
        className="
          bg-white
          p-4
          rounded-lg
          shadow
        "
      >
        {works.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-600 font-medium">No hay obras para mostrar</p>
            <p className="text-gray-500">
              Las obras se importan con el scraper de content-server (ver scripts/import-marxists-works.ts).
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort('title')}
                    >
                      Título {sort.field === 'title' && (sort.order === 'asc' ? '⬆️' : '⬇️')}
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Autor(es)</th>
                    <th
                      className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort('year')}
                    >
                      Año {sort.field === 'year' && (sort.order === 'asc' ? '⬆️' : '⬇️')}
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Capítulos</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {works.map((work) => (
                    <tr key={work._id} className="hover:bg-gray-50 border-b">
                      <td className="px-4 py-2 text-sm text-gray-600">{work.title}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{work.authors?.map((author) => author.name).join(" y ")}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{work.year}</td>
                      <td className="px-4 py-2 text-sm text-gray-600 capitalize">{work.kind}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{work.chapters?.length ?? 0}</td>
                      <td className="px-4 py-2 text-sm text-gray-600 w-32">
                        <Button
                          type="button"
                          onClick={() => handleClickView(work._id)}
                        >
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Obras por página:</span>
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

export default WorkTable;
