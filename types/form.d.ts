export type FormType<T> = {
    edit?: boolean,
    editInfo?: T
}

export type FormProps<T> = {
    item: T
    onEdit?: (item: T) => void;
    onDelete?: (id: string) => void;
  };