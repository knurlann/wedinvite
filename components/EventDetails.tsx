"use client";

import { motion } from "framer-motion";
import {
  EVENT_DATE_DISPLAY,
  EVENT_TIME,
  VENUE_NAME,
  VENUE_CITY,
  VENUE_MAP_URL,
} from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export default function EventDetails() {
  return (
    <section className="bg-white px-8 py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <p className="font-heading text-gold text-sm tracking-[0.2em] uppercase mb-4">
          Той салтанаты
        </p>
        <p className="font-heading text-2xl font-bold text-black">
          {EVENT_DATE_DISPLAY}
        </p>
        <p className="font-body text-base text-text-light mt-2">
          Басталу уақыты: {EVENT_TIME}
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="text-center"
      >
        <p className="font-heading text-gold text-sm tracking-[0.2em] uppercase mb-4">
          Мекен-жайымыз
        </p>
        <p className="font-heading text-xl font-bold text-black">
          {VENUE_NAME}
        </p>
        <p className="font-body text-base text-text-light mt-1">
          {VENUE_CITY}
        </p>

        <a
          href={VENUE_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-black px-8 py-3 font-heading text-xs tracking-[0.2em] uppercase text-white transition-opacity active:opacity-70"
        >
          Картаға өту
        </a>
      </motion.div>
    </section>
  );
}
