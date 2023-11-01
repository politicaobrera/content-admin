'use client'

import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./inputs/Input";
import Button from "./Button";

export type InputData= {
    label: string,
    id: string,
    type: string,
    placeHolder?: string
}

export type GenericProps = {
    defaultValues: FieldValues,
    onSumbit: SubmitHandler<FieldValues>,
    inputs : InputData[]
  };

const GenericForm = (props : GenericProps) => {
    const { register, handleSubmit, formState: { errors } } = 
    useForm<FieldValues>({ defaultValues: props.defaultValues });
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmitHandler = handleSubmit((data) => {
        props.onSumbit(data);
      });
    

    return(
        <div
        className="
          mt-8
          sm:mx-auto
          sm:w-fullseparator
          sm:max-w-md
        "
        >
            <div
            className="
                bg-white
                px-4
                py-8
                sm:rounded-lg
                sm:px-10
                shadow
            "
            >
                <form className="space-y-6" onSubmit={onSubmitHandler}>
                    {props.inputs.map((input) => (
                    <Input
                        key={input.id}
                        label={input.label}
                        id={input.id}
                        type={input.type}
                        register={register}
                        disabled={loading}
                        errors={errors}
                        placeHolder={input.placeHolder}
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
    )
} 

export default GenericForm;