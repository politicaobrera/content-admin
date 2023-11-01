'use client'

import createSection from "@/app/actions/data/sections/createSection";
import GenericForm, { GenericProps } from "@/app/components/Form";

const SectionForm: React.FC = () => {

const formProps: GenericProps = {
    defaultValues: {
      name: ''
    },
    onSumbit: (data) => {
        createSection(data);
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
