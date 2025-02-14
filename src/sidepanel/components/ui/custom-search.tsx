import CustomInput, { CustomInputProps } from "./custom-input";
import { useForm } from "react-hook-form";

interface SearchFormValues {
  query: string | undefined;
}

interface Props extends CustomInputProps {
  handleSubmit(value: SearchFormValues): void;
  defaultValue?: string;
}

const CustomSearch = ({ handleSubmit, ...props }: Props) => {
  const { handleSubmit: onSubmit, register } = useForm({
    defaultValues: { query: props?.defaultValue },
  });

  return (
    <form
      className="flex items-center justify-between"
      onSubmit={onSubmit(handleSubmit)}
    >
      <CustomInput
        autoComplete="off"
        onClear={onSubmit(handleSubmit)}
        {...props}
        {...register("query")}
      />
    </form>
  );
};

export default CustomSearch;
