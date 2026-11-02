import { WorkType } from "@/app/types/work";
import editWork from "@/app/actions/data/works/editWork";
import deleteWork from "@/app/actions/data/works/deleteWork";
import { iResponseOne } from "@/app/types/responses";

export default function useWork(){
    const edit = async (work: Partial<WorkType>) : Promise<iResponseOne<WorkType>> => {
        const {data, error} = await editWork(work);
        return {data, error};
    }

    const remove = async (id: string) : Promise<iResponseOne<WorkType>> => {
        const {data, error} = await deleteWork(id);
        return {data, error};
    }

    return {edit, remove}
}
