import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
