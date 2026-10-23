'use client'

import { useState } from "react"
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import DraggableArticle from "@/app/main/components/DraggableArticle"
import DroppableColumn from "@/app/main/components/DroppableColumn"
import ArticleSearchPanel from "@/app/main/components/ArticleSearchPanel"
import { ArticleType } from "@/app/types/article"
import Button from "@/app/components/Button"
import usePortada from "../hooks/usePortada"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { ArticleWithID, usePortadaDraft } from "../context/PortadaDraftContext"

const CURRENT_COLUMN_ID = "sortable-actual"
const NEW_TO_ADD_COLUMN_ID = "sortable-ultimas"

//TODO: Ver si en vez de partial hay que resolverlo con peeks y omits etc
interface ArticlesSorterProps {
  newToAdd: Partial<ArticleType>[]
  id: string
}

function addIDToArticles (list:Partial<ArticleType>[]): ArticleWithID[] {
  return list.map(item => ({...item, id: item?.articleId || 0}))
}

// TODO: Article or content or both sorter?
const ArticlesSorter = ({ newToAdd, id }: ArticlesSorterProps) => {
  const {saveArticles}= usePortada();
  const router = useRouter()
  // currentArticles vive en el contexto compartido (PortadaDraftContext) en vez de un
  // useState local, para que LayoutsSorter vea el orden actual sin tener que guardar antes
  const { draftArticles: currentArticles, setDraftArticles: setCurrentArticles } = usePortadaDraft()
  const [newToAddArticles, setNewToAddArticles] = useState(addIDToArticles(newToAdd));
  const [activeItem, setActiveItem] = useState<ArticleWithID|null>(null);

  const handleSave = async () => {
    saveArticles(currentArticles.map(article => ({_id: article._id})), id).then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        toast.success("Articulos de portada actualizada correctamente")
      }
    })
    router.refresh()
  }

  const handleAddSearchedArticle = (article: Partial<ArticleType>) => {
    const [withId] = addIDToArticles([article])
    const alreadyPresent = [...currentArticles, ...newToAddArticles].some((item) => item.id === withId.id)
    if (alreadyPresent) return
    setNewToAddArticles((curr) => [withId, ...curr])
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
    const overList = over.id === CURRENT_COLUMN_ID
      ? 'current'
      : over.id === NEW_TO_ADD_COLUMN_ID
        ? 'newToAdd'
        : currentArticles.find((item) => item.id === over.id) ? 'current' : 'newToAdd';

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
        setNewToAddArticles((curr) => [
          currentArticles.find((item) => item.id === active.id)!,
          ...curr,
        ]);
        setCurrentArticles((curr) => curr.filter((item) => item.id !== active.id));
      } else {
        setCurrentArticles((curr) => [
          newToAddArticles.find((item) => item.id === active.id)!,
          ...curr,
        ]);
        setNewToAddArticles((curr) => curr.filter((item) => item.id !== active.id));
      }
    }
    setActiveItem(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <ArticleSearchPanel
        excludeArticleIds={[...currentArticles, ...newToAddArticles].map((article) => article.id)}
        onAddArticle={handleAddSearchedArticle}
      />
      <div className="flex gap-10">
        <DndContext
          // closestCenter compara centros geometricos -- con "Orden actual" vacio (area
          // grande sin items propios) pierde contra los items de "Ultimas notas" que
          // quedan mas cerca en distancia de centro, y la columna vacia nunca resuelve
          // como target. pointerWithin detecta por posicion real del cursor dentro del
          // area droppable, que es lo que hace falta para este caso.
          collisionDetection={pointerWithin}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <div className=" flex flex-col">
            <div className=" bg-gray-200 text-center border-gray-400 border-solid border-2 rounded-md">
              <h2 className="text-2xl font-bold">Orden actual</h2>
            </div>
            <DroppableColumn id={CURRENT_COLUMN_ID} className="min-h-[200px] h-[75vh] overflow-scroll">
              <SortableContext
                id={CURRENT_COLUMN_ID}
                items={currentArticles.map((article) => article.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentArticles.map((article, idx) => (
                  <DraggableArticle key={article.id} article={article} idx={idx} />
                ))}
              </SortableContext>
            </DroppableColumn>
          </div>
          <div className=" flex flex-col">
            <div className=" bg-gray-200 text-center border-gray-400 border-solid border-2 rounded-md">
              <h2 className="text-2xl font-bold">Últimas notas</h2>
            </div>
            <DroppableColumn id={NEW_TO_ADD_COLUMN_ID} className="h-[75vh] overflow-scroll">
              <SortableContext
                id={NEW_TO_ADD_COLUMN_ID}
                items={newToAddArticles.map((article) => article.id)}
                strategy={verticalListSortingStrategy}
              >
                {newToAddArticles.map((article, idx) => (
                  <DraggableArticle key={article.id} article={article} idx={idx} showIndex={false}/>
                ))}
              </SortableContext>
            </DroppableColumn>
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
      <div className="flex align-middle justify-end">
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