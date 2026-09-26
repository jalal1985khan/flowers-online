import type { Metadata } from "next";
import { CheckoutWizard } from "@/components/storefront/checkout/checkout-wizard";

export const metadata: Metadata = {
  title: "Secure Checkout",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutWizard />;
}
