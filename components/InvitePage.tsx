"use client";

import { useEffect, useState, type FormEvent } from "react";
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

/* ── helpers ── */

function calcTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now();
  if (diff <= 0) return [0, 0, 0, 0];
  return [
    Math.floor(diff / 86400000),
    Math.floor((diff / 3600000) % 24),
    Math.floor((diff / 60000) % 60),
    Math.floor((diff / 1000) % 60),
  ];
}

function getCalendarData() {
  const d = EVENT_DATE;
  const year = d.getFullYear();
  const month = d.getMonth();
  const targetDay = d.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const shift = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const months = [
    "Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым",
    "Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан",
  ];
  return { year, monthName: months[month], shift, daysInMonth, targetDay };
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 80 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-30px" } as const,
  transition: { duration: 2.5, delay, ease: "easeOut" as const },
});

type Status = "idle" | "loading" | "success" | "error";

/* ── component ── */

export default function InvitePage() {
  const [time, setTime] = useState<number[]>([0, 0, 0, 0]);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [formStatus, setFormStatus] = useState<Status>("idle");

  useEffect(() => {
    setMounted(true);
    setTime(calcTimeLeft());
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
            day: "2-digit", month: "2-digit",
            hour: "2-digit", minute: "2-digit",
            timeZone: "Asia/Almaty",
          }),
        }),
      });
      if (!res.ok) throw new Error("fail");
      setFormStatus("success");
    } catch { setFormStatus("error"); }
  }

  const cal = getCalendarData();
  const timerLabels = ["күн", "сағат", "минут", "секунд"];
  const dayNames = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"];

  return (
    <main className="w-full bg-white">

      {/* ═══════════ HERO: photo + overlay ═══════════ */}
      <section className="relative w-full" style={{ height: "55vh", minHeight: 340 }}>
        <Image src="/img/hero-bg.png" alt="" fill className="object-cover object-top" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-between px-5 py-4">
          {/* Top cluster */}
          <div className="text-center">
            <Image src="/img/logo.svg" alt="" width={32} height={32} className="mx-auto" />
            <p className="mt-1 font-heading text-[8px] tracking-[0.35em] uppercase text-white/90">
              Тойға шақыру
            </p>
            <p className="mt-0.5 font-heading text-[8px] tracking-[0.15em] uppercase text-white/70">
              {EVENT_DATE_DISPLAY}
            </p>
          </div>

          {/* Names */}
          <div className="text-center">
            <p className="font-script text-[2.2rem] text-white leading-none drop-shadow-lg">
              {GROOM} & {BRIDE}
            </p>
          </div>

          {/* Bottom: countdown */}
          <div className="w-full">
            <div className="flex justify-center items-baseline font-heading text-white">
              {(mounted ? time : [0,0,0,0]).map((v, i) => (
                <span key={i} className="flex items-baseline">
                  <span className="text-[1.6rem] font-light tabular-nums leading-none w-[2rem] text-center">
                    {String(v).padStart(2, "0")}
                  </span>
                  {i < 3 && <span className="text-[1.2rem] font-light text-white/50 mx-[2px]">:</span>}
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-[1.2rem] mt-1 text-white/50 font-body text-[7px] tracking-[0.05em]">
              {timerLabels.map(l => <span key={l}>{l}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* Divider line */}
      <div className="w-full">
        <Image src="/img/divider-line.svg" alt="" width={390} height={12} className="w-full h-auto" />
      </div>

      {/* ═══════════ "ҚҰРМЕТТІ ҚОНАҚТАР" SECTION ═══════════ */}
      <section className="bg-white px-8 pt-10 pb-6 text-center">
        <motion.p {...fade()} className="font-heading text-[#1a1a1a] text-[16px] font-bold uppercase tracking-[0.15em]">
          Құрметті қонақтар!
        </motion.p>

        <motion.p {...fade(0.1)} className="mt-4 font-heading text-[#aa915d] text-[15px] italic">
          Сіздерді ұлымыз
        </motion.p>

        <motion.p {...fade(0.15)} className="mt-3 font-script text-[2.2rem] text-[#1a1a1a] leading-tight">
          {GROOM} мен {BRIDE}
        </motion.p>

        <motion.p {...fade(0.2)} className="mt-5 font-body text-[#1a1a1a] text-[14px] leading-[2] tracking-wide">
          келініміздің шаңырақ көтеру тойына
          <br />арналған салтанатты
          <br />Ақ дастарханымыздың қадірлі
          <br />қонағы болуға шақырамыз!
        </motion.p>

        <motion.div {...fade(0.25)} className="flex justify-center my-6">
          <Image src="/img/ornament.svg" alt="" width={48} height={24} />
        </motion.div>

        <motion.p {...fade(0.3)} className="font-heading text-[#aa915d] text-[15px] italic">
          той иелері:
        </motion.p>

        <motion.p {...fade(0.35)} className="mt-2 font-heading text-[#1a1a1a] text-[16px] font-semibold">
          {PARENTS_FATHER} – {PARENTS_MOTHER}
        </motion.p>
      </section>

      {/* ═══════════ CALENDAR ═══════════ */}
      <section className="bg-white px-6 pt-4 pb-8">
        <motion.div {...fade()} className="mx-auto max-w-[300px] border border-gray-200 rounded-lg p-5">
          <div className="text-center mb-4">
            <p className="font-heading text-[#1a1a1a] text-[18px] font-bold uppercase tracking-[0.25em]">
              {cal.monthName}
            </p>
            <p className="font-heading text-[#1a1a1a] text-[18px] font-bold tracking-[0.15em]">
              {cal.year}
            </p>
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center font-body text-[13px]">
            {dayNames.map(d => (
              <span key={d} className="text-[#1a1a1a]/40 font-semibold py-1">{d}</span>
            ))}
            {Array.from({ length: cal.shift }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: cal.daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isTarget = day === cal.targetDay;
              return (
                <span
                  key={day}
                  className={`py-1 ${
                    isTarget
                      ? "bg-[#aa915d] text-white rounded-full font-bold mx-auto w-7 h-7 flex items-center justify-center text-[14px]"
                      : "text-[#1a1a1a]/70"
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ═══════════ VENUE PHOTO ═══════════ */}
      <motion.div {...fade()} className="relative w-full h-[180px]">
        <Image src="/img/venue-photo.jpg" alt="" fill className="object-cover" />
      </motion.div>

      {/* ═══════════ EVENT DETAILS ═══════════ */}
      <section className="bg-white px-8 pt-10 pb-6 text-center">
        <motion.p {...fade()} className="font-heading text-[#aa915d] text-[15px] italic">
          Той салтанаты:
        </motion.p>
        <motion.p {...fade(0.05)} className="mt-3 font-heading text-[#1a1a1a] text-[16px] font-bold uppercase tracking-wide">
          {EVENT_DATE_DISPLAY}
        </motion.p>
        <motion.p {...fade(0.1)} className="mt-1 font-body text-[#1a1a1a] text-[14px] tracking-wide">
          Басталу уақыты: {EVENT_TIME}
        </motion.p>

        <motion.div {...fade(0.15)} className="flex justify-center my-6">
          <Image src="/img/ornament.svg" alt="" width={48} height={24} />
        </motion.div>

        <motion.p {...fade(0.2)} className="font-heading text-[#aa915d] text-[15px] italic">
          Мекен-жайымыз:
        </motion.p>
        <motion.p {...fade(0.25)} className="mt-3 font-body text-[#1a1a1a] text-[14px] leading-[1.8] tracking-wide">
          {VENUE_CITY},
          <br />{VENUE_NAME}
        </motion.p>

        <motion.div {...fade(0.3)} className="mt-6">
          <a
            href={VENUE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-[#aa915d] px-8 py-3 font-heading text-[12px] tracking-[0.2em] uppercase text-white"
          >
            Картаға өту
          </a>
        </motion.div>
      </section>

      {/* ═══════════ COUPLE ILLUSTRATION ═══════════ */}
      <section className="bg-white relative py-6 overflow-hidden">
        <motion.div {...fade()} className="relative mx-auto w-[260px]">
          <div className="absolute -left-[60px] -top-[10px] w-[130px] h-[130px] animate-spin-slow pointer-events-none opacity-60">
            <Image src="/img/flower-decor.svg" alt="" fill />
          </div>
          <Image src="/img/couple-photo.svg" alt="" width={260} height={390} className="relative z-10 w-full h-auto" />
          <div className="absolute -right-[30px] -bottom-[10px] w-[130px] h-[130px] animate-spin-slow pointer-events-none opacity-60" style={{ animationDirection: "reverse" }}>
            <Image src="/img/flower-decor.svg" alt="" fill />
          </div>
        </motion.div>
      </section>

      {/* ═══════════ RSVP ═══════════ */}
      <section className="bg-white px-6 pt-6 pb-4">
        <motion.div {...fade()} className="text-center mb-6">
          <p className="font-heading text-[#826547] text-[16px] font-bold uppercase tracking-[0.15em]">
            Сауалнама
          </p>
          <p className="mt-3 font-body text-[#826547] text-[14px] leading-relaxed tracking-wide text-center">
            тойға қатысуыңызды
            <br />растауыңызды сұраймыз:
          </p>
        </motion.div>

        {formStatus === "success" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
            <p className="font-heading text-[#826547] text-lg font-bold mb-2">Рахмет!</p>
            <p className="font-body text-[11px] text-black/60">Жауабыңыз қабылданды. Сізді күтеміз!</p>
          </motion.div>
        ) : (
          <motion.form {...fade(0.2)} onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text" value={name} onChange={e => setName(e.target.value)} required
              placeholder="Аты-Жөніңіз"
              className="w-full border border-gray-300 rounded bg-white px-3 py-2.5 font-body text-[12px] text-black placeholder:text-gray-400 outline-none focus:border-[#aa915d]"
            />
            <div>
              <p className="mb-2 font-body text-[10px] text-black/50 tracking-wide">
                Жұбайыңызбен келсеңіз, есімдеріңізді бірге жаза кетіңіз
              </p>
              {RSVP_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input type="radio" name="rsvp" value={opt.value} checked={answer === opt.value}
                    onChange={e => setAnswer(e.target.value)} className="sr-only" />
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                    answer === opt.value ? "border-[#aa915d] bg-[#aa915d]" : "border-gray-300"
                  }`}>
                    {answer === opt.value && <span className="block h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="font-body text-[12px] text-black">{opt.label}</span>
                </label>
              ))}
            </div>

            {answer && answer !== "not_coming" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
                <p className="mb-1 font-body text-[10px] text-black/50">Неше адам болып келесіздер?</p>
                <input type="number" min="1" max="20" value={guestCount}
                  onChange={e => setGuestCount(e.target.value)}
                  className="w-full border border-gray-300 rounded bg-white px-3 py-2.5 font-body text-[12px] text-black outline-none focus:border-[#aa915d]" />
              </motion.div>
            )}

            <button type="submit" disabled={formStatus === "loading" || !name || !answer}
              className="mt-1 w-full rounded bg-[#aa915d] py-2.5 font-body text-[11px] tracking-[0.15em] uppercase text-white active:opacity-70 disabled:opacity-30">
              {formStatus === "loading" ? "Жіберілуде..." : "Жауапты жіберу"}
            </button>
            {formStatus === "error" && (
              <p className="text-center font-body text-[10px] text-red-500">Қате пайда болды. Қайтадан көріңіз.</p>
            )}
          </motion.form>
        )}
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <section className="bg-white px-8 pt-6 pb-10 text-center">
        <motion.div {...fade()}>
          <p className="font-heading text-[#826547] text-[16px] font-bold leading-relaxed uppercase tracking-wider">
            Қуанышымызға
            <br />ортақ болыңыздар!
          </p>
          <div className="flex justify-center mt-4">
            <Image src="/img/decor-branch.svg" alt="" width={120} height={60} />
          </div>
        </motion.div>
      </section>
    </main>
  );
}
