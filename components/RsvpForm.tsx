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
          timestamp: new Date().toLocaleString("ru-KZ", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Almaty",
          }),
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
      <section className="bg-bg px-6 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md text-center"
        >
          <h3 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-4">
            Рахмет!
          </h3>
          <p className="font-body text-lg text-white-soft">
            Жауабыңыз қабылданды.
            <br />
            Сізді күтеміз!
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="bg-bg px-6 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-md"
      >
        <div className="text-center mb-10">
          <h2 className="font-heading text-xs sm:text-sm tracking-[0.4em] uppercase text-accent mb-4">
            Сауалнама
          </h2>
          <p className="font-heading text-xl sm:text-2xl font-semibold text-white uppercase tracking-wider">
            Тойға қатысуыңызды
            <br />
            растауыңызды сұраймыз
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block font-heading text-[10px] tracking-[0.2em] uppercase text-white-muted">
              Аты-жөніңіз
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Есімдері"
              className="w-full border-b border-border bg-transparent px-0 py-3 font-body text-base text-white placeholder:text-white-muted/40 outline-none transition-colors focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-3 block font-heading text-[10px] tracking-[0.2em] uppercase text-white-muted">
              Жұбайыңызбен келсеңіз, есімдеріңізді бірге жаза кетіңіз
            </label>
            <div className="flex flex-col gap-2">
              {RSVP_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-3 transition-all ${
                    answer === option.value
                      ? "border-accent bg-accent/10"
                      : "border-border bg-transparent hover:border-white-muted/30"
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
                    className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                      answer === option.value
                        ? "border-accent bg-accent"
                        : "border-white-muted/40"
                    }`}
                  >
                    {answer === option.value && (
                      <span className="block h-1.5 w-1.5 rounded-full bg-bg" />
                    )}
                  </span>
                  <span className="font-body text-sm text-white-soft">
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
              <label className="mb-2 block font-heading text-[10px] tracking-[0.2em] uppercase text-white-muted">
                Неше адам болып келесіздер?
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full border-b border-border bg-transparent px-0 py-3 font-body text-base text-white outline-none transition-colors focus:border-accent"
              />
            </motion.div>
          )}

          <button
            type="submit"
            disabled={status === "loading" || !name || !answer}
            className="mt-4 w-full border border-accent bg-transparent py-3 font-heading text-xs tracking-[0.3em] uppercase text-accent transition-all hover:bg-accent hover:text-bg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Жіберілуде..." : "Жіберу"}
          </button>

          {status === "error" && (
            <p className="text-center font-body text-sm text-red-400">
              Қате пайда болды. Қайтадан көріңіз.
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
