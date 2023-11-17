'use client'
import React from 'react';
import { Section, SectionProps } from '../types/sections';
import { useRouter } from 'next/navigation';

const SectionItem: React.FC<SectionProps> = ({ section }) => {
  
  const router = useRouter();

  const handleEdit = (section: Section) => {
    // Redirect to the edit page with the section ID
    router.push(`/sections/${section.id}`);
  };
  
  return (
    <li>
      {section.name}
      <button onClick={() => handleEdit(section)}>Editar</button>
      {/* <button onClick={() => onDelete(section.id)}>Eliminar</button> */}
    </li>
  );
};

export default SectionItem;
