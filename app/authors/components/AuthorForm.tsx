'use client'

import { FormType } from "@/types/form";
import { Author } from "../types/authors";
import useAuthorHook from "../hooks/useAuthorHook";
import useGenericForm, { InputData } from "@/app/hooks/useGenericForm";
import { useEffect } from "react";
import GenericForm from "@/app/components/Form/GenericForm";


const AuthorForm: React.FC<FormType<Author>> = (props: FormType<Author>) => {


const {create, edit} = useAuthorHook();

const onSumbit = props.edit && props.editInfo ? edit : create; 

const inputs : InputData[] = [
  { 
    label: 'Nombre del autor', 
    id: 'name', 
    type: 'text', 
    placeHolder: 'Jorge Altamira',
    required: true,
    default: props.edit ? props.editInfo?.name : ''
  },
  {
    label: 'Numero de Telefono',
    id: 'contact_phone',
    type: 'text',
    placeHolder: '+5411987654',
    required: false,
    default: props.edit ? props.editInfo?.contact?.phone : ''
  },
  {
    label: 'Email',
    id: 'contact_email',
    type: 'text',
    placeHolder: 'jorge-altamira@gmail.com',
    required: false,
    default: props.edit ? props.editInfo?.contact?.email : ''
  },
]

const {onSubmit: onSubmitTransformed, ...authorsFormObject} = useGenericForm(inputs, onSumbit, props.editInfo?._id)

console.log(authorsFormObject.getValues())

useEffect(()=>{},[authorsFormObject.watch()])

  return (
    <div>
      <GenericForm inputs={inputs} onSumbit={onSubmitTransformed} useFormObject={authorsFormObject} edit={props.edit}/>
      {/* <h2
          className="
            mt-6
            text-center
            text-xl
          text-black
            tracking-tight
            font-bold
            py-2
          "
        >Previsualizacion</h2>
      <SectionDetails {...flatValuesToFinalObject(sectionsFormObject.getValues())}/> */}
    </div>
  );
};

export default AuthorForm;
