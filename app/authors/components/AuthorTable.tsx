'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthorType } from '@/app/types/author';
import Button from '@/app/components/Button';
import { PaginationMeta } from '@/app/types/responses';
import FilterBar, { FilterField } from '@/app/components/table/FilterBar';

interface AuthorTableProps {
  authors: AuthorType[];
  meta: PaginationMeta | undefined;
}

const AuthorTable = ({ authors, meta }: AuthorTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // TODO: useTable factor out
  const [filters, setFilters] = useState<Record<string, any>>({
    name: searchParams.get('name') || '',
    description: searchParams.get('description') || '',
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

  // Actualiza los query params al cambiar filtros o sorting, con debounce para los
  // campos de texto libre (no disparar una navegación por tecla tipeada)
  useEffect(() => {
    const timeout = setTimeout(() => handleFilterSubmit(), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, pagination]);
  
  const handleFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.name) params.set('name', filters.name);
    else params.delete('name');

    if (filters.description) params.set('description', filters.description);
    else params.delete('description');

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
    setFilters({ name: '', description: '' });
  };

  const handleClickEdit = (id: string) => {
    router.push(`/authors/${id}`);
  };

  const handleClickNew = () => {
    router.push(`/authors/new`);
  }

  const filterFields: FilterField[] = [
    { type: 'text', name: 'name', label: 'Nombre', placeholder: 'Filtrar por nombre' },
    { type: 'text', name: 'description', label: 'Descripción', placeholder: 'Filtrar por descripción' },
  ];

  return (
    <div className="space-y-4 w-full">
      <div
        className="
          mt-8
          mx-auto
          max-w-md
        "
      >
        <div
          className="
            bg-white
            p-4
            rounded-lg
            shadow
          "
        >
          <Button
            type="button"
            fullWidth
            onClick={handleClickNew}
          >
            NUEVO AUTOR
          </Button>
        </div>
      </div>
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
        {authors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
           <p className="text-lg text-gray-600 font-medium">No hay autores para mostrar</p>
           <p className="text-gray-500">Intenta ajustar los filtros o agrega nuevos autores.</p>
         </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Nombre {sort.field === 'name' && (sort.order === 'asc' ? '⬆️' : '⬇️')}
                    </th>
                    <th
                      className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    >
                      Descripción
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((author) => (
                    //TODO: sacar a componente?
                    <tr key={author._id} className="hover:bg-gray-50 border-b">
                      <td className="px-4 py-2 text-sm text-gray-600">{author.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {author.descriptions.length > 0 && author.descriptions.map((description, idx) => (
                          <div key={`${author._id}-${idx}`}>
                            {description}
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 w-20">
                        <Button
                          type="button"
                          onClick={() => handleClickEdit(author._id)}
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
                <span className="text-sm text-gray-600">Autores por página:</span>
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

export default AuthorTable;