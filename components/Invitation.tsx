"use client";

import { motion } from "framer-motion";
import {
  GROOM,
  BRIDE,
  PARENTS_FATHER,
  PARENTS_MOTHER,
} from "@/lib/constants";

export default function Invitation() {
  return (
    <section className="bg-bg px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="mx-auto max-w-lg text-center"
      >
        <h2 className="font-heading text-xs sm:text-sm tracking-[0.4em] uppercase text-accent mb-10">
          Тойға шақыру
        </h2>

        <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-white uppercase tracking-wider leading-snug mb-8">
          Құрметті қонақтар!
        </h3>

        <p className="font-body text-base sm:text-lg text-white-soft leading-relaxed mb-6">
          Сіздерді ұлымыз
        </p>

        <p className="font-script text-4xl sm:text-5xl text-white my-2">
          {GROOM} & {BRIDE}
        </p>

        <p className="font-body text-base sm:text-lg text-white-soft leading-relaxed mt-6">
          келініміздің шаңырақ көтеру тойына
          <br />
          арналған салтанатты
          <br />
          Ақ дастарханымыздың қадірлі
          <br />
          қонағы болуға шақырамыз!
        </p>

        <div className="divider mt-10" />

        <p className="mt-6 font-heading text-xs tracking-[0.3em] uppercase text-white-muted">
          той иелері
        </p>
        <p className="mt-3 font-heading text-xl sm:text-2xl font-medium text-white">
          {PARENTS_FATHER} – {PARENTS_MOTHER}
        </p>
      </motion.div>
    </section>
  );
}
