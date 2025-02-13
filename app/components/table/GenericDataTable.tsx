import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Button from '@/app/components/Button'
import { PaginationMeta } from '@/app/types/responses'

interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
}

interface GenericDataTableProps<T> {
  data: T[]
  meta?: PaginationMeta
  columns: Column<T>[]
  entityPath: string
}

const GenericDataTable = <T extends { _id: string }>({ data, meta, columns, entityPath }: GenericDataTableProps<T>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<Record<string, string>>(
    Object.fromEntries(columns.map(col => [col.key as string, searchParams.get(col.key as string) || '']))
  );
  const [sort, setSort] = useState({
    field: searchParams.get('sortField') || '',
    order: searchParams.get('sortOrder') || '',
  });
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page') || String(meta?.page) || '1', 10),
    perPage: parseInt(searchParams.get('perPage') || String(meta?.perPage) || '50', 10)
  });
  const totalPages = Math.ceil((meta?.total || 1) / pagination.perPage);

  useEffect(() => {
    handleFilterSubmit();
  }, [sort, pagination, router, searchParams]);

  const handleFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      value ? params.set(key, value) : params.delete(key);
    });

    if (sort.field) params.set('sortField', sort.field);
    else params.delete('sortField');

    if (sort.order) params.set('sortOrder', sort.order);
    else params.delete('sortOrder');

    params.set('page', String(pagination.page || 1));
    params.set('perPage', String(pagination.perPage || 30));
    
    router.push(`?${params.toString()}`);
  };

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClickEdit = (id: string) => {
    router.push(`/${entityPath}/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Filtros</h2>
        <div className="grid grid-cols-2 gap-4">
          {columns.map(col => (
            <input
              key={col.key as string}
              name={col.key as string}
              placeholder={`Filtrar por ${col.label}`}
              value={filters[col.key as string]}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            />
          ))}
        </div>
        <div className='mt-4'>
          <Button type="button" onClick={handleFilterSubmit}>Filtrar</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md">
          <thead className="bg-gray-100">
            <tr>
              {columns.map(col => (
                <th key={col.key as string} className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => col.sortable && handleSort(col.key as string)}>
                  {col.label} {sort.field === col.key && (sort.order === 'asc' ? '⬆️' : '⬇️')}
                </th>
              ))}
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item._id} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col.key as string} className="px-4 py-2 border-b text-sm text-gray-600">{String(item[col.key]) || '-'}</td>
                ))}
                <td className="px-4 py-2 border-b text-sm text-gray-600">
                  <Button type="button" onClick={() => handleClickEdit(item._id)}>Editar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Registros por página:</span>
          <select className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-600" value={pagination.perPage} onChange={(e) => setPagination({ perPage: Number(e.target.value), page: 1 })}>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-600 disabled:opacity-50" disabled={pagination.page === 1} onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}>Anterior</button>
          <span className="text-sm text-gray-600">Página {pagination.page} de {totalPages}</span>
          <button className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-600 disabled:opacity-50" disabled={pagination.page === totalPages} onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}>Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default GenericDataTable;
