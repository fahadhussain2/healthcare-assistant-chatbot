"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: Props) {
  const { user, error, isLoading: isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="h-full flex-grow md:p-4 w-full flex items-center justify-center">
        <Loader className="mx-auto my-auto animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh md:p-4 w-full flex items-center justify-center">
        ERROR
      </div>
    );
  }

  if (!user) {
    return redirect("/api/auth/login");
  }
  return <>{children}</>;
}
