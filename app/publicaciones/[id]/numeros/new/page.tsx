import MainContainer from "@/app/components/layout/MainContainer"
import Breadcrumbs from "@/app/components/layout/Breadcrumbs"
import { iResponseOne, iResponseMany } from "@/app/types/responses"
import getPublication from "@/app/actions/data/publications/getPublication"
import getIssues from "@/app/actions/data/issues/getIssues"
import ErrorMessage from "@/app/components/ErrorMessage"
import { PublicationType } from "@/app/types/publication"
import { IssueType } from "@/app/types/issue"
import IssueForm from "../components/IssueForm"

const NewIssuePage = async ({
  params,
} : {
  params: Promise<{ id: string }>,
}) => {
  const { id } = await params
  const [{data, error}, {data: lastIssues}]:[iResponseOne<PublicationType>, iResponseMany<IssueType>] = await Promise.all([
    getPublication(id),
    getIssues({publicationId: id, sortField: 'number', sortOrder: 'desc', page: '1', perPage: '1'}),
  ])

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Publicación</div>
  }

  const nextNumber = (lastIssues?.[0]?.number ?? 0) + 1

  return (
    <MainContainer>
      <Breadcrumbs items={[
        {label: 'Publicaciones', href: '/publicaciones'},
        {label: data.name, href: `/publicaciones/${id}`},
        {label: 'Números', href: `/publicaciones/${id}/numeros`},
        {label: 'Nuevo número'},
      ]}/>
      <IssueForm publicationId={id} publicationSlug={data.slug} nextNumber={nextNumber} />
    </MainContainer>
  )
}

export default NewIssuePage
