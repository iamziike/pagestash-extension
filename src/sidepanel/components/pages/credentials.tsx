import CustomModal from "../ui/custom-modal";
import useSettings from "@/sidepanel/store/useSettings";
import ErrorText from "../ui/error-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { AlertOctagon } from "lucide-react";
import { Button } from "../ui/button";
import { cn, navigateWindowTo } from "@/utils";
import { OPENAI_CREATE_KEY_DOCS_URL } from "@/constants";
import { DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

const CredentialFormSchema = z.object({
  credential: z.string().min(5, "Credential must be more than 5 characters"),
});

const Credentials = () => {
  const settings = useSettings();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { handleSubmit, register, formState, clearErrors } = useForm<
    z.infer<typeof CredentialFormSchema>
  >({
    resolver: zodResolver(CredentialFormSchema),
  });

  const renderAddCredentialForm = () => {
    const handleFormClose = () => {
      clearErrors();
      setIsFormVisible(false);
    };

    const handleFormOpen = () => {
      setIsFormVisible(true);
    };

    return (
      <CustomModal
        size="xs"
        isOpen={isFormVisible}
        onClose={handleFormClose}
        trigger={
          <Button onClick={handleFormOpen}>
            {settings.credential ? "Update your API Key" : "Add your API Key"}
          </Button>
        }
      >
        <form
          className="space-y-3"
          onSubmit={handleSubmit(({ credential }) => {
            settings.updateState({
              credential,
            });
            handleFormClose();
            toast("API Key has been added successfully.");
          })}
        >
          <DialogHeader>
            <DialogTitle className="mb-3">Add Credentials</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              {...register("credential")}
              className={cn({ "error-field": formState.errors.credential })}
              placeholder="API Key"
            />
            <ErrorText
              className="text-center mt-1"
              label={formState.errors.credential?.message}
            />
          </div>
          <DialogFooter>
            <Button className="uppercase" type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </CustomModal>
    );
  };

  return (
    <div className="text-center mt-16 space-y-4">
      <AlertOctagon size={120} className="mx-auto" />
      <h1 className="font-extrabold text-2xl">Important Notice</h1>
      <div className="font-light">
        {settings.credential ? (
          <>
            An OpenAI API key is already set up in this app. <br />
            You can update it if needed.
          </>
        ) : (
          <>
            The OpenAI API key in this app is shared among multiple users.
            <br />
            For better performance, quicker response times, and enhanced
            security, we recommend using your own API key.
          </>
        )}
      </div>
      <div>
        {renderAddCredentialForm()}
        <div
          className="block text-under mt-4 underline text-secondary-foreground text-sm font-light underline-offset-[6px] cursor-pointer"
          onClick={() => navigateWindowTo(OPENAI_CREATE_KEY_DOCS_URL)}
        >
          Get an API Key
        </div>
      </div>
      <div className="fixed left-0 w-full bottom-5 font-light text-[10px]">
        Your data privacy and security are important to us.
      </div>
    </div>
  );
};

export default Credentials;
