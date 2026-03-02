"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EVENT_DATE } from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const labels = ["күн", "сағат", "минут", "секунд"] as const;

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return (
      <section className="py-20 text-center">
        <div className="h-32" />
      </section>
    );
  }

  const values = [time.days, time.hours, time.minutes, time.seconds];

  return (
    <section className="py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-xl text-center"
      >
        <p className="ornament mb-4">✦</p>
        <h2 className="font-serif text-xl sm:text-2xl text-text-light tracking-widest uppercase mb-10">
          Той салтанаты
        </h2>

        <div className="flex items-center justify-center gap-4 sm:gap-8">
          {values.map((val, i) => (
            <div key={labels[i]} className="flex flex-col items-center">
              <span className="block w-18 sm:w-24 h-18 sm:h-24 flex items-center justify-center rounded-xl border border-gold/30 bg-white/60 backdrop-blur-sm text-3xl sm:text-5xl font-serif font-semibold text-gold tabular-nums">
                {String(val).padStart(2, "0")}
              </span>
              <span className="mt-2 font-serif text-xs sm:text-sm text-text-light tracking-wider uppercase">
                {labels[i]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
