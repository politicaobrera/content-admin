'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "react-hot-toast"
import { EventType } from '@/app/types/event';
import Button from '@/app/components/Button';
import { PaginationMeta } from '@/app/types/responses';
import useEvent from '../hooks/useEvent';
import FilterBar, { FilterField } from '@/app/components/table/FilterBar';

interface EventTableProps {
  events: EventType[];
  meta: PaginationMeta | undefined;
}

const EventTable = ({ events, meta }: EventTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {remove} = useEvent();

  const [filters, setFilters] = useState<Record<string, any>>({
    title: searchParams.get('title') || '',
    place: searchParams.get('place') || '',
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
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

    if (filters.place) params.set('place', filters.place);
    else params.delete('place');

    if (filters.from) params.set('from', filters.from);
    else params.delete('from');

    if (filters.to) params.set('to', filters.to);
    else params.delete('to');

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
    setFilters({ title: '', place: '', from: '', to: '' });
  };

  const handleClickEdit = (id: string) => {
    router.push(`/events/${id}`);
  };

  const handleClickNew = () => {
    router.push(`/events/new`);
  }

  const handleClickDelete = async (event: EventType) => {
    if (!window.confirm(`¿Eliminar el evento "${event.title}"? Esta acción no se puede deshacer.`)) {
      return
    }
    const result = await remove(event._id)
    if (result.error) {
      toast.error(result.error.message)
    }
    if (result.data) {
      toast.success("Evento eliminado correctamente")
      router.refresh()
    }
  }

  const filterFields: FilterField[] = [
    { type: 'text', name: 'title', label: 'Título', placeholder: 'Filtrar por título' },
    { type: 'text', name: 'place', label: 'Lugar', placeholder: 'Filtrar por lugar' },
    { type: 'date', name: 'from', label: 'Desde' },
    { type: 'date', name: 'to', label: 'Hasta' },
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
            NUEVO EVENTO
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
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
           <p className="text-lg text-gray-600 font-medium">No hay eventos para mostrar</p>
           <p className="text-gray-500">Intenta ajustar los filtros o agrega nuevos eventos.</p>
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
                      onClick={() => handleSort('date')}
                    >
                      Fecha {sort.field === 'date' && (sort.order === 'asc' ? '⬆️' : '⬇️')}
                    </th>
                    <th
                      className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort('place')}
                    >
                      Lugar {sort.field === 'place' && (sort.order === 'asc' ? '⬆️' : '⬇️')}
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Horario</th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => {
                    const isPast = new Date(event.date) < new Date()
                    return (
                    <tr key={event._id} className={`hover:bg-gray-50 border-b ${isPast ? 'bg-gray-50 text-gray-400' : ''}`}>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className={isPast ? 'text-gray-400' : 'text-gray-600'}>{event.title}</span>
                          {isPast && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                              Vencido
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-2 text-sm ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(event.date).toLocaleDateString()}</td>
                      <td className={`px-4 py-2 text-sm ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>{event.place}</td>
                      <td className={`px-4 py-2 text-sm ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>{event.schedule}</td>
                      <td className="px-4 py-2 text-sm text-gray-600 w-40">
                        <div className='flex gap-2'>
                          <Button
                            type="button"
                            onClick={() => handleClickEdit(event._id)}
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            danger
                            onClick={() => handleClickDelete(event)}
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
                <span className="text-sm text-gray-600">Eventos por página:</span>
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

export default EventTable;
