'use client'

import React, { useState } from "react";
import { FieldValues, SubmitHandler, UseFormReturn, useForm } from "react-hook-form";
import Input from "../inputs/Input";
import Button from "../Button";
import { InputData } from "@/app/hooks/useGenericForm";



export type GenericProps = {
    onSumbit: SubmitHandler<FieldValues>,
    inputs : InputData[],
    useFormObject: UseFormReturn
  };

  const GenericForm = (props: GenericProps) => {
    const { register, formState } = props.useFormObject; // Use the resolver and register from useFormObject
  
    const [loading, setLoading] = useState<boolean>(false);
  
    const onSubmitHandler = props.useFormObject.handleSubmit((data) => {
      props.onSumbit(data);
    });

    //console.log(props.useFormObject.getValues())

    return (
      <div className="mt-8 sm:mx-auto sm:w-fullseparator sm:max-w-md">
        <div className="bg-white px-4 py-8 sm:rounded-lg sm:px-10 shadow">
          <form className="space-y-6" onSubmit={onSubmitHandler}>
            {props.inputs.map((input) => (
              <Input
                key={input.id}
                label={input.label}
                id={input.id}
                type={input.type}
                register={register}
                disabled={loading}
                errors={formState.errors} 
                placeHolder={input.placeHolder}
                required={input.required}
              />
            ))}
            <div>
              <Button
                type="submit"
                fullWidth
                disabled={loading}
              >
                Crear
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  

export default GenericForm;