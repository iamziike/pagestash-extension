import CustomInput from "../../custom-input";
import useBookmark from "@/sidepanel/store/useBookmark";
import { z } from "zod";
import { Label } from "../../label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../button";
import { Textarea } from "../../textarea";
import { BookmarkFormState } from "@/models";

type Props = Partial<BookmarkFormState> & {
  onComplete: VoidFunction;
};

const BookmarkFormSchema = z.object({
  title: z.string().min(2),
  desc: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

const BookmarkFolderForm = ({ onComplete, ...props }: Props) => {
  const { updateBookmark, addNewBookmark } = useBookmark();

  const {
    handleSubmit: onSubmit,
    register,
    formState,
  } = useForm<z.infer<typeof BookmarkFormSchema>>({
    resolver: zodResolver(BookmarkFormSchema),

    async defaultValues() {
      if (props.action === "update") {
        return {
          title: props?.bookmark?.title ?? "",
          desc: "",
          keywords: [],
        };
      }

      return {
        desc: "",
        keywords: [],
        title: "",
      };
    },
  });

  const handleSubmit = async (values: z.infer<typeof BookmarkFormSchema>) => {
    if (props.action === "update") {
      await updateBookmark(props?.bookmark?.id ?? "", {
        title: values.title,
      });
    }

    if (props.action === "create") {
      addNewBookmark({
        index: 0,
        parentId: props.parentId,
        title: values.title,
      });
    }

    onComplete();
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit(handleSubmit)}>
      <div className="space-y-5">
        <div className="">
          <Label className="space-y-2">
            <span>Folder Name</span>
            <CustomInput
              {...register("title")}
              placeholder="Title"
              isIconHidden
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

export default BookmarkFolderForm;
