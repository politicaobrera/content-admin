'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "react-hot-toast"
import { CampaignType } from '@/app/types/campaign';
import Button from '@/app/components/Button';
import { PaginationMeta } from '@/app/types/responses';
import useCampaign from '../hooks/useCampaign';

interface CampaignTableProps {
  campaigns: CampaignType[];
  meta: PaginationMeta | undefined;
}

const CampaignTable = ({ campaigns, meta }: CampaignTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { remove } = useCampaign();

  const [filters, setFilters] = useState({
    title: searchParams.get('title') || '',
    status: searchParams.get('status') || '',
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

  useEffect(() => {
    handleFilterSubmit()
  }, [sort, pagination, router, searchParams]);

  const handleFilterSubmit = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (filters.title) params.set('title', filters.title);
    else params.delete('title');

    if (filters.status) params.set('status', filters.status);
    else params.delete('status');

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

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickEdit = (id: string) => {
    router.push(`/campaigns/${id}`);
  };

  const handleClickNew = () => {
    router.push(`/campaigns/new`);
  }

  const handleClickDelete = async (campaign: CampaignType) => {
    if (!window.confirm(`¿Eliminar la campaña "${campaign.title}"? Esta acción no se puede deshacer.`)) {
      return
    }
    const result = await remove(campaign._id)
    if (result.error) {
      toast.error(result.error.message)
    }
    if (result.data) {
      toast.success("Campaña eliminada correctamente")
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
            NUEVA CAMPAÑA
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
              name="title"
              placeholder="Filtrar por título"
              value={filters.title}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="p-2 border rounded w-full"
            >
              <option value="">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="published">Publicada</option>
            </select>
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
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
           <p className="text-lg text-gray-600 font-medium">No hay campañas para mostrar</p>
           <p className="text-gray-500">Intenta ajustar los filtros o agrega nuevas campañas.</p>
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
                    <th
                      className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Estado {sort.field === 'status' && (sort.order === 'asc' ? '⬆️' : '⬇️')}
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Actividad</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Vinculados</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => {
                    const linkedCount = (campaign.relatedArticles?.length || 0)
                      + (campaign.relatedResources?.length || 0)
                      + (campaign.relatedEvents?.length || 0)
                    return (
                      <tr key={campaign._id} className="hover:bg-gray-50 border-b">
                        <td className="px-4 py-2 text-sm text-gray-600">{campaign.title}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {campaign.status === 'published' ? 'Publicada' : 'Borrador'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {campaign.status === 'published' ? (campaign.isActive ? 'Activa' : 'Finalizada') : '—'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{linkedCount}</td>
                        <td className="px-4 py-2 text-sm text-gray-600 w-40">
                          <div className='flex gap-2'>
                            <Button
                              type="button"
                              onClick={() => handleClickEdit(campaign._id)}
                            >
                              Editar
                            </Button>
                            <Button
                              type="button"
                              danger
                              onClick={() => handleClickDelete(campaign)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Campañas por página:</span>
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

export default CampaignTable;
