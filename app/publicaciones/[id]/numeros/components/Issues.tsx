import getIssues from "@/app/actions/data/issues/getIssues"
import { iResponseMany } from "@/app/types/responses"
import { IssueType } from "@/app/types/issue"
import ErrorMessage from "@/app/components/ErrorMessage"
import { Params } from "@/app/types/requests"
import IssueTable from "./IssueTable"

interface IssuesProps {
  publicationId: string;
  searchParams: Params;
}

const Issues:React.FC<IssuesProps> = async ({publicationId, searchParams}) => {
  const {data, error, meta}:iResponseMany<IssueType> = await getIssues({...searchParams, publicationId})
  if (error) {
    return <ErrorMessage error={error}/>
  }
  if(!data) {
    return(<div>No hay data</div>)
  }
  return (
    <div className="h-screen">
      <IssueTable publicationId={publicationId} issues={data} meta={meta}/>
    </div>
  )
}

export default Issues
