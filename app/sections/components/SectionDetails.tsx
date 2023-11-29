import MainContainer from "@/app/components/MainContainer"
import { Section } from "../types/sections"
import { iResponse } from "@/types/Responses"
import ErrorMessage from "@/app/components/ErrorMessage"
import getSectionById from "@/app/actions/data/sections/getSectionById"

// interface SectionDetailsProps {
//     section: Section
// }

const SectionDetails : React.FC<Section> =  (section) => {
    const sectionStyle = {
        backgroundColor: section.style.backgroundColor,
        color: section.style.color,
        padding: "10px", // Ajusta el espaciado según tus necesidades
        borderRadius: "5px", // Agrega bordes redondeados si lo deseas
        display: "inline-block", // Permite que el div se comporte como un elemento en línea
      };
    
      return (
        <div style={sectionStyle}>
          <h3>{section.name}</h3>
        </div>
      );
}

export default SectionDetails;