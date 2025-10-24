import React, { useEffect } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import { sendMagicLink } from "../../services/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useLanguageNavigation } from "../../utils/navigation";

const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Please enter a valid email address' }),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

interface InputField {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  required: boolean;
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const { getLanguagePath } = useLanguageNavigation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
  });

  const inputLists: InputField[] = [
    {
      label: t('common:labels.email'),
      type: 'email',
      placeholder: t('common:labels.emailPlaceholder'),
      name: 'email',
      required: true,
    },
  ];

  // Check if user is in registration flow and redirect them
  useEffect(() => {
    const isInRegistrationFlow = localStorage.getItem('isInRegistrationFlow');
    if (isInRegistrationFlow === 'true') {
      toast.info(t('messages.profileSetupRequired'));
      navigate(getLanguagePath('home'));
    }
  }, [navigate, t, getLanguagePath]);

  const { mutate: sendLink, isPending } = useMutation({
    mutationFn: sendMagicLink,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(t('messages.magicLinkSent'));
      }
    },
    onError: () => {
      toast.error(t('messages.magicLinkError'));
    },
  });

  const onSubmit = (data: MagicLinkFormData) => {
    sendLink(data);
  };

  return (
    <AuthLayout
      description={t('login.title')}
      link=""
      linkText=""
      linkContent=""
    >
      <form
        action=""
        className="w-full space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {inputLists.map((input) => (
          <Input
            key={input.name.toString()}
            {...input}
            {...register(input.name as keyof MagicLinkFormData)}
            error={
              errors[input.name as keyof MagicLinkFormData] as unknown as {
                message: string;
              }
            }
            required={input.required}
          />
        ))}

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            className="w-full p-2 rounded-md bg-blue-600 text-white"
            disabled={isPending}
            loading={isPending}
            loadingText={t('common:buttons.sendingMagicLink')}
          >
            {t('common:buttons.sendMagicLink')}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
