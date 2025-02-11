import MainContainer from "@/app/components/layout/MainContainer";
import SectionForm from "../components/SectionForm";

const NewSectionPage  = () => {
    return (
        <MainContainer>
            <div className="block h-full">
                <h1 className="
                  mt-6
                  text-center
                  text-2xl
                text-black
                  tracking-tight
                  font-bold
                ">
                  Nueva Sección
                </h1>
                <SectionForm/>
            </div>
        </MainContainer>
    )
}

export default NewSectionPage;