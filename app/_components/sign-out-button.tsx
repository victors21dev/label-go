"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { motion } from "motion/react";

export const SignOutButtonComponent = () => {
  const { signOut } = useClerk();

  return (
    <motion.button
      onClick={() => signOut({ redirectUrl: "/login" })}
      whileHover={{ scale: 1.1 }}
      className="flex w-full rounded-md px-3 py-2 gap-2 hover:bg-destructive cursor-pointer"
    >
      <div className="flex w-full gap-2 text-sm items-center">
        <LogOut size={16} />
        Sair
      </div>
    </motion.button>
  );
};
