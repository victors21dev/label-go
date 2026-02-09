import { Input } from "./ui/input";

interface InputComponetProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  title: string;
  type: string;
  placeholder: string;
  onValueChange: (value: string) => void;
}

const InputComponet = ({
  id,
  title,
  type,
  placeholder,
  onValueChange,
  ...rest
}: InputComponetProps) => {
  return (
    <div>
      <label className="font-bold">{title}</label>
      <Input
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full"
        key={id}
        type={type}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default InputComponet;
