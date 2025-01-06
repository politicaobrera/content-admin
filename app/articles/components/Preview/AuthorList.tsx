import { AuthorType } from "@/app/types/author"

interface AuthorsListProps {
  authors: AuthorType[]
  descriptions: string[]
}

type AuthorWithDescription = {
  author: AuthorType
  description: string 
}

const AuthorsList = ({ authors, descriptions }: AuthorsListProps) => {
  const combined = authors.map((author, index) => ({
    author,
    description: descriptions[index],
  }))

  const formatAuthors = (authorsWithDesc: AuthorWithDescription[]) => {
    if (authorsWithDesc.length === 0) return ""

    const formattedAuthors = authorsWithDesc.map((item) =>
      item.description ? `${item.author.name} (${item.description})` : item.author.name
    )

    if (formattedAuthors.length > 2) {
      const lastAuthor = formattedAuthors.pop()
      return `${formattedAuthors.join(", ")} y ${lastAuthor}`
    }

    return formattedAuthors.join(" y ")
  }

  return (
    <div>
      {combined.length === 1 && (
        <span>Escribe </span>
      )}
      {combined.length > 1 && (
        <span>Escriben </span>
      )}
      {formatAuthors(combined)}
    </div>
  )
}

export default AuthorsList