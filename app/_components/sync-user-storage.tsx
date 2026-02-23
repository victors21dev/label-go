// app/_components/sync-user-storage.tsx
"use client";
import { useEffect } from "react";

export function SyncUserStorage({ userData }: { userData: any }) {
  useEffect(() => {
    if (userData) {
      localStorage.setItem("user_cache", JSON.stringify(userData));
    }
  }, [userData]);

  return null;
}
