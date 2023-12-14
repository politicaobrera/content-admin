'use client'
import { SubmitHandler, UseFormReturn, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Section } from "../sections/types/sections";

export type InputData= {
    label: string,
    id: string,
    type: string,
    required?: boolean,
    placeHolder?: string,
    default?: any
}

export default function useGenericForm(inputs: InputData[], onSubmit: any, _id?:string) {
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
        fieldSchema = yup.string().matches(/^#[0-9A-Fa-f]{6}$/, "Invalid color format");
        break;
    default:
        fieldSchema = yup.string();
    }

    if (input.required) {
      fieldSchema = fieldSchema.required(`${input.label} es requerido`);
    }
    defaultValues[input.id] = input.default;
    
    schemaObject[input.id] = fieldSchema;

  }); 

  
  const schema = yup.object().shape(schemaObject);
  
  const useFormObject : UseFormReturn = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues
  })
  
  const onSubmitHandler : SubmitHandler<any> = useFormObject.handleSubmit((data) => {
    const transformedData = flatValuesToFinalObject(data);
    //console.log('id seccion:', id);
    if(_id) onSubmit(_id, transformedData);
    else onSubmit(transformedData); 
  });


  return { ...useFormObject, onSubmit: onSubmitHandler };
}

type NestedObject = {
  [key: string]: string | NestedObject;
};

export const flatValuesToFinalObject = (data: object) : any =>{ //only two level
  let result:NestedObject = {};

  const arrayData = Object.entries(data).map(array => {return array[0].split('_').concat(array[1])})

  for(let i=0; i<arrayData.length; i++){
    let level1Prop = arrayData[i][0];
    if(arrayData[i].length === 3){
      let level2Prop = arrayData[i][1];
      result = {...result, [level1Prop]: Object.assign(result[level1Prop] || {}, {[level2Prop]: arrayData[i][2]})}
    } 
    else result = {...result, [level1Prop]: arrayData[i][1]}
  }
  return result;
}
