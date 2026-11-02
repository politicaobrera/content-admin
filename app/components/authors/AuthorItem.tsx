import { AuthorType } from "@/app/types/author"
import { OptionType } from "@/app/types/select";
import { useRef } from "react";
import Select from 'react-select';

interface AuthorItemProps {
  author: AuthorType
  selectedDescription: string | undefined
  onChange: (author:AuthorType, description:string) => void
}
const defaultValue = {value: '', label: 'sin descripcion'}

const AuthorItem = ({author, selectedDescription, onChange}: AuthorItemProps) => {
  const selectRef = useRef(null)
  const currentValue = selectedDescription ? {value: selectedDescription, label: selectedDescription} : defaultValue
  const options = [defaultValue].concat(author.descriptions.map(desc => ({value: desc, label: desc})))

  const handleDescriptionChange = (val: OptionType|null) => {
    if(val) {
      onChange(author, val.value)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2 items-center border-2 border-gray-400 rounded-md p-2 mb-2">
      <span className="font-semibold text-gray-900">{author.name}</span>
      <Select
        options={options}
        ref={selectRef}
        defaultValue={currentValue}
        onChange={handleDescriptionChange}
      />
    </div>
  )
}

export default AuthorItem