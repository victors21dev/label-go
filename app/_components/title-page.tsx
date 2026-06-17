"use client";

import { motion } from "motion/react";
import { UserNav } from "./user-profile-button";

type TitleToPageProps = {
  title: string;
  description: string;
};

const TitleToPage = ({ title, description }: TitleToPageProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex justify-between items-center"
    >
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center">
        <UserNav />
      </div>
    </motion.header>
  );
};

export default TitleToPage;
