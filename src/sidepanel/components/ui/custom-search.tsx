import CustomInput, { CustomInputProps } from "./custom-input";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface SearchFormValues {
  query: string | undefined;
}

interface Props extends Omit<CustomInputProps, "onChange"> {
  onChange(value: SearchFormValues): void;
  defaultValue?: string;
}

const CustomSearch = ({ onChange, ...props }: Props) => {
  const {
    handleSubmit: onSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: { query: props?.defaultValue },
  });

  const registerProps = register("query");

  useEffect(() => {
    reset({ query: props?.defaultValue });
  }, [props?.defaultValue, reset]);

  return (
    <form
      className="flex items-center justify-between"
      onSubmit={onSubmit(onChange)}
    >
      <CustomInput
        autoComplete="off"
        {...props}
        {...registerProps}
        onBlur={(event) => {
          registerProps.onBlur(event);
          props.onBlur?.(event);
        }}
      />
    </form>
  );
};

export default CustomSearch;
