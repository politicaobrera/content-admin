'use client'

import createSection from "@/app/actions/data/sections/createSection";
import GenericForm, { GenericProps } from "@/app/components/Form/GenericForm";
import useGenericForm, { InputData } from "@/app/hooks/useGenericForm";
import { useRouter } from "next/navigation"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Section, SectionFormType } from "../types/sections";
import useSectionHook from "../hooks/useSectionHook";

const SectionForm: React.FC<SectionFormType> = (props: SectionFormType) => {

const router = useRouter();

const {create, edit} = useSectionHook();

const onSumbit = props.edit && props.editInfo ? edit : create; 

const inputs : InputData[] = [
  { 
    label: 'Nombre de Sección', 
    id: 'name', 
    type: 'text', 
    placeHolder: 'Movimiento Obrero',
    required: true,
    default: props.edit ? props.editInfo?.name : 'Nombre por default'
  },
  {
    label: 'Color Fuente',
    id: 'style_color',
    type: 'color',
    required: true,
    default: props.edit ? props.editInfo?.style.color : '#000000'
  },
  {
    label: 'Color Fondo',
    id: 'style_backgroundColor',
    type: 'color',
    required: true,
    default: props.edit ? props.editInfo?.style.backgroundColor :'#ffffff'
  },
]

const {onSubmit: onSubmitTransformed, ...sectionsFormObject} = useGenericForm(inputs, onSumbit, props.editInfo?.id)


  return (
    <div>
      <GenericForm inputs={inputs} onSumbit={onSubmitTransformed} useFormObject={sectionsFormObject} edit={props.edit}/>
    </div>
  );
};

export default SectionForm;
