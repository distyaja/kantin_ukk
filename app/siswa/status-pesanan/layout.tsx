import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status Pesanan",
  description: "Lihat status pesanan Anda",
};

export default function StatusPesananLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
