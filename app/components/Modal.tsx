'use client'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-3">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
