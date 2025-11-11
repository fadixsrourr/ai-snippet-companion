// apps/web/src/app/App.tsx
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./ui/Navbar";
import Footer from "./ui/Footer";

export default function App() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 fx-dots" />
      <NavBar />

      <main className="relative flex-1 mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
