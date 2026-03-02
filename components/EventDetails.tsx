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
    <section className="px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-lg text-center"
      >
        <p className="ornament mb-4">❋</p>

        <div className="rounded-2xl border border-gold/20 bg-white/50 backdrop-blur-sm p-8 sm:p-12 shadow-sm">
          <h3 className="font-serif text-lg sm:text-xl text-text-light tracking-widest uppercase mb-6">
            Басталу уақыты
          </h3>

          <p className="font-serif text-3xl sm:text-4xl font-semibold text-text mb-2">
            {EVENT_DATE_DISPLAY}
          </p>

          <p className="font-serif text-2xl sm:text-3xl text-gold font-medium">
            {EVENT_TIME}
          </p>

          <div className="gold-divider" />

          <p className="font-serif text-lg sm:text-xl text-text leading-relaxed">
            {VENUE_CITY}
          </p>
          <p className="font-serif text-xl sm:text-2xl text-text font-semibold mt-1">
            {VENUE_NAME}
          </p>

          <a
            href={VENUE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-6 py-3 font-serif text-sm sm:text-base text-gold-dark transition-colors hover:bg-gold/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
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
            2ГИС картадан қарау
          </a>
        </div>

        <p className="mt-8 font-serif text-sm sm:text-base text-text-light leading-relaxed">
          Сіздерге ыңғайлы болуы үшін
          <br />
          2ГИС картаны пайдалануыңызды
          <br />
          сұраймыз!
        </p>
      </motion.div>
    </section>
  );
}
