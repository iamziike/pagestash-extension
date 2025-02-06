import { cn } from "@/utils";

interface Props {
  label?: React.ReactElement | string;
  className?: string;
}

const ErrorText = ({ label, className }: Props) => {
  return (
    <div className={cn(className, "text-destructive text-xs font-extrabold")}>
      {label}
    </div>
  );
};

export default ErrorText;
