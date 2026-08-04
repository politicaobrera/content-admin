'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "react-hot-toast"
import { PublicationType } from '@/app/types/publication';
import Button from '@/app/components/Button';
import { PaginationMeta } from '@/app/types/responses';
import usePublication from '../hooks/usePublication';

interface PublicationTableProps {
  publications: PublicationType[];
  meta: PaginationMeta | undefined;
}

const PublicationTable = ({ publications, meta }: PublicationTableProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {remove} = usePublication()

  const [filters, setFilters] = useState({
    name: searchParams.get('name') || '',
  })
  const [sort, setSort] = useState({
    field: searchParams.get('sortField') || '',
    order: searchParams.get('sortOrder') || '',
  })

  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page') || String(meta?.page) || '1', 10),
    perPage: parseInt(searchParams.get('perPage') || String(meta?.perPage) || '30', 10)
  })

  const totalPages = Math.ceil(meta?.totalPages || 1 / pagination.perPage)

  useEffect(() => {
    handleFilterSubmit()
  }, [sort, pagination, router, searchParams])

  const handleFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (filters.name) params.set('name', filters.name)
    else params.delete('name')

    if (sort.field) params.set('sortField', sort.field)
    else params.delete('sortField')

    if (sort.order) params.set('sortOrder', sort.order)
    else params.delete('sortOrder')

    params.set('page', String(pagination.page || 1))
    params.set('perPage', String(pagination.perPage || 30))

    const newQuery = params.toString()
    if (newQuery !== searchParams.toString()) {
      router.push(`?${newQuery}`)
    }
  }

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleClickEdit = (id: string) => {
    router.push(`/publicaciones/${id}`)
  };

  const handleClickNumeros = (id: string) => {
    router.push(`/publicaciones/${id}/numeros`)
  };

  const handleClickNew = () => {
    router.push(`/publicaciones/new`)
  }

  const handleClickDelete = async (publication: PublicationType) => {
    if (!window.confirm(`¿Eliminar la publicación "${publication.name}"? Esta acción no se puede deshacer.`)) {
      return
    }
    const result = await remove(publication._id)
    if (result.error) {
      toast.error(result.error.message)
    }
    if (result.data) {
      toast.success("Publicación eliminada correctamente")
      router.refresh()
    }
  }

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
            NUEVA PUBLICACIÓN
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
        {publications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-600 font-medium">No hay publicaciones para mostrar</p>
            <p className="text-gray-500">Intenta ajustar los filtros o agrega nuevas publicaciones.</p>
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
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Logo</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {publications.map((publication) => (
                    <tr key={publication._id} className="hover:bg-gray-50 border-b">
                      <td className="px-4 py-2 text-sm text-gray-600">{publication.name}</td>
                      <td className="px-4 py-2 border-b">
                        {publication.logoUrl ? (
                          <img
                            src={publication.logoUrl}
                            alt={publication.name}
                            className="h-auto w-24 object-cover rounded shadow-md"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-16 w-24 rounded bg-gray-200 shadow-md text-xs text-gray-400">
                            Sin logo
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 w-64">
                        <div className='flex gap-2'>
                          <Button
                            type="button"
                            onClick={() => handleClickNumeros(publication._id)}
                          >
                            Números
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleClickEdit(publication._id)}
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            danger
                            onClick={() => handleClickDelete(publication)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Publicaciones por página:</span>
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

export default PublicationTable;
