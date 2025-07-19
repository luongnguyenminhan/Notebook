"use client";
import React, { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";

export default function AuthPage() {
  const t = useTranslations("AuthPage");
  const [showLogin, setShowLogin] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLoginSuccess = (tokenResponse?: any) => {
    if (tokenResponse && tokenResponse.access_token) {
      Cookies.set("access_token", tokenResponse.access_token, { path: "/" });
      setSuccessMsg(t("loginSuccess"));
      // Optionally: redirect or reload here
    }
  };

  const handleRegisterSuccess = () => {
    setShowLogin(true);
    setSuccessMsg(t("registerSuccess"));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {successMsg && (
        <div className="mb-4 text-green-600 font-medium">{successMsg}</div>
      )}
      {showLogin ? (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwap={() => setShowLogin(false)}
        />
      ) : (
        <RegisterForm
          onSuccess={handleRegisterSuccess}
          onSwap={() => setShowLogin(true)}
        />
      )}
    </div>
  );
}
