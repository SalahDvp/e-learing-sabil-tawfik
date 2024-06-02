"use client";

import { useUser } from "@/lib/auth";
import { redirect } from "@/navigation";
import { MainNav } from "../components/nav-bar";
import { HeaderNav } from "../components/header";
import { FetchParentDataProvider } from "@/context/parent/fetchDataContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUser();

  
  if (user === false) return <>Auth loading...</>;
  if (!user) return redirect("/Auth");
  if(user.role!="parent")return redirect("/dashboard");
  return (
    <FetchParentDataProvider user={user}>
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        
        <MainNav/>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <HeaderNav/>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {children}
        </main>
        </div>
    
      </div>
      </FetchParentDataProvider>
  );
}
