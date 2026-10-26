'use client'

interface KeyIdeasEditorProps {
  ideas: string[]
  onChange: (ideas: string[]) => void
}

const KeyIdeasEditor = ({ ideas, onChange }: KeyIdeasEditorProps) => {
  const handleChangeIdea = (index: number, value: string) => {
    const updated = [...ideas]
    updated[index] = value
    onChange(updated)
  }

  const handleAdd = () => {
    onChange([...ideas, ''])
  }

  const handleRemove = (index: number) => {
    onChange(ideas.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3 border-2 border-gray-400 rounded-md p-3">
      <h3 className="font-bold text-lg">Ideas principales</h3>
      <p className="text-xs text-gray-500">
        Se listan al final del cuerpo de la nota en el sitio público, cada una como un ítem con •.
      </p>

      {ideas.length > 0 && (
        <ul className="flex flex-col gap-2">
          {ideas.map((idea, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="font-bold">•</span>
              <input
                type="text"
                className="flex-1 border-2 p-1"
                value={idea}
                onChange={(e) => handleChangeIdea(index, e.target.value)}
                placeholder="Idea principal..."
              />
              <button type="button" className="underline text-sm" onClick={() => handleRemove(index)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="underline text-sm self-start" onClick={handleAdd}>
        + Agregar idea principal
      </button>
    </div>
  )
}

export default KeyIdeasEditor
