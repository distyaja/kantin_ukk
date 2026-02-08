import Navbar from "@/components/navbar";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <Navbar></Navbar>
      {children}
    </div>
  );
}
