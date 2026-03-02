"use client";

import { motion } from "framer-motion";
import {
  EVENT_DATE_DISPLAY,
  EVENT_TIME,
  VENUE_NAME,
  VENUE_CITY,
  VENUE_MAP_URL,
} from "@/lib/constants";

export default function EventDetails() {
  return (
    <section className="bg-bg px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-lg">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h3 className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-6">
              Той салтанаты
            </h3>
            <p className="font-heading text-2xl sm:text-3xl font-semibold text-white mb-2">
              {EVENT_DATE_DISPLAY}
            </p>
            <p className="font-body text-lg text-white-soft">
              Басталу уақыты: {EVENT_TIME}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h3 className="font-heading text-xs tracking-[0.3em] uppercase text-accent mb-6">
              Мекен-жайымыз
            </h3>
            <p className="font-heading text-xl sm:text-2xl font-semibold text-white mb-2">
              {VENUE_NAME}
            </p>
            <p className="font-body text-base text-white-soft">{VENUE_CITY}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href={VENUE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-accent/40 px-8 py-3 font-heading text-sm tracking-wider uppercase text-accent transition-all hover:bg-accent hover:text-bg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            Картаға өту
          </a>
        </motion.div>
      </div>
    </section>
  );
}
