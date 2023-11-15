import { UseFormReturn, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

export type InputData= {
    label: string,
    id: string,
    type: string,
    required?: boolean,
    placeHolder?: string,
    default?: any
}

export default function useGenericForm(inputs: InputData[]) : UseFormReturn {
  const schemaObject: Record<string, yup.AnySchema> = {};
  const defaultValues: { [key: string]: any } = {};
  
  inputs.forEach((input) => {
    let fieldSchema;
    switch (input.type) {
    case "text":
        fieldSchema = yup.string();
        break;
    case "number":
        fieldSchema = yup.number();
        break;
    case "color":
        fieldSchema = yup.string()/* .matches(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"); */
        break;
    default:
        fieldSchema = yup.string();
    }

    if (input.required) {
      fieldSchema = fieldSchema.required(`${input.label} es requerido`);
    }
    defaultValues[input.id] = input.default /* || (input.type === 'text' ? '' : input.type === 'color' ? '#ffffff' : ''); */
    
    schemaObject[input.id] = fieldSchema;

  }); 

  const schema = yup.object().shape(schemaObject);

  const useFormObject = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues
  })

  return useFormObject;
}