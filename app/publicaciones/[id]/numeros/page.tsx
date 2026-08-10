import { Suspense } from "react"
import MainContainer from "@/app/components/layout/MainContainer"
import Breadcrumbs from "@/app/components/layout/Breadcrumbs"
import Loading from "@/app/components/Loading"
import ErrorMessage from "@/app/components/ErrorMessage"
import { Params } from "@/app/types/requests"
import { iResponseOne } from "@/app/types/responses"
import { PublicationType } from "@/app/types/publication"
import getPublication from "@/app/actions/data/publications/getPublication"
import Issues from "./components/Issues"

const NumerosPage = async ({
  params,
  searchParams,
} : {
  params: Promise<{ id: string }>,
  searchParams: Promise<Params>,
}) => {
  const { id } = await params
  const resolvedSearchParams = await searchParams
  const {data, error}:iResponseOne<PublicationType> = await getPublication(id)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Publicación</div>
  }

  return (
    <MainContainer>
      <section id="numeros-page" className="flex flex-col gap-3 px-4">
          <Breadcrumbs
            items={[
              {label: 'Publicaciones', href: '/publicaciones'},
              {label: data.name, href: `/publicaciones/${id}`},
              {label: 'Números'},
            ]}
          />
        <h1 className="mt-6 text-center text-2xl text-black tracking-tight font-bold">
          Números de {data.name}
        </h1>
        <Suspense fallback={<Loading />}>
          <Issues publicationId={id} searchParams={resolvedSearchParams}/>
        </Suspense>
      </section>
    </MainContainer>
  )
}

export default NumerosPage
