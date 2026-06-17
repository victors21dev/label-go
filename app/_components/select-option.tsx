"use client";

import { SearchableSelect } from "./ui/searchable-select";

type OptionDetails = {
  id: string | number;
  name: string;
};

type SelectOptionProps = {
  title: string;
  dataoption: OptionDetails[];
  onValueChange: (value: string) => void;
};

const SelectOption = ({
  title,
  dataoption,
  onValueChange,
}: SelectOptionProps) => {
  return (
    <div>
      {title && <label className="font-bold">{title}</label>}
      <SearchableSelect
        onValueChange={onValueChange}
        placeholder="Escolha a opção..."
        options={dataoption.map((element) => ({
          value: element.name,
          label: element.name,
        }))}
        className="w-full"
      />
    </div>
  );
};

export default SelectOption;
