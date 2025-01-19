'use client'

import { useState } from "react"
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core"
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

interface ArticleWithID extends ArticleType {
  id: number
}

function addIDToArticles (list:ArticleType[]): ArticleWithID[] {
  return list.map(item => ({...item, id: item.articleId}))
}

// TODO: Article or content or both sorter?
const ArticlesSorter = ({ current, newToAdd }: ArticlesSorterProps) => {
  const [currentArticles, setCurrentArticles] = useState(addIDToArticles(current));
  const [newToAddArticles, setNewToAddArticles] = useState(addIDToArticles(newToAdd));
  const [activeItem, setActiveItem] = useState<ArticleWithID|null>(null);

  const handleDragStart = (event: any) => {
    const { active } = event;
    const allItems = [...currentArticles, ...newToAddArticles];
    const draggedItem = allItems.find((item) => item.id === active.id);
    setActiveItem(draggedItem ?? null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setActiveItem(null);
      return
    } 

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
    setActiveItem(null);
  };

  return (
    <div>
      <div>Filtros</div>
      <div className="flex justify-around">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
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
          <DragOverlay>
            {activeItem ? (
              <div className="bg-white p-4 rounded-md shadow-md my-2 text-slate-950">
                <h1>{activeItem.title}</h1>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default ArticlesSorter