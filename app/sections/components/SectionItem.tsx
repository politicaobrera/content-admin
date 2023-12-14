'use client'
import React from 'react';
import { Section, SectionProps } from '../types/sections';
import { useRouter } from 'next/navigation';

const SectionItem: React.FC<SectionProps> = ({ section }) => {
  
  const router = useRouter();

  console.log(section);
  const handleEdit = (section: Section) => {
    router.push(`/sections/${section._id}`);
  };
  
  return (
    <li key={`section-item-${section._id}`} className='flex items-center'>
      <span className='mr-2'>{section.name}</span>
      <button className='font-bold' onClick={() => handleEdit(section)}>Editar</button>
      {/* <button onClick={() => onDelete(section.id)}>Eliminar</button> */}
    </li>
  );
};

export default SectionItem;
