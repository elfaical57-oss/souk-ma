import { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Créer un compte | JemlaMaroc",
  description:
    "Inscrivez-vous sur JemlaMaroc en tant qu'acheteur ou vendeur. Rejoignez la marketplace B2B N°1 du Maroc.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
