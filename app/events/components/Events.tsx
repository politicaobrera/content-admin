import getEvents from "@/app/actions/data/events/getEvents"
import { iResponseMany } from "@/app/types/responses"
import { EventType } from "@/app/types/event"
import ErrorMessage from "@/app/components/ErrorMessage"
import EventTable from "./EventTable"
import { Params } from "@/app/types/requests"

interface EventsProps {
  searchParams: Params;
}

const Events:React.FC<EventsProps> = async ({searchParams}) => {
  const {data, error, meta}:iResponseMany<EventType> = await getEvents(searchParams)
  if (error) {
    return <ErrorMessage error={error}/>
  }

  if(!data) {
    return(<div>No hay data</div>)
  }

  return (
    <div
      className="
        h-screen
      "
    >
      <EventTable
        events={data}
        meta={meta}
      />
    </div>
  )
}

export default Events
