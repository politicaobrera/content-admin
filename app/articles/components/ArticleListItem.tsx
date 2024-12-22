'use client'

import React from 'react';
import { ArticleType } from '@/app/types/article';
import { useRouter } from 'next/navigation';

interface ArticleListItemProps {
  article: ArticleType
}

const ArticleListItem: React.FC<ArticleListItemProps> = ({ article }) => {
  const router = useRouter();
  console.log(article);
  const handleEdit = (id: string) => {
    router.push(`/articles/${id}`);
  };
  
  return (
    <li key={`article-item-${article._id}`} className='flex items-center'>
      <span className='mr-2'>{article.title}</span>
      <button className='font-bold' onClick={() => handleEdit(article._id)}>Editar</button>
    </li>
  );
};

export default ArticleListItem;