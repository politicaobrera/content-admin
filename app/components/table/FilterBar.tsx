'use client'

import { ReactNode, useState } from 'react'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import clsx from 'clsx'
import { OptionType } from '@/app/types/select'

// select estilizado consistente con el resto del admin (bordes suaves, focus ring
// gris oscuro acorde al resto de los inputs) en vez del look default de react-select
const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: '2.5rem',
    borderRadius: '0.5rem',
    borderColor: state.isFocused ? '#111827' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #111827' : 'none',
    '&:hover': { borderColor: state.isFocused ? '#111827' : '#9ca3af' },
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: '#f3f4f6',
    borderRadius: '0.375rem',
  }),
  menu: (base: any) => ({ ...base, zIndex: 20 }),
}

export type TextFilterField = {
  type: 'text'
  name: string
  label: string
  placeholder?: string
  numeric?: boolean
}

export type SelectFilterField = {
  type: 'select'
  name: string
  label: string
  options: OptionType[]
  placeholder?: string
}

export type AsyncMultiSelectFilterField = {
  type: 'asyncMultiSelect'
  name: string
  label: string
  loadOptions: (query: string) => Promise<OptionType[]>
  placeholder?: string
}

export type CheckboxFilterField = {
  type: 'checkbox'
  name: string
  label: string
}

export type DateFilterField = {
  type: 'date'
  name: string
  label: string
}

export type FilterField =
  | TextFilterField
  | SelectFilterField
  | AsyncMultiSelectFilterField
  | CheckboxFilterField
  | DateFilterField

interface FilterBarProps {
  fields: FilterField[]
  values: Record<string, any>
  onChange: (name: string, value: any) => void
  onClear: () => void
  // slot libre para controles que no encajan en el modelo declarativo de fields
  // (ej. el toggle "cambios pendientes" de ArticleTable, con su propio copy largo)
  extra?: ReactNode
}

function countActiveFilters(fields: FilterField[], values: Record<string, any>): number {
  return fields.reduce((count, field) => {
    const value = values[field.name]
    if (field.type === 'checkbox') return count + (value ? 1 : 0)
    if (Array.isArray(value)) return count + (value.length > 0 ? 1 : 0)
    return count + (value ? 1 : 0)
  }, 0)
}

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
  </svg>
)

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
)

const FilterBar = ({ fields, values, onChange, onClear, extra }: FilterBarProps) => {
  const [asyncCache, setAsyncCache] = useState<Record<string, OptionType[]>>({})
  const activeCount = countActiveFilters(fields, values)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <FilterIcon />
          <h2 className="text-sm font-semibold uppercase tracking-wide">Filtros</h2>
          {activeCount > 0 && (
            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => {
          if (field.type === 'text') {
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label htmlFor={field.name} className="text-xs font-medium text-gray-500">
                  {field.label}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon />
                  </div>
                  <input
                    id={field.name}
                    name={field.name}
                    inputMode={field.numeric ? 'numeric' : undefined}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ''}
                    onChange={(e) => {
                      if (field.numeric && e.target.value && !/^\d*$/.test(e.target.value)) return
                      onChange(field.name, e.target.value)
                    }}
                    className="
                      block w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm
                      text-gray-900 placeholder:text-gray-400
                      focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900
                    "
                  />
                </div>
              </div>
            )
          }

          if (field.type === 'select') {
            const currentOption = field.options.find((opt) => opt.value === values[field.name]) ?? null
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">{field.label}</label>
                <Select
                  options={field.options}
                  value={currentOption}
                  onChange={(opt) => onChange(field.name, (opt as OptionType | null)?.value ?? '')}
                  isClearable
                  placeholder={field.placeholder ?? 'Todas'}
                  styles={selectStyles}
                />
              </div>
            )
          }

          if (field.type === 'asyncMultiSelect') {
            const selected: OptionType[] = asyncCache[field.name]
              ? (values[field.name] ?? []).map((id: string) =>
                  asyncCache[field.name].find((opt) => opt.value === id)
                ).filter(Boolean)
              : []
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">{field.label}</label>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  defaultOptions
                  value={selected}
                  loadOptions={async (query: string) => {
                    const opts = await field.loadOptions(query)
                    setAsyncCache((prev) => ({ ...prev, [field.name]: opts }))
                    return opts
                  }}
                  onChange={(opts) => onChange(field.name, (opts as OptionType[]).map((o) => o.value))}
                  placeholder={field.placeholder ?? 'Buscar...'}
                  noOptionsMessage={({ inputValue }) => (inputValue ? 'Sin resultados' : 'Escribí para buscar')}
                  loadingMessage={() => 'Buscando...'}
                  styles={selectStyles}
                />
              </div>
            )
          }

          if (field.type === 'date') {
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label htmlFor={field.name} className="text-xs font-medium text-gray-500">
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={values[field.name] ?? ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className="
                    block w-full rounded-lg border border-gray-300 py-2 px-3 text-sm
                    text-gray-900
                    focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900
                  "
                />
              </div>
            )
          }

          // checkbox
          return (
            <label
              key={field.name}
              className="flex cursor-pointer items-center gap-2 self-end rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={Boolean(values[field.name])}
                onChange={(e) => onChange(field.name, e.target.checked)}
                className={clsx('h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900')}
              />
              {field.label}
            </label>
          )
        })}
      </div>

      {extra}
    </div>
  )
}

export default FilterBar
