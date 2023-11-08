'use client'

import createSection from "@/app/actions/data/sections/createSection";
import GenericForm, { GenericProps } from "@/app/components/Form/GenericForm";
import useGenericForm from "@/app/hooks/useGenericForm";
import { useRouter } from "next/navigation"
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const SectionForm: React.FC = () => {

const router = useRouter();

const onSumbit = async (data: any) => {
  const result = await createSection(data);
  if (result?.error) {
    toast.error(result.error.message)
  }
  else{
    toast.success("Seccion creada")
    router.push('/sections')
    router.refresh()
  }
}

const inputs = [
  { 
    label: 'Nombre de Sección', 
    id: 'name', 
    type: 'text', 
    placeHolder: 'Movimiento Obrero',
    required: true
  },
  {
    label: 'Color',
    id: 'color',
    type: 'color',
    required: true,
    default: '#ffffff'
  },
]

const sectionsFormObject = useGenericForm(inputs)


  return (
    <div>
      <GenericForm inputs={inputs} onSumbit={onSumbit} useFormObject={sectionsFormObject} />
    </div>
  );
};

export default SectionForm;
