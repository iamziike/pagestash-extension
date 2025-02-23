import CustomInput from "../../custom-input";
import useBookmark from "@/sidepanel/store/useBookmark";
import { z } from "zod";
import { Label } from "../../label";
import { Button } from "../../button";
import { useForm } from "react-hook-form";
import { Textarea } from "../../textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookmarkFormState } from "@/models";
import { cn, getCurrentTab } from "@/utils";

type Props = Partial<BookmarkFormState> & {
  onComplete: VoidFunction;
};

const BookmarkFormSchema = z.object({
  title: z.string().min(2),
  url: z.string().url("URL incorrect"),
  desc: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

const BookmarkLinkForm = ({ onComplete, ...props }: Props) => {
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
    }

    if (props.action === "create") {
      await addNewBookmark({
        index: 0,
        parentId: props.parentId,
        title: values.title,
        url: values.url,
      });
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

        <div className="">
          <Label className="space-y-2">
            <span>Description</span>
            <Textarea {...register("desc")} placeholder="Description" />
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
