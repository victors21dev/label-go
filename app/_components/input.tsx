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
      <label className="font-bold text-sm">{title}</label>
      <Input
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-chart-2/40"
        key={id}
        type={type}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default InputComponet;
