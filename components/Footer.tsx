"use client";

import { motion } from "framer-motion";
import { GROOM, BRIDE } from "@/lib/constants";

export default function Footer() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-md text-center"
      >
        <p className="ornament mb-6">✦ ✦ ✦</p>

        <h2 className="font-serif text-xl sm:text-2xl text-text leading-relaxed mb-4">
          Келіңіздер, қадірлі
          <br />
          қонағымыз болыңыздар!
        </h2>

        <div className="gold-divider" />

        <p className="mt-6 font-script text-4xl sm:text-5xl text-gold">
          {GROOM} & {BRIDE}
        </p>

        <p className="mt-12 font-serif text-xs text-text-light/60 tracking-wider">
          © 2026
        </p>
      </motion.div>
    </section>
  );
}
