'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '@/app/types/sections';
import Button from '@/app/components/Button';
import FilterBar, { FilterField } from '@/app/components/table/FilterBar';

interface SectionTableProps {
  sections: Section[];
}

// sin paginación/filtros de servidor: la cantidad de secciones es fija y chica, el
// filtro de texto filtra del lado del cliente sobre la lista completa
const SectionTable = ({ sections }: SectionTableProps) => {
  const router = useRouter();
  const [filters, setFilters] = useState<Record<string, any>>({ name: '' });

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => setFilters({ name: '' });

  const handleClickNew = () => router.push('/sections/new');
  const handleClickEdit = (id: string) => router.push(`/sections/${id}`);

  const filterFields: FilterField[] = [
    { type: 'text', name: 'name', label: 'Nombre', placeholder: 'Filtrar por nombre o slug' },
  ];

  const filteredSections = useMemo(() => {
    const query = (filters.name || '').trim().toLowerCase();
    if (!query) return sections;
    return sections.filter((section) =>
      section.name.toLowerCase().includes(query) || section.slug.toLowerCase().includes(query)
    );
  }, [sections, filters.name]);

  return (
    <div className="space-y-4 w-full">
      <div className="mt-8 mx-auto max-w-md">
        <div className="bg-white p-4 rounded-lg shadow">
          <Button type="button" fullWidth onClick={handleClickNew}>
            NUEVA SECCIÓN
          </Button>
        </div>
      </div>
      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />
      <div className="bg-white p-4 rounded-lg shadow">
        {filteredSections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-gray-600 font-medium">No hay secciones para mostrar</p>
            <p className="text-gray-500">Intenta ajustar el filtro o agrega una nueva sección.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Slug</th>
                  <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Color</th>
                  <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSections.map((section) => (
                  <tr key={section._id} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-2 text-sm text-gray-600 font-medium">{section.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{section.slug}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      <span
                        className="inline-block rounded px-2 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: section.style?.backgroundColor ?? '#e5e7eb',
                          color: section.style?.color ?? '#111827',
                        }}
                      >
                        {section.name}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600 w-40">
                      <Button type="button" onClick={() => handleClickEdit(section._id)}>
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionTable;
