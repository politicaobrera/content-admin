import React from 'react';

type SectionProps = {
  section: {
    id: string;
    name: string;
  };
  onEdit?: (section: { id: string; name: string }) => void;
  onDelete?: (section: { id: string; name: string }) => void;
  onDetails?: (section: { id: string; name: string }) => void;
};

const SectionItem: React.FC<SectionProps> = ({ section, onEdit, onDelete, onDetails }) => {
  return (
    <li>
      {section.name}
      {onEdit && <button onClick={() => onEdit(section)}>Editar</button>}
      {onDelete && <button onClick={() => onDelete(section)}>Eliminar</button>}
      {onDetails && <button onClick={() => onDetails(section)}>Ver</button>}
    </li>
  );
};

export default SectionItem;
