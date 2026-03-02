"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  GROOM,
  BRIDE,
  PARENTS_FATHER,
  PARENTS_MOTHER,
  EVENT_DATE,
  EVENT_DATE_DISPLAY,
  EVENT_TIME,
  VENUE_NAME,
  VENUE_CITY,
  VENUE_MAP_URL,
  RSVP_OPTIONS,
} from "@/lib/constants";
import type { FormEvent } from "react";

function calcTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 100 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-30px" },
  transition: { duration: 3, delay, ease: "easeOut" as const },
});

type Status = "idle" | "loading" | "success" | "error";

export default function InvitePage() {
  const [time, setTime] = useState(calcTimeLeft());
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [formStatus, setFormStatus] = useState<Status>("idle");

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !answer) return;
    setFormStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          answer: RSVP_OPTIONS.find((o) => o.value === answer)?.label ?? answer,
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
      if (!res.ok) throw new Error("fail");
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  }

  const timerVals = [time.days, time.hours, time.minutes, time.seconds];
  const timerLabels = ["күн", "сағат", "минут", "секунд"];

  return (
    <main className="relative w-full bg-white overflow-hidden">
      {/* ========== HERO - Full screen with background photo ========== */}
      <section className="relative min-h-[100svh] flex flex-col">
        <div className="absolute inset-0">
          <Image
            src="/img/hero-bg.png"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 flex flex-col items-center flex-1 px-5 pt-3">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
          >
            <Image src="/img/logo.svg" alt="" width={40} height={40} />
          </motion.div>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.3 }}
            className="mt-3 font-heading text-[10px] tracking-[0.35em] uppercase text-white"
          >
            Тойға шақыру
          </motion.p>

          {/* Names script */}
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="mt-2 font-script text-[1.7rem] text-white text-center leading-none"
          >
            {GROOM} & {BRIDE}
          </motion.h1>

          {/* Date */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.7 }}
            className="mt-1.5 font-heading text-[9px] tracking-[0.2em] uppercase text-white/80"
          >
            {EVENT_DATE_DISPLAY}
          </motion.p>

          {/* Large names */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 1 }}
            className="mt-6 font-script text-[2rem] text-white text-center leading-tight"
          >
            {GROOM} мен {BRIDE}
          </motion.p>

          {/* Decorative emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 1.2 }}
            className="mt-4"
          >
            <Image src="/img/gh.svg" alt="" width={44} height={44} />
          </motion.div>
        </div>

        {/* Couple photo overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="relative z-10 mx-auto w-[200px] mt-auto"
        >
          <Image
            src="/img/couple-photo.svg"
            alt=""
            width={200}
            height={300}
            className="w-full h-auto"
          />
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
          className="relative z-10 px-5 pb-3 mt-4"
        >
          <div className="flex justify-center items-start font-heading text-white">
            {timerVals.map((val, i) => (
              <div key={i} className="flex items-start">
                <span className="text-[1.8rem] font-light tabular-nums leading-none min-w-[2.2rem] text-center">
                  {String(val).padStart(2, "0")}
                </span>
                {i < 3 && (
                  <span className="text-[1.8rem] font-light text-white/40 mx-0.5 leading-none">:</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-1.5 text-white/50 font-body text-[7px] tracking-[0.1em]">
            {timerLabels.map((l, i) => (
              <span key={i} className="min-w-[2.2rem] text-center mx-0.5">{l}</span>
            ))}
          </div>
        </motion.div>

        {/* Divider line at bottom of hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="relative z-10 w-full pb-2 px-0"
        >
          <Image
            src="/img/divider-line.svg"
            alt=""
            width={390}
            height={12}
            className="w-full h-auto"
          />
        </motion.div>
      </section>

      {/* ========== INVITATION SECTION ========== */}
      <section className="bg-white px-10 pt-8 pb-4 text-center">
        <motion.p
          {...fade()}
          className="font-heading text-[#aa915d] text-[1.6rem] font-bold leading-snug"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Сіздерді ұлымыз
        </motion.p>

        <motion.p
          {...fade(0.1)}
          className="mt-3 font-body text-black text-[11px] leading-relaxed uppercase tracking-wider"
        >
          Құрметті қонақтар!
        </motion.p>

        <motion.p
          {...fade(0.15)}
          className="mt-3 font-body text-black text-[11px] leading-[1.8] uppercase tracking-wide"
        >
          Келініміздің шаңырақ көтеру тойына
          <br />
          арналған салтанатты
          <br />
          Ақ дастарханымыздың қадірлі
          <br />
          қонағы болуға шақырамыз!
        </motion.p>

        <motion.div {...fade(0.2)} className="flex justify-center my-5">
          <Image src="/img/ornament.svg" alt="" width={50} height={25} />
        </motion.div>

        <motion.p
          {...fade(0.25)}
          className="font-heading text-[#aa915d] text-[1.6rem] font-bold uppercase"
        >
          Тойға шақыру
        </motion.p>

        <motion.p
          {...fade(0.3)}
          className="mt-3 font-heading text-[#aa915d] text-[11px] tracking-wider uppercase"
        >
          той иелері:
        </motion.p>

        <motion.p
          {...fade(0.35)}
          className="mt-1 font-body text-black text-[11px] uppercase tracking-wide"
        >
          {PARENTS_FATHER} – {PARENTS_MOTHER}
        </motion.p>
      </section>

      {/* ========== VENUE PHOTO ========== */}
      <motion.div {...fade()} className="relative w-full h-[200px]">
        <Image src="/img/venue-photo.jpg" alt="" fill className="object-cover" />
      </motion.div>

      {/* ========== EVENT DETAILS ========== */}
      <section className="bg-white px-10 pt-8 pb-4 text-center">
        <motion.p
          {...fade()}
          className="font-heading text-[#aa915d] text-[1.6rem] font-bold leading-snug"
        >
          Той салтанаты:
        </motion.p>

        <motion.p
          {...fade(0.1)}
          className="mt-3 font-body text-black text-[11px] leading-[1.8] uppercase tracking-wide"
        >
          {EVENT_DATE_DISPLAY}
          <br />
          Басталу уақыты: {EVENT_TIME}
        </motion.p>

        <motion.div {...fade(0.15)} className="flex justify-center my-5">
          <Image src="/img/ornament.svg" alt="" width={50} height={25} />
        </motion.div>

        <motion.p
          {...fade(0.2)}
          className="font-heading text-[#aa915d] text-[1.6rem] font-bold leading-snug"
        >
          Мекен-жайымыз:
        </motion.p>

        <motion.p
          {...fade(0.25)}
          className="mt-3 font-body text-black text-[11px] leading-[1.8] uppercase tracking-wide"
        >
          {VENUE_CITY},
          <br />
          {VENUE_NAME}
        </motion.p>

        {/* Map button - gold rounded */}
        <motion.div {...fade(0.3)} className="mt-5">
          <a
            href={VENUE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-[#aa915d] px-7 py-2 font-body text-[11px] tracking-wider uppercase text-white"
          >
            Картаға өту
          </a>
        </motion.div>

        <motion.div {...fade(0.35)} className="flex justify-center my-5">
          <Image src="/img/ornament.svg" alt="" width={50} height={25} />
        </motion.div>

        <motion.p
          {...fade(0.4)}
          className="font-heading text-[#aa915d] text-[1.6rem] font-bold leading-snug"
        >
          Той бағдарламасы:
        </motion.p>
      </section>

      {/* ========== COUPLE ILLUSTRATION WITH ROTATING FLOWERS ========== */}
      <section className="bg-white relative py-4 overflow-visible">
        <motion.div {...fade()} className="relative mx-auto w-[280px] min-h-[420px]">
          <div className="absolute -left-[70px] top-0 w-[140px] h-[140px] animate-spin-slow pointer-events-none">
            <Image src="/img/flower-decor.svg" alt="" fill />
          </div>

          <Image
            src="/img/couple-photo.svg"
            alt=""
            width={280}
            height={420}
            className="relative z-10 mx-auto w-full h-auto"
          />

          <div
            className="absolute -right-[30px] bottom-[20px] w-[140px] h-[140px] animate-spin-slow pointer-events-none"
            style={{ animationDirection: "reverse" }}
          >
            <Image src="/img/flower-decor.svg" alt="" fill />
          </div>
        </motion.div>
      </section>

      {/* ========== SURVEY / RSVP ========== */}
      <section className="bg-white px-6 pt-8 pb-4">
        <motion.div {...fade()} className="text-center mb-5">
          <p className="font-heading text-[#826547] text-[1.6rem] font-bold">
            Сауалнама
          </p>
          <p className="mt-2 font-body text-[#826547] text-[11px] leading-relaxed uppercase tracking-wide text-center">
            Тойға қатысуыңызды
            <br />
            растауыңызды сұраймыз:
          </p>
        </motion.div>

        {formStatus === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <p className="font-heading text-[#826547] text-xl font-bold mb-2">Рахмет!</p>
            <p className="font-body text-[11px] text-black/60">
              Жауабыңыз қабылданды. Сізді күтеміз!
            </p>
          </motion.div>
        ) : (
          <motion.form
            {...fade(0.3)}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Аты-Жөніңіз"
              className="w-full border border-gray-300 rounded bg-white px-3 py-2.5 font-body text-[12px] text-black placeholder:text-gray-400 outline-none focus:border-[#aa915d]"
            />

            <div>
              <p className="mb-2 font-body text-[10px] text-black/50 uppercase tracking-wide">
                Жұбайыңызбен келсеңіз, есімдеріңізді бірге жаза кетіңіз
              </p>
              {RSVP_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="rsvp"
                    value={option.value}
                    checked={answer === option.value}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 transition-colors ${
                      answer === option.value
                        ? "border-[#aa915d] bg-[#aa915d]"
                        : "border-gray-300"
                    }`}
                  >
                    {answer === option.value && (
                      <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="font-body text-[12px] text-black uppercase tracking-wide">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {answer && answer !== "not_coming" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-1 font-body text-[10px] text-black/50 uppercase tracking-wide">
                  Неше адам болып келесіздер?
                </p>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full border border-gray-300 rounded bg-white px-3 py-2.5 font-body text-[12px] text-black outline-none focus:border-[#aa915d]"
                />
              </motion.div>
            )}

            <button
              type="submit"
              disabled={formStatus === "loading" || !name || !answer}
              className="mt-1 w-full rounded bg-[#aa915d] py-2.5 font-body text-[11px] tracking-[0.15em] uppercase text-white transition-opacity active:opacity-70 disabled:opacity-30"
            >
              {formStatus === "loading" ? "Жіберілуде..." : "Жауапты жіберу"}
            </button>

            {formStatus === "error" && (
              <p className="text-center font-body text-[10px] text-red-500">
                Қате пайда болды. Қайтадан көріңіз.
              </p>
            )}
          </motion.form>
        )}
      </section>

      {/* ========== FOOTER ========== */}
      <section className="bg-white px-8 pt-6 pb-10 text-center">
        <motion.div {...fade()}>
          <p className="font-heading text-[#826547] text-[1.6rem] font-bold leading-snug">
            Қуанышымызға
            <br />
            ортақ болыңыздар!
          </p>
          <div className="flex justify-center mt-4">
            <Image src="/img/decor-branch.svg" alt="" width={140} height={70} />
          </div>
        </motion.div>
      </section>
    </main>
  );
}
