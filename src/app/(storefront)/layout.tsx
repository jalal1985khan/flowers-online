import React from "react";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { AIAssistantWidget } from "@/components/storefront/ai-assistant-widget";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 text-left">{children}</main>
      <Footer />
      {/* Floating Conversational AI Concierge on Every Storefront Page */}
      <AIAssistantWidget />
    </div>
  );
}
