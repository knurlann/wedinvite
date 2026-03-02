"use client";

import { motion } from "framer-motion";
import { GROOM, BRIDE } from "@/lib/constants";

export default function Footer() {
  return (
    <section className="bg-bg px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-md text-center"
      >
        <p className="font-heading text-xl sm:text-2xl font-semibold text-white uppercase tracking-wider mb-4">
          Қуанышымызға
          <br />
          ортақ болыңыздар!
        </p>

        <div className="divider" />

        <p className="mt-6 font-script text-4xl sm:text-5xl text-white">
          {GROOM} & {BRIDE}
        </p>

        <p className="mt-12 font-heading text-[10px] tracking-[0.2em] uppercase text-white-muted/40">
          2026
        </p>
      </motion.div>
    </section>
  );
}
