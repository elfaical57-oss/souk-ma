import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte JemlaMaroc pour accéder à votre boutique.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginClient />;
}
