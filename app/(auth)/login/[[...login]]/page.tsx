"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn path="/login" routing="path" />
    </div>
  );
}
