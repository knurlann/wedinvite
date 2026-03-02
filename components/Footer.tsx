"use client";

import { motion } from "framer-motion";
import { GROOM, BRIDE } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
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
        <p className="font-heading text-gold-brown text-base leading-relaxed mb-6">
          Қуанышымызға
          <br />
          ортақ болыңыздар!
        </p>

        <p className="font-script text-4xl text-black">
          {GROOM} & {BRIDE}
        </p>
      </motion.div>
    </section>
  );
}
