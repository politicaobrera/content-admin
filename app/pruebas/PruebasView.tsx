'use client'
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('../components/inputs/Editor'), { ssr: false });
//import Editor from "../components/inputs/Editor";

const PruebasView = () => {
   return (
    <Editor initial={[]} onChange={(html) => console.log("html", html)}/>
  )
}

export default PruebasView