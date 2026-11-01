'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { WorkType } from "@/app/types/work"
import Button from "@/app/components/Button"

interface WorkDetailProps {
  work: WorkType
}

// Read-only (ver nota en WorkTable.tsx) -- muestra la obra completa con un índice de
// capítulos a la izquierda (desktop) / arriba (mobile) y el contenido a la derecha.
const WorkDetail: React.FC<WorkDetailProps> = ({ work }) => {
  const router = useRouter()
  const sortedChapters = [...work.chapters].sort((a, b) => a.order - b.order)
  const [activeSlug, setActiveSlug] = useState<string>(sortedChapters[0]?.slug ?? "")
  const activeChapter = sortedChapters.find((c) => c.slug === activeSlug) ?? sortedChapters[0]

  return (
    <div className="mt-8 mx-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{work.title}</h1>
        <Button type="button" onClick={() => router.push("/works")}>
          Volver
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 text-sm text-gray-700">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span><strong>Autor:</strong> {work.author?.name}</span>
          {work.year && <span><strong>Año:</strong> {work.year}</span>}
          <span className="capitalize"><strong>Tipo:</strong> {work.kind}</span>
        </div>
        {work.description && <p className="text-gray-600">{work.description}</p>}
        {work.tags && work.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {work.tags.map((tag) => (
              <span key={tag._id} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
          Fuente: {work.sourceLabel} — <a href={work.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{work.sourceUrl}</a>
          {" — "}Licencia: {work.license === "cc-by-sa" ? "CC BY-SA" : "Dominio público"}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <nav className="md:w-72 shrink-0 bg-white rounded-lg shadow p-4 h-fit">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Índice ({sortedChapters.length})</h2>
          <ul className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
            {sortedChapters.map((chapter) => (
              <li key={chapter.slug}>
                <button
                  type="button"
                  onClick={() => setActiveSlug(chapter.slug)}
                  className={`w-full text-left px-2 py-1 rounded text-sm ${
                    chapter.slug === activeChapter?.slug
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {chapter.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {activeChapter ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{activeChapter.title}</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: activeChapter.content }} />
            </>
          ) : (
            <p className="text-gray-500">Esta obra todavía no tiene capítulos cargados.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkDetail
