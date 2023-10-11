import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function DraggableItem({ item }:{item:any}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-md shadow-md my-2 text-slate-950"
    >
      <h1>{item.title}</h1>
    </div>
  );
}

export default DraggableItem;