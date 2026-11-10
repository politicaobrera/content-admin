'use client'

import { diffWords } from 'diff'
import Modal from '@/app/components/Modal'
import { htmlToPlainText } from '@/app/utils/htmlToPlainText'

interface ContentDiffModalProps {
  open: boolean
  onClose: () => void
  from?: string | null
  to?: string | null
}

const ContentDiffModal: React.FC<ContentDiffModalProps> = ({ open, onClose, from, to }) => {
  const parts = diffWords(htmlToPlainText(from), htmlToPlainText(to))

  return (
    <Modal open={open} title="Cambios en el contenido desde la última publicación" onClose={onClose}>
      <p className="mb-2 text-xs text-gray-500">
        En <span className="bg-rose-100 text-rose-700">rojo</span> lo que se borró, en{' '}
        <span className="bg-emerald-100 text-emerald-700">verde</span> lo que se agregó.
      </p>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
        {parts.map((part, i) => (
          <span
            key={i}
            className={
              part.added
                ? 'bg-emerald-100 text-emerald-800'
                : part.removed
                ? 'bg-rose-100 text-rose-800 line-through'
                : undefined
            }
          >
            {part.value}
          </span>
        ))}
      </div>
    </Modal>
  )
}

export default ContentDiffModal
