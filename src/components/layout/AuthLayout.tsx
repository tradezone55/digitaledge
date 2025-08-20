import React from "react";
import Logo from "../ui/Logo";
import { Link } from "react-router-dom";

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
  linkText = "Sign up",
  linkContent = "Already have an account?",
}) => {
  return (
    <div className="bg-gray-800 lg:p-8 py-12 px-2 text-center min-h-screen overflow-hidden flex flex-col items-center justify-center gap-3">
      <Link to="/">
        <Logo />
      </Link>
      <div>
        <p className="text-gray-400 w-full break-words">{description}</p>
      </div>
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 rounded-lg w-full max-w-xl shadow-lg shadow-gray">
        {children}
        <div className="flex items-center justify-between py-4">
          <p className="text-white text-sm">
            {linkContent} <Link to={link}>{linkText}</Link>
          </p>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          By continuing you agree to the terms and conditions and the privacy
          policy
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
