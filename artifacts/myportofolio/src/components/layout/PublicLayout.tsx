import React from "react";
import Navbar from "./Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="py-8 border-t border-border mt-auto">
        <div className="container mx-auto px-4 max-w-7xl text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Fariz Jelang Ramadhan. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
