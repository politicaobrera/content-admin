'use client'
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('../components/inputs/BlockNoteEditor'), { ssr: false });
//import Editor from "../components/inputs/Editor";

const PruebasView = () => {
   return (
    <Editor id="prueba editor" label="Pruebas" initial={[]} onChange={(html:string) => console.log("html", html)}/>
  )
}

export default PruebasView