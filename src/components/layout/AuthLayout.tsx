import React from "react";
import Logo from "../ui/Logo";
import { Link } from "react-router-dom";
import LanguageSwitch from "../LanguageSwitch";
import { useTranslation } from "react-i18next";

interface AuthLayoutProps {
  children: React.ReactNode;
  description: string;
  link: string;
  linkText?: string;
  linkContent?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  description,
  link,
  linkText,
  linkContent,
}) => {
  const { t } = useTranslation(['auth', 'common']);
  return (
    <div className="bg-gray-800 lg:p-8 py-12 px-2 text-center min-h-screen overflow-hidden flex flex-col items-center justify-center gap-3">
      <div className="flex items-center justify-between w-full max-w-xl mb-4">
        <Link to="/">
          <Logo />
        </Link>
        <LanguageSwitch />
      </div>
      <div>
        <p className="text-gray-400 w-full break-words">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 rounded-lg w-full max-w-xl shadow-lg shadow-gray">
        {children}
        <p className="text-gray-400 text-sm mt-4">
          {t('auth:termsAndPrivacy')}
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
