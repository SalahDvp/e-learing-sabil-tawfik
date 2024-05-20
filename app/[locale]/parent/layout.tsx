"use client";

import { useUser } from "@/lib/auth";
import Header from "../components/Header";
import { redirect } from "@/navigation";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUser();

  
  if (user === false) return <>Auth loading...</>;
  if (!user) return redirect("/Auth");
  return (
      <div>
        <Header />
        {children}
      </div>

  );
}
