'use client'

import { useState } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import DraggableItem from "@/app/components/drag/DraggableItem"

const ArticlesOrganizer = () => {
  // obtener los articulos de portada y guardarlos
  const [frontPageArticles, setFrontPageArticles] = useState([
    { id: 1, title: "Nota JA" },
    { id: 2, title: "NOTA MR" },
    { id: 3, title: "NOTA HIKA" },
  ]);

  // obtener las ultimas notas y guardarlas en variable

  const handleDragEnd = (event:any) => {
    const { active, over } = event;
    if (!active.id !== over.id) {
      setFrontPageArticles((frontPageArticles:any) => {
        const oldIndex = frontPageArticles.findIndex((frontPageArticle:any) => frontPageArticle.id === active.id);
        const newIndex = frontPageArticles.findIndex((frontPageArticle:any) => frontPageArticle.id === over.id);
        return arrayMove(frontPageArticles, oldIndex, newIndex);
      });
    }
    console.log("drag end");
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-4/6">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <h1 className="text-2xl font-bold">Orden Portada</h1>
          <SortableContext
            items={frontPageArticles}
            strategy={verticalListSortingStrategy}
          >
            {frontPageArticles.map((user) => (
              <DraggableItem key={user.id} item={user} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

export default ArticlesOrganizer