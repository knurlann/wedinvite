"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  GROOM, BRIDE, PARENTS_FATHER, PARENTS_MOTHER,
  EVENT_DATE, EVENT_DATE_DISPLAY, EVENT_TIME,
  VENUE_NAME, VENUE_CITY, VENUE_MAP_URL, RSVP_OPTIONS,
} from "@/lib/constants";

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

function getCalendar() {
  const d = EVENT_DATE;
  const y = d.getFullYear(), m = d.getMonth(), td = d.getDate();
  const shift = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const names = ["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"];
  return { y, name: names[m], shift, days, td };
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 80 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-30px" } as const,
  transition: { duration: 2.5, delay, ease: "easeOut" as const },
});

type Status = "idle" | "loading" | "success" | "error";

export default function InvitePage() {
  const [time, setTime] = useState([0,0,0,0]);
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
          answer: RSVP_OPTIONS.find(o => o.value === answer)?.label ?? answer,
          guestCount: answer === "not_coming" ? 0 : Number(guestCount),
          timestamp: new Date().toLocaleString("ru-KZ", {
            day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Almaty",
          }),
        }),
      });
      if (!res.ok) throw new Error("fail");
      setFormStatus("success");
    } catch { setFormStatus("error"); }
  }

  const cal = getCalendar();
  const tl = mounted ? time : [0,0,0,0];
  const dayH = ["Дс","Сс","Ср","Бс","Жм","Сб","Жс"];

  return (
    <main className="w-full bg-white">

      {/* ══════ HERO ══════ */}
      <section className="relative w-full" style={{ height: "60vh", minHeight: 380 }}>
        <Image src="/img/hero-bg.png" alt="" fill className="object-cover object-top" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />

        <div className="absolute inset-0 z-10 flex flex-col items-center px-5 pt-4 pb-4">
          <Image src="/img/logo.svg" alt="" width={30} height={30} className="mx-auto" />

          <p className="mt-2 font-heading text-[9px] tracking-[0.35em] uppercase text-white/90">
            Тойға шақыру
          </p>
          <p className="font-script text-[1.8rem] text-white leading-none mt-1">
            {GROOM} & {BRIDE}
          </p>
          <p className="font-heading text-[8px] tracking-[0.2em] uppercase text-white/70 mt-1">
            {EVENT_DATE_DISPLAY}
          </p>

          <Image src="/img/gh.svg" alt="" width={36} height={36} className="mt-3" />

          <div className="flex-1" />

          {/* Countdown */}
          <div className="flex justify-center items-baseline font-heading text-white mb-1">
            {tl.map((v, i) => (
              <span key={i} className="flex items-baseline">
                <span className="text-[1.6rem] font-bold tabular-nums leading-none w-[2rem] text-center">
                  {String(v).padStart(2, "0")}
                </span>
                {i < 3 && <span className="text-[1.4rem] font-bold text-white/50 mx-[3px]">:</span>}
              </span>
            ))}
          </div>
          <div className="flex justify-center gap-[1.4rem] text-white/60 font-heading text-[8px] tracking-[0.15em] uppercase">
            <span>Күн</span><span>Сағат</span><span>Минут</span><span>Секунд</span>
          </div>
        </div>
      </section>

      {/* Ornament divider */}
      <div className="w-full"><Image src="/img/divider-line.svg" alt="" width={390} height={12} className="w-full h-auto" /></div>

      {/* ══════ ҚҰРМЕТТІ ҚОНАҚТАР ══════ */}
      <section className="bg-white px-8 pt-10 pb-6 text-center">
        <motion.p {...fade()} className="font-heading text-[#1a1a1a] text-[18px] font-bold uppercase tracking-[0.12em]">
          Құрметті қонақтар!
        </motion.p>

        <motion.p {...fade(0.1)} className="mt-4 font-heading text-[#1a1a1a] text-[14px] font-semibold">
          Сіздерді ұлымыз
        </motion.p>

        <motion.p {...fade(0.15)} className="mt-3 font-script text-[2.4rem] text-[#1a1a1a] leading-tight">
          {GROOM} мен {BRIDE}
        </motion.p>

        <motion.p {...fade(0.2)} className="mt-5 font-heading text-[#1a1a1a] text-[12px] leading-[2.2] uppercase tracking-[0.08em]">
          келініміздің шаңырақ көтеру
          <br />тойына арналған салтанатты
          <br />Ақ дастарханымыздың қадірлі
          <br />қонағы болуға шақырамыз!
        </motion.p>

        <motion.div {...fade(0.25)} className="flex justify-center my-6">
          <Image src="/img/ornament.svg" alt="" width={50} height={25} />
        </motion.div>

        <motion.p {...fade(0.3)} className="font-heading text-[#1a1a1a] text-[12px] uppercase tracking-[0.15em]">
          Той иелері:
        </motion.p>

        <motion.p {...fade(0.35)} className="mt-2 font-script text-[2rem] text-[#aa915d]">
          {PARENTS_FATHER} – {PARENTS_MOTHER}
        </motion.p>
      </section>

      {/* ══════ VENUE PHOTO ══════ */}
      <motion.div {...fade()} className="relative w-full h-[200px]">
        <Image src="/img/venue-photo.jpg" alt="" fill className="object-cover" />
      </motion.div>

      {/* ══════ ТОЙ САЛТАНАТЫ ══════ */}
      <section className="bg-white px-8 pt-10 pb-4 text-center">
        <motion.p {...fade()} className="font-script text-[2.2rem] text-[#aa915d]">
          Той салтанаты:
        </motion.p>

        <motion.div {...fade(0.1)} className="mt-3">
          <p className="font-heading text-[#1a1a1a] text-[13px] font-bold uppercase tracking-[0.08em]">
            {EVENT_DATE_DISPLAY}
          </p>
          <p className="font-heading text-[#1a1a1a] text-[13px] uppercase tracking-[0.08em] mt-0.5">
            Басталу уақыты: <span className="underline">{EVENT_TIME}</span>
          </p>
        </motion.div>
      </section>

      {/* ══════ CALENDAR ══════ */}
      <section className="bg-white px-6 pt-4 pb-6 flex flex-col items-center">
        <motion.div {...fade()} className="w-full max-w-[280px]">
          <div className="text-center mb-3">
            <p className="font-heading text-[#1a1a1a] text-[22px] font-bold uppercase tracking-[0.1em]">{cal.name}</p>
            <p className="font-heading text-[#1a1a1a] text-[22px] font-bold tracking-[0.05em]">{cal.y}</p>
          </div>

          <div className="grid grid-cols-7 text-center font-heading text-[12px]">
            {dayH.map(d => <span key={d} className="text-[#1a1a1a]/40 py-1.5 text-[10px] tracking-wider">{d}</span>)}
            {Array.from({ length: cal.shift }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: cal.days }).map((_, i) => {
              const day = i + 1;
              const hit = day === cal.td;
              return (
                <span key={day} className={`py-1.5 ${hit ? "text-[#aa915d] font-bold text-[15px] relative" : "text-[#1a1a1a]/70 text-[14px]"}`}>
                  {hit && <span className="absolute inset-0 flex items-center justify-center"><span className="w-8 h-8 rounded-full border-2 border-[#aa915d]" /></span>}
                  <span className="relative z-10">{day}</span>
                </span>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ══════ МЕКЕН-ЖАЙЫМЫЗ ══════ */}
      <section className="bg-white px-8 pt-4 pb-4 text-center">
        <motion.div {...fade()} className="flex justify-center mb-4">
          <Image src="/img/ornament.svg" alt="" width={50} height={25} />
        </motion.div>

        <motion.p {...fade(0.1)} className="font-script text-[2.2rem] text-[#aa915d]">
          Мекен-жайымыз:
        </motion.p>

        <motion.p {...fade(0.15)} className="mt-3 font-heading text-[#1a1a1a] text-[13px] leading-[2] uppercase tracking-[0.08em]">
          {VENUE_CITY},
          <br />{VENUE_NAME}
        </motion.p>

        <motion.div {...fade(0.2)} className="mt-5">
          <a href={VENUE_MAP_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block rounded-sm bg-[#aa915d] px-10 py-3 font-heading text-[12px] tracking-[0.2em] uppercase text-white">
            Картаға өту
          </a>
        </motion.div>

        <motion.div {...fade(0.25)} className="flex justify-center my-6">
          <Image src="/img/ornament.svg" alt="" width={50} height={25} />
        </motion.div>
      </section>

      {/* ══════ ТОЙ БАҒДАРЛАМАСЫ (Timeline) ══════ */}
      <section className="bg-white px-6 pt-2 pb-8">
        <motion.p {...fade()} className="text-center font-script text-[2.2rem] text-[#aa915d] mb-8">
          Той бағдарламасы:
        </motion.p>

        <motion.div {...fade(0.1)} className="relative mx-auto max-w-[300px]">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#aa915d]/20 -translate-x-1/2" />

          {[
            { time: "16:00", text: "Қонақтардың жиналуы", side: "left" as const },
            { time: "16:30", text: "Фотосессия, фуршет", side: "right" as const },
            { time: "17:00", text: "Тойдың басталуы, беташар", side: "left" as const },
            { time: "17:30", text: "Құдалардың қарсы алу", side: "right" as const },
            { time: "21:00", text: "Жас жұбайлардың вальсі", side: "left" as const },
            { time: "22:00", text: "Тойдың торты", side: "right" as const },
          ].map((item, i) => (
            <div key={i} className="relative flex items-center mb-5">
              <div className={`w-[46%] ${item.side === "left" ? "text-right pr-4" : ""}`}>
                {item.side === "left" && (
                  <>
                    <p className="font-heading text-[#aa915d] text-[15px] font-bold">{item.time}</p>
                    <p className="font-heading text-[#1a1a1a] text-[10px] uppercase tracking-[0.06em] leading-snug mt-0.5">{item.text}</p>
                  </>
                )}
              </div>
              <div className="w-[8%] flex justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#aa915d] relative z-10" />
              </div>
              <div className={`w-[46%] ${item.side === "right" ? "pl-4" : ""}`}>
                {item.side === "right" && (
                  <>
                    <p className="font-heading text-[#aa915d] text-[15px] font-bold">{item.time}</p>
                    <p className="font-heading text-[#1a1a1a] text-[10px] uppercase tracking-[0.06em] leading-snug mt-0.5">{item.text}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══════ САУАЛНАМА / RSVP (1:1 design-14) ══════ */}
      <section className="bg-white px-6 pt-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <p className="font-script text-[2.2rem] text-[#826547]">Сауалнама</p>
          <p className="mt-3 font-heading text-[#826547] text-[12px] leading-relaxed text-center max-w-[290px] mx-auto">
            тойға қатысуыңызды
            <br />
            растауыңызды сұраймыз:
          </p>
        </motion.div>

        {formStatus === "success" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <p className="font-script text-[2rem] text-[#826547] mb-2">Рахмет!</p>
            <p className="font-body text-[13px] text-[#1a1a1a]/70">Жауабыңыз қабылданды. Сізді күтеміз!</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 3, delay: 0.2, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="mx-auto max-w-[313px] flex flex-col gap-5"
          >
            <div>
              <label className="block font-heading text-[#1a1a1a] text-[11px] uppercase tracking-[0.1em] mb-2">
                Аты-Жөніңіз
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Есімдері"
                className="w-full bg-transparent border-0 border-b-2 border-[#d4c4a8] px-0 py-2.5 font-body text-[14px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 outline-none focus:border-[#826547] transition-colors"
              />
            </div>

            <div>
              <p className="font-heading text-[#1a1a1a] text-[11px] uppercase tracking-[0.08em] mb-3">
                Жұбайыңызбен келсеңіз, есімдеріңізді бірге жаза кетіңіз
              </p>
              <div className="flex flex-col gap-2">
                {RSVP_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 py-2 cursor-pointer border-b border-[#eee] last:border-0"
                  >
                    <input
                      type="radio"
                      name="rsvp"
                      value={opt.value}
                      checked={answer === opt.value}
                      onChange={e => setAnswer(e.target.value)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        answer === opt.value ? "border-[#826547] bg-[#826547]" : "border-[#c4b8a8]"
                      }`}
                    >
                      {answer === opt.value && <span className="block h-2 w-2 rounded-full bg-white" />}
                    </span>
                    <span className="font-body text-[13px] text-[#1a1a1a]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {answer && answer !== "not_coming" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.35 }}
              >
                <label className="block font-heading text-[#1a1a1a] text-[11px] uppercase tracking-[0.08em] mb-2">
                  Неше адам болып келесіздер?
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={guestCount}
                  onChange={e => setGuestCount(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-[#d4c4a8] px-0 py-2.5 font-body text-[14px] text-[#1a1a1a] outline-none focus:border-[#826547] transition-colors"
                />
              </motion.div>
            )}

            <button
              type="submit"
              disabled={formStatus === "loading" || !name || !answer}
              className="mt-2 w-full rounded-full bg-[#826547] py-3 font-heading text-[11px] tracking-[0.2em] uppercase text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {formStatus === "loading" ? "Жіберілуде..." : "Жауапты жіберу"}
            </button>

            {formStatus === "error" && (
              <p className="text-center font-body text-[12px] text-red-500">Қате пайда болды. Қайтадан көріңіз.</p>
            )}
          </motion.form>
        )}
      </section>

      {/* ══════ FOOTER ══════ */}
      <section className="bg-white px-8 pt-8 pb-12 text-center">
        <motion.div {...fade()}>
          <p className="font-script text-[2rem] text-[#826547] leading-snug">
            Қуанышымызға
            <br />ортақ болыңыздар!
          </p>
        </motion.div>
      </section>
    </main>
  );
}
