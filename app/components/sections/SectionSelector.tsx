'use client'

import SectionsContext from "@/app/context/SectionsContext"
import { Section } from "@/app/types/sections"
import { OptionType } from "@/app/types/select"
import { useContext } from "react"
//import dynamic from 'next/dynamic';
//const Select = dynamic(() => import('react-select'), { ssr: false });
import Select from 'react-select'

interface SectionSelectorProps {
  onChange: (section:Section|null) => void
  currentSection: Section | string | null
  isClearable?: boolean
}

const SectionSelector = ({onChange, currentSection, isClearable = false}: SectionSelectorProps) => {
  const { sections } = useContext(SectionsContext)
  const options = sections.map(sec => ({value: sec._id, label: sec.name}))

  const getCurrentSecctionValue = (current: Section | string | null) => {
    if (!current) return null

    if (typeof current === 'string') {
      return options.find(o => o.value === current)
    }

    return {
      value: current._id,
      label: current.name,
    };
  }

  const currentValue = getCurrentSecctionValue(currentSection)

  const handleSectionChange = (val: OptionType|null) => {
    if(!val) {
      if (isClearable) onChange(null)
      return
    }
    const selectedSection = sections.find(sec => sec._id === val.value)
    if (selectedSection) onChange(selectedSection)
  }

  return (
    <div className="flex flex-col gap-3">
      <h5>Sección</h5>
      <div>
        <Select
          options={options}
          value={currentValue}
          onChange={handleSectionChange}
          isClearable={isClearable}
          placeholder={isClearable ? "Todas las secciones" : "Seleccionar..."}
        />
      </div>
    </div>
  )
}

export default SectionSelector