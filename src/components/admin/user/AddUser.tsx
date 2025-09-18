import { CustomModal } from "@/components/ui/custom-modal";
import Input from "@/components/ui/Input";
import { ProfileSetupFormData, profileSetupSchema } from "@/schemas/auth";
import { setupProfile } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { useModalStore } from "@/stores/modalStore";
import { Plus } from "lucide-react";
import { adminCreateUserAPI } from "@/services/admin";

interface InputField {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  required: boolean;
}

const inputLists: InputField[] = [
  {
    label: "Full Name",
    type: "text",
    placeholder: "Enter full name",
    name: "name",
    required: true,
  },
  {
    label: "Email",
    type: "email",
    placeholder: "Enter email address",
    name: "email",
    required: true,
  },
];

const AddUser = () => {
  const { modal, onConfirm, onCancel } = useModalStore()
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      is_active: true,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: adminCreateUserAPI,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("New User added");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        onCancel()
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: ProfileSetupFormData) => {
    mutate(data);
  };
  return (
    <CustomModal title="Add New User" description="Add a new user to the system" open={modal.isOpen && modal.type === "create"} onOpenChange={(open: boolean) => {
      onConfirm({
        type: "create",
        isOpen: open,
      })
    }} trigger={
      <Button variant="secondary" className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-700">
        <Plus className="size-4" />
        Add User
      </Button>
    }>
      <form
        action=""
        className="w-full space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {inputLists.map((input) => (
          <Input
            key={input.name.toString()}
            {...input}
            {...register(input.name as keyof ProfileSetupFormData)}
            error={errors[input.name as keyof ProfileSetupFormData]}
            required={input.required}
          />
        ))}

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            className="w-full p-2 rounded-md bg-blue-600 text-white"
            disabled={isPending}
            loading={isPending}
            loadingText="Creating..."
          >
            Create
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};


export default AddUser;



