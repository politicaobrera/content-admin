'use client'

import GenericForm, { GenericProps } from "@/app/components/Form";

const SectionForm: React.FC = () => {

const formProps: GenericProps = {
    defaultValues: {
      name: ''
    },
    onSumbit: (data) => {
      // Lógica para manejar la presentación de datos del formulario
      console.log(data);
    },
    inputs: [
      { label: 'Nombre de Sección', id: 'name', type: 'text', placeHolder: 'Movimiento Obrero' },
    ],
  };

  return (
    <div>
      <GenericForm {...formProps} />
    </div>
  );
};

export default SectionForm;
