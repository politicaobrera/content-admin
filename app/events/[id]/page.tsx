import MainContainer from "@/app/components/layout/MainContainer"
import { iResponseOne } from "@/app/types/responses"
import getEvent from "@/app/actions/data/events/getEvent"
import ErrorMessage from "@/app/components/ErrorMessage"
import EventForm from "../components/EventForm"
import { EventType } from "@/app/types/event"

const EventPage = async ({
  params,
} : {
  params: Promise<{ id: string }>,
}) => {

  const {id} = await params
  const {data, error}:iResponseOne<EventType> = await getEvent(id)

  if (error) {
    return <ErrorMessage error={error}/>
  }

  if (!data) {
    return <div>No hay Evento</div>
  }

  return (
    <MainContainer>
      <EventForm event={data}/>
    </MainContainer>
  )
}

export default EventPage
