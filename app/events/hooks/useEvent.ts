import { EventType } from "@/app/types/event";
import editEvent from "@/app/actions/data/events/editEvent";
import createEvent from "@/app/actions/data/events/createEvent";
import deleteEvent from "@/app/actions/data/events/deleteEvent";

export default function useEvent(){
    const edit = async (event: Partial<EventType>) : Promise<any> => {
        const {data, error} = await editEvent(event);
        return {data, error};
    }

    const create = async (event: Partial<EventType>) : Promise<any> => {
      const {data, error} = await createEvent(event);
      return {data, error};
    }

    const remove = async (id: string) : Promise<any> => {
      const {data, error} = await deleteEvent(id);
      return {data, error};
    }

    return {edit, create, remove}
}
