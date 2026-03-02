"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { RSVP_OPTIONS } from "@/lib/constants";

type Status = "idle" | "loading" | "success" | "error";

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !answer) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          answer:
            RSVP_OPTIONS.find((o) => o.value === answer)?.label ?? answer,
          guestCount: answer === "not_coming" ? 0 : Number(guestCount),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="px-6 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md text-center"
        >
          <p className="ornament mb-4">✦</p>
          <h3 className="font-script text-4xl sm:text-5xl text-gold mb-4">
            Рахмет!
          </h3>
          <p className="font-serif text-lg text-text-light">
            Жауабыңыз қабылданды.
            <br />
            Сізді күтеміз!
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-md text-center"
      >
        <p className="ornament mb-4">❋</p>
        <h2 className="font-serif text-xl sm:text-2xl text-text-light tracking-widest uppercase mb-2">
          Тойға қатысуыңызды
        </h2>
        <h2 className="font-serif text-xl sm:text-2xl text-text-light tracking-widest uppercase mb-10">
          растауыңызды сұраймыз
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 text-left"
        >
          <div>
            <label className="mb-2 block font-serif text-sm text-text-light tracking-wider uppercase">
              Аты-жөніңіз
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Есімдері"
              className="w-full rounded-xl border border-gold/30 bg-white/60 px-4 py-3 font-serif text-base text-text placeholder:text-text-light/50 outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/30"
            />
          </div>

          <div>
            <label className="mb-3 block font-serif text-sm text-text-light tracking-wider uppercase">
              Жұбайыңызбен келсеңіз, есімдеріңізді бірге жаза кетіңіз
            </label>
            <div className="flex flex-col gap-3">
              {RSVP_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                    answer === option.value
                      ? "border-gold bg-gold/10"
                      : "border-gold/20 bg-white/40 hover:border-gold/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="rsvp"
                    value={option.value}
                    checked={answer === option.value}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                      answer === option.value
                        ? "border-gold bg-gold"
                        : "border-gold/40"
                    }`}
                  >
                    {answer === option.value && (
                      <span className="block h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="font-serif text-base text-text">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {answer && answer !== "not_coming" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <label className="mb-2 block font-serif text-sm text-text-light tracking-wider uppercase">
                Неше адам болып келесіздер?
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full rounded-xl border border-gold/30 bg-white/60 px-4 py-3 font-serif text-base text-text outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/30"
              />
            </motion.div>
          )}

          <button
            type="submit"
            disabled={status === "loading" || !name || !answer}
            className="mt-2 rounded-full bg-gold px-8 py-3 font-serif text-base font-medium text-white tracking-wider uppercase transition-all hover:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Жіберілуде..." : "Жіберу"}
          </button>

          {status === "error" && (
            <p className="text-center font-serif text-sm text-red-500">
              Қате пайда болды. Қайтадан көріңіз.
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
