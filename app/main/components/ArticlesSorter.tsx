'use client'

import { useState } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import DraggableItem from "@/app/components/drag/DraggableItem"
import { ArticleType } from "@/app/types/article"

interface ArticlesSorterProps {
  current: ArticleType[]
  newToAdd: ArticleType[]
}

function addIDToArticles (list:ArticleType[]) {
  return list.map(item => ({...item, id: item.articleId}))
}

// TODO: Article or content or both sorter?
const ArticlesSorter = ({ current, newToAdd }: ArticlesSorterProps) => {
  const [currentArticles, setCurrentArticles] = useState(addIDToArticles(current));
  const [newToAddArticles, setNewToAddArticles] = useState(addIDToArticles(newToAdd));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return; 

    const activeList = currentArticles.find((item) => item.id === active.id)
      ? 'current'
      : 'newToAdd';
    const overList = currentArticles.find((item) => item.id === over.id)
      ? 'current'
      : 'newToAdd';

    if (activeList === overList) {
      if (activeList === 'current') {
        setCurrentArticles((curr) => {
          const oldIndex = curr.findIndex((item) => item.id === active.id);
          const newIndex = curr.findIndex((item) => item.id === over.id);
          return arrayMove(curr, oldIndex, newIndex);
        });
      } else {
        setNewToAddArticles((curr) => {
          const oldIndex = curr.findIndex((item) => item.id === active.id);
          const newIndex = curr.findIndex((item) => item.id === over.id);
          return arrayMove(curr, oldIndex, newIndex);
        });
      }
    } else {

      if (activeList === 'current') {
        setCurrentArticles((curr) => curr.filter((item) => item.id !== active.id));
        setNewToAddArticles((curr) => [
          ...curr,
          currentArticles.find((item) => item.id === active.id)!,
        ]);
      } else {
        setNewToAddArticles((curr) => curr.filter((item) => item.id !== active.id));
        setCurrentArticles((curr) => [
          ...curr,
          newToAddArticles.find((item) => item.id === active.id)!,
        ]);
      }
    }
  };

  return (
    <div>
      <div>Filtros</div>
      <div className="flex justify-around">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="w-[calc(40%+2rem)] h-1/2 flex flex-col">
            <h2 className="text-2xl font-bold bg-gray-400">Portada</h2>
            <div className="border-dashed border-gray-700 border-2 p-1 h-full w-auto">
              <SortableContext
                items={currentArticles.map((article) => article.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentArticles.map((article) => (
                  <DraggableItem key={article.id} item={article} />
                ))}
              </SortableContext>
            </div>
          </div>
          <div className="w-[calc(40%+2rem)] h-1/2 flex flex-col">
            <h2 className="text-2xl font-bold bg-gray-400">Busqueda</h2>
            <div className="border-dashed border-gray-700 border-2 p-1">
              <SortableContext
                items={newToAddArticles.map((article) => article.id)}
                strategy={verticalListSortingStrategy}
              >
                {newToAddArticles.map((article) => (
                  <DraggableItem key={article.id} item={article} />
                ))}
              </SortableContext>
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default ArticlesSorter