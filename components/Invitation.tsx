"use client";

import { motion } from "framer-motion";
import {
  BRIDE,
  PARENTS_FATHER,
  PARENTS_MOTHER,
} from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export default function Invitation() {
  return (
    <section className="bg-white px-8 py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center"
      >
        <p className="font-heading text-gold text-lg tracking-wider mb-6">
          Сіздерді
        </p>

        <h2 className="font-heading text-2xl font-bold text-black uppercase tracking-wide leading-snug mb-6">
          Құрметті
          <br />
          қонақтар!
        </h2>

        <p className="font-script text-4xl text-black my-4">
          {BRIDE}
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="text-center mt-6"
      >
        <p className="font-body text-base text-text leading-relaxed">
          келініміздің шаңырақ көтеру тойына
          <br />
          арналған салтанатты
          <br />
          Ақ дастарханымыздың қадірлі
          <br />
          қонағы болуға шақырамыз!
        </p>

        <div className="w-12 h-px bg-gold mx-auto my-8" />

        <p className="font-heading text-xs tracking-[0.3em] uppercase text-gold-brown">
          той иелері
        </p>
        <p className="mt-2 font-heading text-lg font-semibold text-black">
          {PARENTS_FATHER} – {PARENTS_MOTHER}
        </p>
      </motion.div>
    </section>
  );
}
