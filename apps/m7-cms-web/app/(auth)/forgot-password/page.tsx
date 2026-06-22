import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Esqueceu a senha | M7 CMS",
  description: "Recupere sua senha do M7 CMS",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
