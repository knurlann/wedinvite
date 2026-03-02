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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 80 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 1.8, delay, ease: "easeOut" as const },
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

  return (
    <main className="relative w-full bg-white overflow-hidden">
      {/* ===== HERO SECTION - Dark background ===== */}
      <section className="relative bg-[#110b02] min-h-screen flex flex-col items-center px-6 pt-4 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="mt-3"
        >
          <Image src="/img/logo.svg" alt="" width={48} height={48} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="mt-6 font-script text-[2rem] text-white text-center leading-tight"
        >
          {GROOM} & {BRIDE}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="mt-2 font-heading text-[11px] tracking-[0.15em] text-white/60 text-center"
        >
          {EVENT_DATE_DISPLAY}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mt-8 font-script text-[2.4rem] text-white text-center leading-tight"
        >
          {GROOM} мен {BRIDE}
        </motion.p>

        <div className="flex-1" />

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="w-full"
        >
          <div className="flex justify-center items-start font-heading text-white">
            {[time.days, time.hours, time.minutes, time.seconds].map((val, i) => (
              <div key={i} className="flex items-start">
                <span className="text-[2rem] font-light tabular-nums leading-none min-w-[2.5rem] text-center">
                  {String(val).padStart(2, "0")}
                </span>
                {i < 3 && (
                  <span className="text-[2rem] font-light text-white/40 mx-1 leading-none">:</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 gap-[2.8rem] font-body text-[8px] tracking-[0.1em] text-white/50">
            <span>күн</span>
            <span>сағат</span>
            <span>минут</span>
            <span>секунд</span>
          </div>
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-6 w-full"
        >
          <Image
            src="/img/divider-line.svg"
            alt=""
            width={320}
            height={16}
            className="w-full h-auto"
          />
        </motion.div>
      </section>

      {/* ===== INVITATION - White background ===== */}
      <section className="bg-white px-8 pt-12 pb-8 text-center">
        <motion.p
          {...fadeUp()}
          className="font-heading text-[#aa915d] text-[2rem] font-bold leading-snug"
        >
          Сіздерді ұлымыз
        </motion.p>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-4 font-body text-black text-[11px] leading-relaxed"
        >
          ҚҰРМЕТТІ ҚОНАҚТАР!
        </motion.p>

        <motion.p
          {...fadeUp(0.3)}
          className="mt-4 font-body text-black text-[11px] leading-relaxed"
        >
          келініміздің шаңырақ көтеру тойына
          <br />
          арналған салтанатты
          <br />
          Ақ дастарханымыздың қадірлі
          <br />
          қонағы болуға шақырамыз!
        </motion.p>

        <motion.div {...fadeUp(0.4)} className="flex justify-center my-6">
          <Image src="/img/ornament.svg" alt="" width={57} height={28} />
        </motion.div>

        <motion.p
          {...fadeUp(0.5)}
          className="font-heading text-[#aa915d] text-[2rem] font-bold"
        >
          ТОЙҒА ШАҚЫРУ
        </motion.p>

        <motion.p
          {...fadeUp(0.5)}
          className="mt-3 font-heading text-[#aa915d] text-sm tracking-wider"
        >
          той иелері:
        </motion.p>

        <motion.p
          {...fadeUp(0.6)}
          className="mt-1 font-body text-black text-[11px]"
        >
          {PARENTS_FATHER} – {PARENTS_MOTHER}
        </motion.p>
      </section>

      {/* ===== VENUE PHOTO ===== */}
      <motion.div
        {...fadeUp()}
        className="relative w-full h-[205px] overflow-hidden"
      >
        <Image
          src="/img/venue-photo.jpg"
          alt="Мейрамхана"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* ===== EVENT DETAILS ===== */}
      <section className="bg-white px-8 pt-10 pb-6 text-center">
        <motion.p
          {...fadeUp()}
          className="font-heading text-[#aa915d] text-[2rem] font-bold leading-snug"
        >
          Той салтанаты:
        </motion.p>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-3 font-body text-black text-[12px] leading-relaxed"
        >
          {EVENT_DATE_DISPLAY}
          <br />
          Басталу уақыты: {EVENT_TIME}
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex justify-center my-6">
          <Image src="/img/ornament.svg" alt="" width={57} height={28} />
        </motion.div>

        <motion.p
          {...fadeUp(0.4)}
          className="font-heading text-[#aa915d] text-[2rem] font-bold leading-snug"
        >
          Мекен-жайымыз:
        </motion.p>

        <motion.p
          {...fadeUp(0.5)}
          className="mt-3 font-body text-black text-[12px] leading-relaxed"
        >
          {VENUE_CITY},
          <br />
          {VENUE_NAME}
        </motion.p>

        <motion.div {...fadeUp(0.6)} className="mt-6">
          <a
            href={VENUE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-[#aa915d] px-8 py-2.5 font-body text-[11px] tracking-wider text-white"
          >
            Картаға өту
          </a>
        </motion.div>

        <motion.div {...fadeUp(0.7)} className="flex justify-center my-6">
          <Image src="/img/ornament.svg" alt="" width={57} height={28} />
        </motion.div>

        <motion.p
          {...fadeUp(0.8)}
          className="font-heading text-[#aa915d] text-[2rem] font-bold leading-snug"
        >
          Той бағдарламасы:
        </motion.p>
      </section>

      {/* ===== DECORATIVE IMAGES ===== */}
      <section className="bg-white relative px-4 py-4">
        <motion.div {...fadeUp()} className="relative mx-auto w-[290px]">
          <div className="absolute -left-[88px] top-0 w-[158px] h-[158px] animate-spin-slow">
            <Image src="/img/flower-decor.svg" alt="" fill />
          </div>
          <Image
            src="/img/couple-photo.svg"
            alt=""
            width={290}
            height={436}
            className="relative z-10 w-full h-auto"
          />
          <div className="absolute -right-[40px] bottom-0 w-[156px] h-[156px] animate-spin-slow" style={{ animationDirection: "reverse" }}>
            <Image src="/img/flower-decor.svg" alt="" fill />
          </div>
        </motion.div>
      </section>

      {/* ===== RSVP FORM ===== */}
      <section className="bg-white px-6 pt-10 pb-8">
        <motion.div {...fadeUp()} className="text-center mb-6">
          <p className="font-heading text-[#826547] text-[2rem] font-bold">
            Сауалнама
          </p>
          <p className="mt-2 font-body text-[#826547] text-[12px] leading-relaxed">
            тойға қатысуыңызды
            <br />
            растауыңызды сұраймыз:
          </p>
        </motion.div>

        {formStatus === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <p className="font-heading text-[#826547] text-2xl font-bold mb-2">Рахмет!</p>
            <p className="font-body text-[12px] text-black/60">
              Жауабыңыз қабылданды. Сізді күтеміз!
            </p>
          </motion.div>
        ) : (
          <motion.form
            {...fadeUp(0.3)}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Аты-Жөніңіз"
              className="w-full border border-gray-300 rounded bg-white px-3 py-2.5 font-body text-[13px] text-black placeholder:text-gray-400 outline-none focus:border-[#aa915d]"
            />

            <div>
              <p className="mb-2 font-body text-[11px] text-black/50">
                Жұбайыңызбен келсеңіз, есімдеріңізді бірге жаза кетіңіз
              </p>
              {RSVP_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2.5 py-2 cursor-pointer"
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
                    className={`flex h-[16px] w-[16px] items-center justify-center rounded-full border-2 transition-colors ${
                      answer === option.value
                        ? "border-[#aa915d] bg-[#aa915d]"
                        : "border-gray-300"
                    }`}
                  >
                    {answer === option.value && (
                      <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="font-body text-[13px] text-black">
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
                <p className="mb-1.5 font-body text-[11px] text-black/50">
                  Неше адам болып келесіздер?
                </p>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full border border-gray-300 rounded bg-white px-3 py-2.5 font-body text-[13px] text-black outline-none focus:border-[#aa915d]"
                />
              </motion.div>
            )}

            <button
              type="submit"
              disabled={formStatus === "loading" || !name || !answer}
              className="mt-1 w-full rounded bg-[#aa915d] py-2.5 font-body text-[13px] tracking-wider text-white transition-opacity active:opacity-70 disabled:opacity-30"
            >
              {formStatus === "loading" ? "Жіберілуде..." : "Жіберу"}
            </button>

            {formStatus === "error" && (
              <p className="text-center font-body text-[11px] text-red-500">
                Қате пайда болды. Қайтадан көріңіз.
              </p>
            )}
          </motion.form>
        )}
      </section>

      {/* ===== FOOTER ===== */}
      <section className="bg-white px-8 pt-4 pb-12 text-center">
        <motion.div {...fadeUp()}>
          <p className="font-heading text-[#826547] text-[2rem] font-bold leading-snug">
            Қуанышымызға
            <br />
            ортақ болыңыздар!
          </p>
          <motion.div className="flex justify-center mt-6">
            <Image src="/img/decor-branch.svg" alt="" width={160} height={80} />
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
