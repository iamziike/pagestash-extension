import CustomInput from "../../custom-input";
import useBookmark from "@/sidepanel/store/useBookmark";
import { z } from "zod";
import { Label } from "../../label";
import { Button } from "../../button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookmarkFormState } from "@/models";
import { cn, getCurrentTab } from "@/utils";
import { toast } from "sonner";
import { titleCase } from "title-case";

type Props = Partial<BookmarkFormState> & {
  hasCustomCompleteMessage?: boolean;
  onComplete: VoidFunction;
};

const BookmarkFormSchema = z.object({
  title: z.string().min(2),
  url: z.string().url("URL incorrect"),
});

const BookmarkLinkForm = ({
  onComplete,
  hasCustomCompleteMessage,
  ...props
}: Props) => {
  const { updateBookmark, addNewBookmark } = useBookmark();
  const {
    handleSubmit: onSubmit,
    register,
    formState,
  } = useForm<z.infer<typeof BookmarkFormSchema>>({
    resolver: zodResolver(BookmarkFormSchema),
    mode: "all",
    reValidateMode: "onBlur",
    criteriaMode: "all",
    async defaultValues() {
      if (props.action === "update") {
        return {
          title: props?.bookmark?.title ?? "",
          url: props?.bookmark?.url ?? "",
          keywords: [],
          desc: "",
        };
      }

      const tab = await getCurrentTab();

      return {
        title: tab?.title ?? "",
        url: tab?.url ?? "",
        desc: "",
        keywords: [],
      };
    },
  });

  const handleSubmit = async (values: z.infer<typeof BookmarkFormSchema>) => {
    if (props.action === "update") {
      await updateBookmark(props?.bookmark?.id ?? "", {
        title: values.title,
        url: values.url,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      !hasCustomCompleteMessage && toast("Bookmark updated successfully");
    }

    if (props.action === "create") {
      await addNewBookmark({
        index: 0,
        parentId: props.parent?.id,
        title: values.title,
        url: values.url,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      !hasCustomCompleteMessage &&
        toast(`Added to ${titleCase(props?.parent?.title ?? "")}`);
    }

    onComplete();
  };

  return (
    <form className="space-y-3 flex-1" onSubmit={onSubmit(handleSubmit)}>
      <div className="space-y-5">
        <div className="">
          <Label className="space-y-2">
            <span>Title</span>
            <CustomInput
              {...register("title")}
              placeholder="Title"
              iconClassName="hidden"
              wrapperClassName={cn({
                "border border-destructive": formState.errors.title,
              })}
            />
          </Label>
        </div>
        <div className="">
          <Label className="space-y-2">
            <span>URL</span>
            <CustomInput
              {...register("url")}
              placeholder="URL"
              iconClassName="hidden"
              wrapperClassName={cn({
                "border border-destructive": formState.errors.url,
              })}
            />
          </Label>
        </div>
      </div>

      <Button
        disabled={!formState.isValid}
        className="block ms-auto pe-5 h-max w-max"
      >
        {props.action === "update" ? "Update" : "Add"}
      </Button>
    </form>
  );
};

export default BookmarkLinkForm;
