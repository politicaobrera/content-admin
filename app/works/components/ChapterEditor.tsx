'use client'

import dynamic from 'next/dynamic'
import { WorkChapterType } from '@/app/types/work'

const BlockNoteEditor = dynamic(() => import('@/app/components/inputs/BlockNoteEditor'), { ssr: false })

interface ChapterEditorProps {
  chapters: WorkChapterType[]
  onChange: (chapters: WorkChapterType[]) => void
}

// mismo criterio de "lista editable controlada por el padre" que KeyIdeasEditor
// (articles), pero cada item es un capítulo completo (título + contenido rico) en vez
// de un string -- sin drag-and-drop: el orden se edita como número, igual que ya lo
// usa el scraper (deja huecos de a 1000 por página para poder reordenar a mano)
const ChapterEditor = ({ chapters, onChange }: ChapterEditorProps) => {
  const handleChangeField = (index: number, field: 'title' | 'order', value: string | number) => {
    const updated = [...chapters]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const handleChangeContent = (index: number, content: string) => {
    const updated = [...chapters]
    updated[index] = { ...updated[index], content }
    onChange(updated)
  }

  const handleAdd = () => {
    const nextOrder = chapters.length > 0 ? Math.max(...chapters.map((c) => c.order)) + 1 : 0
    onChange([...chapters, { title: '', slug: '', content: '', order: nextOrder }])
  }

  const handleRemove = (index: number) => {
    onChange(chapters.filter((_, i) => i !== index))
  }

  const sorted = [...chapters]
    .map((chapter, originalIndex) => ({ chapter, originalIndex }))
    .sort((a, b) => a.chapter.order - b.chapter.order)

  return (
    <div className="flex flex-col gap-4">
      {sorted.map(({ chapter, originalIndex }) => (
        <div key={originalIndex} className="flex flex-col gap-2 border-2 border-gray-400 rounded-md p-3">
          <div className="flex items-end gap-2">
            <div className="w-20">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Orden</label>
              <input
                type="number"
                className="w-full border-2 p-1 text-gray-900"
                value={chapter.order}
                onChange={(e) => handleChangeField(originalIndex, 'order', Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Título del capítulo</label>
              <input
                type="text"
                className="w-full border-2 p-1 text-gray-900"
                value={chapter.title}
                onChange={(e) => handleChangeField(originalIndex, 'title', e.target.value)}
                placeholder="Título del capítulo..."
              />
            </div>
            <button
              type="button"
              className="underline text-sm text-gray-900 shrink-0 mb-1"
              onClick={() => handleRemove(originalIndex)}
            >
              Quitar
            </button>
          </div>
          <BlockNoteEditor
            id={`chapter-${originalIndex}`}
            initialHTML={chapter.content}
            onChange={(html: string) => handleChangeContent(originalIndex, html)}
          />
        </div>
      ))}

      <button type="button" className="underline text-sm self-start" onClick={handleAdd}>
        + Agregar capítulo
      </button>
    </div>
  )
}

export default ChapterEditor
