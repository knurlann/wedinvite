"use client";

import { motion } from "framer-motion";

interface PhotoDividerProps {
  imageUrl: string;
}

export default function PhotoDivider({ imageUrl }: PhotoDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 1.5 }}
      className="w-full h-[55vw] max-h-[260px] overflow-hidden"
    >
      <div
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    </motion.div>
  );
}
