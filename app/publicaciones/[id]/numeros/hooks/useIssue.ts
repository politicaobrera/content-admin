import { IssueType } from "@/app/types/issue"
import createIssue from "@/app/actions/data/issues/createIssue"
import editIssue from "@/app/actions/data/issues/editIssue"
import deleteIssue from "@/app/actions/data/issues/deleteIssue"

export default function useIssue(){
    const edit = async (issue: Partial<IssueType>) : Promise<any> => {
        const {data, error} = await editIssue(issue);
        return {data, error};
    }

    const create = async (issue: Partial<IssueType>) : Promise<any> => {
      const {data, error} = await createIssue(issue);
      return {data, error};
    }

    const remove = async (id: string) : Promise<any> => {
      const {data, error} = await deleteIssue(id);
      return {data, error};
    }

    return {create, edit, remove}
}
