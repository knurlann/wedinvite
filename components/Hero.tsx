"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BRIDE, EVENT_DATE, EVENT_DATE_DISPLAY } from "@/lib/constants";

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

export default function Hero() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const values = time
    ? [time.days, time.hours, time.minutes, time.seconds]
    : [0, 0, 0, 0];

  return (
    <section className="relative min-h-screen bg-black flex flex-col items-center justify-between py-10 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="text-center pt-8"
      >
        <h1 className="font-script text-[3.2rem] leading-none text-white">
          {BRIDE}
        </h1>
        <p className="mt-3 font-heading text-xs tracking-[0.2em] text-white/60">
          {EVENT_DATE_DISPLAY}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        className="text-center my-8"
      >
        <p className="font-script text-[2.8rem] leading-tight text-white">
        
        </p>
        <p className="font-heading text-sm tracking-[0.3em] text-white/50 my-2">
          мен
        </p>
        <p className="font-script text-[2.8rem] leading-tight text-white">
          {BRIDE}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 1, ease: "easeOut" }}
        className="w-full pb-4"
      >
        <div className="flex items-start justify-center">
          {values.map((val, i) => (
            <div key={labels[i]} className="flex items-start">
              <div className="flex flex-col items-center min-w-[50px]">
                <span className="font-heading text-[2.5rem] font-light text-white tabular-nums leading-none">
                  {String(val).padStart(2, "0")}
                </span>
                <span className="mt-1.5 font-body text-[9px] tracking-[0.15em] uppercase text-white/50">
                  {labels[i]}
                </span>
              </div>
              {i < 3 && (
                <span className="font-heading text-[2.5rem] font-light text-white/40 leading-none mx-1">
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
