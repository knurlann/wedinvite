"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { RSVP_OPTIONS } from "@/lib/constants";

type Status = "idle" | "loading" | "success" | "error";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

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
      <section className="bg-white px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h3 className="font-heading text-2xl font-bold text-black mb-3">
            Рахмет!
          </h3>
          <p className="font-body text-base text-text-light">
            Жауабыңыз қабылданды.
            <br />
            Сізді күтеміз!
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="bg-white px-8 py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <p className="font-heading text-gold-brown text-sm tracking-wider mb-2">
            Сауалнама
          </p>
          <p className="font-heading text-base text-gold-brown leading-relaxed">
            тойға қатысуыңызды
            <br />
            растауыңызды сұраймыз:
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Аты-Жөніңіз"
              className="w-full border border-gray-300 rounded-md bg-white px-4 py-3 font-body text-sm text-text placeholder:text-gray-400 outline-none transition-colors focus:border-gold"
            />
          </div>

          <div>
            <p className="mb-3 font-body text-xs text-text-light">
              Жұбайыңызбен келсеңіз, есімдеріңізді бірге жаза кетіңіз
            </p>
            <div className="flex flex-col gap-2">
              {RSVP_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 py-1.5"
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
                    className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors ${
                      answer === option.value
                        ? "border-gold bg-gold"
                        : "border-gray-300"
                    }`}
                  >
                    {answer === option.value && (
                      <span className="block h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="font-body text-sm text-text">
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
              <p className="mb-2 font-body text-xs text-text-light">
                Неше адам болып келесіздер?
              </p>
              <input
                type="number"
                min="1"
                max="20"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full border border-gray-300 rounded-md bg-white px-4 py-3 font-body text-sm text-text outline-none transition-colors focus:border-gold"
              />
            </motion.div>
          )}

          <button
            type="submit"
            disabled={status === "loading" || !name || !answer}
            className="mt-2 w-full rounded-md bg-black py-3 font-heading text-xs tracking-[0.2em] uppercase text-white transition-opacity active:opacity-70 disabled:opacity-30"
          >
            {status === "loading" ? "Жіберілуде..." : "Жіберу"}
          </button>

          {status === "error" && (
            <p className="text-center font-body text-xs text-red-500">
              Қате пайда болды. Қайтадан көріңіз.
            </p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
