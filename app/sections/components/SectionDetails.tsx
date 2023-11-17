import MainContainer from "@/app/components/MainContainer"
import { Section } from "../types/sections"
import { iResponse } from "@/types/Responses"
import ErrorMessage from "@/app/components/ErrorMessage"
import getSectionById from "@/app/actions/data/sections/getSectionById"

const SectionDetails : React.FC<Section> =  (section) => {
   //TODO: Mostrar el preview de la seccion (etiqueta con color de fuente y fondo)
    return (
        <div>
            <h3>Sección : {section.name}</h3>
            <p>Color fuente: {section.style.color}</p>
            <p>Color fondo: {section.style.backgroundColor}</p>
        </div>
    )
}

export default SectionDetails;