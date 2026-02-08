import type { ReactNode } from "react";

export const metadata = {
  title: "Login | Kantin",
};

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
