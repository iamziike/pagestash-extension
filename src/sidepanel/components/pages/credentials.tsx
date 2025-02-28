import CustomModal from "../ui/custom-modal";
import useSettings, { CredentialStore } from "@/sidepanel/store/useSettings";
import ErrorText from "../ui/error-text";
import CustomSelect from "../ui/custom-select";
import { z } from "zod";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertOctagon } from "lucide-react";
import { Form, FormField } from "../ui/form";
import { cn, navigateWindowTo } from "@/utils";
import { DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { titleCase } from "title-case";
import { DOCUMENTATION } from "@/constants";

const CredentialFormSchema = z.object({
  key: z.string().min(5, "Credential must be more than 5 characters"),
  provider: z.string(),
});

const providerOptions: { label: string; value: CredentialStore["type"] }[] = [
  { label: "Gemini", value: "gemini" },
];

const Credentials = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const settings = useSettings();
  const { credential } = settings;
  const form = useForm<z.infer<typeof CredentialFormSchema>>({
    resolver: zodResolver(CredentialFormSchema),
  });

  const renderAddCredentialForm = () => {
    const handleFormClose = () => {
      form.clearErrors();
      setIsFormVisible(false);
    };

    const handleFormOpen = () => {
      setIsFormVisible(true);
    };

    return (
      <CustomModal
        isOpen={isFormVisible}
        onOpenChange={setIsFormVisible}
        trigger={
          <Button onClick={handleFormOpen}>
            {credential?.isDefault ? "Add your API Key" : "Update your API Key"}
          </Button>
        }
      >
        <Form {...form}>
          <form
            className="space-y-3"
            onSubmit={form.handleSubmit(({ key, provider }) => {
              settings.updateState({
                credential: {
                  apiKey: key,
                  type: provider as CredentialStore["type"],
                },
              });
              handleFormClose();
              toast("API Key has been added successfully.");
            })}
          >
            <DialogHeader>
              <DialogTitle className="mb-3">
                {credential?.isDefault
                  ? "Add Credentials"
                  : "Update Credentials"}
              </DialogTitle>
            </DialogHeader>
            <div>
              <Input
                {...form.register("key")}
                className={cn({ "error-field": form.formState.errors.key })}
                placeholder="API Key"
              />
              <ErrorText
                className="text-center mt-1"
                label={form.formState.errors.key?.message}
              />
            </div>
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => {
                return (
                  <div>
                    <CustomSelect
                      placeholder="Provider"
                      onValueChange={field.onChange}
                      options={providerOptions}
                    />
                    <ErrorText
                      className="text-center mt-1"
                      label={form.formState.errors.provider?.message}
                    />
                  </div>
                );
              }}
            />

            <DialogFooter>
              <Button className="uppercase" type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </CustomModal>
    );
  };

  const handleReset = () => {
    const defaultCredentials = settings.getDefault().credential;
    settings.updateState({ credential: defaultCredentials });
    toast("Credentials has been reset to default");
  };

  return (
    <div className="text-center mt-16 space-y-4">
      <AlertOctagon size={120} className="mx-auto" />
      <h1 className="font-extrabold text-2xl">Important Notice</h1>
      <div className="font-light">
        {credential?.isDefault ? (
          <>
            The {titleCase(credential?.type)} API Key in this app is shared
            among multiple users.
            <br />
            For quicker response times and enhanced security, we recommend using
            your own.
          </>
        ) : (
          <>
            An {titleCase(credential?.type ?? "")} API Key is already set up in
            this app. <br />
            You can update it if needed.
          </>
        )}
      </div>
      <div>
        <div className="grid justify-center gap-5 flex-col">
          {renderAddCredentialForm()}

          {!credential?.isDefault && (
            <Button onClick={handleReset} className="px-4">
              Remove Existing API Key
            </Button>
          )}
        </div>

        {credential?.type && (
          <div
            className="block text-under mt-4 underline text-secondary-foreground text-sm font-light underline-offset-[6px] cursor-pointer"
            onClick={() => navigateWindowTo(DOCUMENTATION[credential.type])}
          >
            Get an API Key
          </div>
        )}
      </div>
      <div className="fixed left-0 w-full bottom-5 font-light text-[10px]">
        Your data privacy and security are important to us.
      </div>
    </div>
  );
};

export default Credentials;
