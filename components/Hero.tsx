"use client";

import { motion } from "framer-motion";
import { GROOM, BRIDE } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <p className="ornament mb-6">✦ ✦ ✦</p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-script text-6xl sm:text-7xl md:text-8xl text-gold leading-tight"
        >
          {GROOM}
        </motion.h1>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="my-4 block font-serif text-2xl sm:text-3xl text-gold-light italic"
        >
          &
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-script text-6xl sm:text-7xl md:text-8xl text-gold leading-tight"
        >
          {BRIDE}
        </motion.h1>

        <div className="gold-divider mt-8" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-4 font-serif text-lg sm:text-xl text-text-light tracking-widest uppercase"
        >
          Үйлену тойы
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-gold-light text-sm tracking-[0.3em] uppercase"
        >
          ↓ жоғары жылжытыңыз ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
