'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TagType } from '@/app/types/tag';
import Button from '@/app/components/Button';
import { PaginationMeta } from '@/app/types/responses';

interface TagTableProps {
  tags: TagType[];
  meta: PaginationMeta | undefined;
}

const TagTable = ({ tags, meta }: TagTableProps) => {
  console.log("tags", tags)
  const router = useRouter();
  const searchParams = useSearchParams();

  // TODO: useTable factor out
  const [filters, setFilters] = useState({
    name: searchParams.get('name') || '',
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

  // Actualiza los query params al cambiar filtros o sorting
  useEffect(() => {
    handleFilterSubmit()
  }, [sort, pagination, router, searchParams]);
  
  const handleFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.name) params.set('name', filters.name);
    else params.delete('name');

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
    router.push(`/tags/${id}`);
  };

  const handleClickNew = () => {
    router.push(`/tags/new`);
  }

  return (
    
    // TODO: sacar a componente aparte de filtros
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
            NUEVO TAG
          </Button>
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
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Filtros</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Filtrar por nombre"
              value={filters.name}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            />
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
        {tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
           <p className="text-lg text-gray-600 font-medium">No hay tags para mostrar</p>
           <p className="text-gray-500">Intenta ajustar los filtros o agrega nuevos tags.</p>
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
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag) => (
                    //TODO: sacar a componente?
                    <tr key={tag._id} className="hover:bg-gray-50 border-b">
                      <td className="px-4 py-2 text-sm text-gray-600">{tag.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600 w-20">
                        <Button
                          type="button"
                          onClick={() => handleClickEdit(tag._id)}
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
                <span className="text-sm text-gray-600">Tags por página:</span>
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

export default TagTable;