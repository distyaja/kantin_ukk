import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Histori Pemesanan",
  description: "Lihat riwayat pesanan Anda",
};

export default function HistoriPemesananLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
