'use client'

import useArticleEditingObserver from '../hooks/useArticleEditingObserver'

interface EditingPresenceBadgeProps {
  articleId: string
}

const EditingPresenceBadge: React.FC<EditingPresenceBadgeProps> = ({ articleId }) => {
  const editor = useArticleEditingObserver(articleId)
  if (!editor) return null

  return (
    <span
      className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
      title={`${editor.username} está editando esta nota ahora mismo`}
    >
      ✏️ {editor.username}
    </span>
  )
}

export default EditingPresenceBadge
