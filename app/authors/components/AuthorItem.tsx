'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { Author } from '../types/authors';

export type AuthorItemProps = {
    author: Author
    onEdit?: (section: Author) => void;
    onDelete?: (id: string) => void;
  };

const AuthorItem: React.FC<AuthorItemProps> = ({ author }) => {
  
  const router = useRouter();

  console.log(author);
  const handleEdit = (author: Author) => {
    router.push(`/sections/${author._id}`);
  };
  
  return (
    <li key={`section-item-${author._id}`} className='flex items-center'>
      <span className='mr-2'>{author.name}</span>
      <button className='font-bold' onClick={() => handleEdit(author)}>Editar</button>
      {/* <button onClick={() => onDelete(section.id)}>Eliminar</button> */}
    </li>
  );
};

export default AuthorItem;
