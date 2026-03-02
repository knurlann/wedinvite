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
    return <section className="h-48 bg-bg" />;
  }

  const values = [time.days, time.hours, time.minutes, time.seconds];

  return (
    <section className="bg-bg py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1 }}
        className="mx-auto max-w-md px-6 text-center"
      >
        <div className="flex items-start justify-center gap-2 sm:gap-4">
          {values.map((val, i) => (
            <div key={labels[i]} className="flex items-start gap-2 sm:gap-4">
              <div className="flex flex-col items-center">
                <span className="font-heading text-4xl sm:text-6xl md:text-7xl font-light text-white tabular-nums">
                  {String(val).padStart(2, "0")}
                </span>
                <span className="mt-2 font-body text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white-muted">
                  {labels[i]}
                </span>
              </div>
              {i < 3 && (
                <span className="font-heading text-4xl sm:text-6xl md:text-7xl font-light text-accent">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
