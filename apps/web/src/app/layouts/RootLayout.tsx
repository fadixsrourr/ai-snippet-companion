import { PropsWithChildren } from "react";
import { NavBar } from "../ui/NavBar";

export function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <NavBar />
      <main className="max-w-5xl mx-auto p-6">{children}</main>
    </div>
  );
}
