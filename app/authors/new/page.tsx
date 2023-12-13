import MainContainer from "@/app/components/MainContainer";
import AuthorForm from "../components/AuthorForm";

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
                  Nuevo Autor
                </h1>
                <AuthorForm/>
            </div>
        </MainContainer>
    )
}

export default NewSectionPage;