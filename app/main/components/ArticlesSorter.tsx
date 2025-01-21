'use client'

import { useState } from "react"
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import DraggableArticle from "@/app/main/components/DraggableArticle"
import { ArticleType } from "@/app/types/article"
import Button from "@/app/components/Button"
import usePortada from "../hooks/usePortada"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface ArticlesSorterProps {
  current: ArticleType[]
  newToAdd: ArticleType[]
  id: string
}

export interface ArticleWithID extends ArticleType {
  id: number
}

function addIDToArticles (list:ArticleType[]): ArticleWithID[] {
  return list.map(item => ({...item, id: item.articleId}))
}

// TODO: Article or content or both sorter?
const ArticlesSorter = ({ current, newToAdd, id }: ArticlesSorterProps) => {
  const {saveArticles}= usePortada();
  const router = useRouter()
  const [currentArticles, setCurrentArticles] = useState(addIDToArticles(current));
  const [newToAddArticles, setNewToAddArticles] = useState(addIDToArticles(newToAdd));
  const [activeItem, setActiveItem] = useState<ArticleWithID|null>(null);

  const handleSave = async () => {
    saveArticles(currentArticles, id).then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        toast.success("Articulos de portada actualizada correctamente")
      }
    })
    router.refresh()
  }

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
    <div className="mt-5 flex flex-col gap-2">
      {/*TODO <div>Filtros</div> */}
      <div className="flex gap-10">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <div className="w-[calc(45%)] flex flex-col">
            <div className=" bg-gray-200 text-center border-gray-400 border-solid border-2 rounded-md">
              <h2 className="text-2xl font-bold">Portada Actual</h2>
            </div>
            <div className="border-dashed border-gray-700 border-2 p-2 h-full w-auto mt-1">
              <SortableContext
                items={currentArticles.map((article) => article.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentArticles.map((article, idx) => (
                  <DraggableArticle key={article.id} article={article} idx={idx} />
                ))}
              </SortableContext>
            </div>
          </div>
          <div className="w-[calc(40%+2rem)] flex flex-col">
            <div className=" bg-gray-200 text-center border-gray-400 border-solid border-2 rounded-md">
              <h2 className="text-2xl font-bold">Últimas</h2>
            </div>
            <div className="border-dashed border-gray-700 border-2 p-2 h-full mt-1">
              <SortableContext
                items={newToAddArticles.map((article) => article.id)}
                strategy={verticalListSortingStrategy}
              >
                {newToAddArticles.map((article, idx) => (
                  <DraggableArticle key={article.id} article={article} idx={idx}/>
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
      <div className="flex align-middle justify-start">
        <Button
          onClick={handleSave}
        >
          Guardar Orden
        </Button>
      </div>
    </div>
  );
};

export default ArticlesSorter