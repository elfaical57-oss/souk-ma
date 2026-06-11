import { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Mon Panier | JemlaMaroc",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartClient />;
}
