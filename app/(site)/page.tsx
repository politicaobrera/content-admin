import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div 
      className="
        flex
        flex-col
        justify-center
        min-h-full
        py-12
        sm:px-6
        lg:px-8
        bg-gray-100
      "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image 
          alt="Politica Obrera"
          width="48"
          height="48"
          className="mx-auto w-64"
          src="./images/politica-obrera.svg"
        />
        <h2
          className="
            mt-6
            text-center
            text-2xl
            text-red-600
            tracking-tight
            font-bold
          "
        >
          Ingresá a tu cuenta
        </h2>
        <AuthForm />
      </div>
    </div>
  )
}
