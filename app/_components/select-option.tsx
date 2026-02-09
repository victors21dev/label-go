"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
      <label className="font-bold">{title}</label>
      <Select onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Escolha a opção..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {dataoption.map((element) => (
              <SelectItem key={element.id} value={element.name}>
                {element.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectOption;
