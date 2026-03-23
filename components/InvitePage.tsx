"use client";

import { useEffect, useState, useRef, useCallback, type FormEvent } from "react";
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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 60 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, amount: 0.15 } as const,
  transition: { duration: 2.5, delay, ease: "easeOut" as const },
});

const kaz = { fontFamily: "'kaz', Arial, sans-serif" } as const;
const kazakh = { fontFamily: "'kazakh', Arial, sans-serif" } as const;

type Status = "idle" | "loading" | "success" | "error";

export default function InvitePage() {
  const [time, setTime] = useState([0,0,0,0]);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [formStatus, setFormStatus] = useState<Status>("idle");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) { a.pause(); setIsPlaying(false); }
    else { a.play().then(() => setIsPlaying(true)).catch(() => {}); }
  }, [isPlaying]);

  useEffect(() => {
    setMounted(true);
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);

    const audio = new Audio("/audio/toy-zhyry.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;
    setAudioReady(true);

    const autoPlay = () => {
      if (!audioRef.current) return;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    };
    const onInteraction = () => { autoPlay(); cleanup(); };
    const onScroll = () => { setTimeout(autoPlay, 300); cleanup(); };
    const cleanup = () => {
      document.removeEventListener("click", onInteraction);
      document.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("scroll", onScroll);
    };
    document.addEventListener("click", onInteraction, { once: true });
    document.addEventListener("touchstart", onInteraction, { once: true });
    window.addEventListener("scroll", onScroll, { once: true });
    audio.play().then(() => setIsPlaying(true)).catch(() => {});

    return () => { clearInterval(id); cleanup(); audio.pause(); audio.src = ""; };
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
          guestCount: answer === "not_coming" ? 0 : answer === "coming_with_spouse" ? 2 : 1,
          timestamp: new Date().toLocaleString("ru-KZ", {
            day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Almaty",
          }),
        }),
      });
      if (!res.ok) throw new Error("fail");
      setFormStatus("success");
      setShowSuccessPopup(true);
      setName("");
      setAnswer("");
    } catch { setFormStatus("error"); }
  }

  function closeSuccessPopup() {
    setShowSuccessPopup(false);
    setFormStatus("idle");
  }

  const cal = getCalendar();
  const tl = mounted ? time : [0,0,0,0];
  const dayH = ["Дс","Сс","Ср","Бс","Жм","Сб","Жс"];
  const heroMonths = ["ҚАҢТАР","АҚПАН","НАУРЫЗ","СӘУІР","МАМЫР","МАУСЫМ","ШІЛДЕ","ТАМЫЗ","ҚЫРКҮЙЕК","ҚАЗАН","ҚАРАША","ЖЕЛТОҚСАН"];
  const heroDateText = `${EVENT_DATE.getFullYear()} ЖЫЛ, ${EVENT_DATE.getDate()} ${heroMonths[EVENT_DATE.getMonth()]}`;

  return (
    <main className="mx-auto w-full max-w-[390px] bg-white">

      {/* ═══ HERO ═══ */}
      <section className="relative h-[670px] w-full overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/img/hero-bg.png')", backgroundPosition: "26% 0%", backgroundSize: "115%", backgroundRepeat: "no-repeat" }} />
        <div className="absolute inset-0 bg-[#110b02]/70" />

        {audioReady && (
          <motion.button type="button" onClick={toggleMusic} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="absolute left-[18px] top-[15px] z-20 flex h-[61px] w-[59px] items-center justify-center" aria-label={isPlaying ? "Музыканы тоқтату" : "Музыканы қосу"}>
            <Image src="/img/gh.svg" alt="" fill className="object-contain" priority />
            {!isPlaying && <span className="absolute inset-0 flex items-center justify-center text-[22px] text-white/80" aria-hidden>▶</span>}
          </motion.button>
        )}

        <div className="absolute inset-x-0 top-[63px] flex flex-col items-center text-center text-white">
          <p className="text-[10px] uppercase leading-[16px] tracking-[2px]" style={{ ...kaz, fontWeight: 200 }}>ТОЙҒА ШАҚЫРУ</p>
          <p className="mt-[4px] text-[30px] leading-[47px]" style={{ ...kaz, fontWeight: 900 }}>{GROOM} & {BRIDE}</p>
          <p className="mt-[12px] text-[8px] uppercase leading-[12px] tracking-[1.5px]" style={{ ...kaz, fontWeight: 200 }}>{heroDateText}</p>
          <div className="relative mt-[24px] h-[66px] w-[65px]"><Image src="/img/logo.svg" alt="" fill className="object-contain" /></div>
        </div>

        <div className="absolute inset-x-0 bottom-[60px] flex flex-col items-center text-center text-white">
          <p className="text-[30px] tabular-nums leading-[51px]" style={{ ...kazakh, fontWeight: 600 }}>
            {tl.map(v => String(v).padStart(2, "0")).join(" : ")}
          </p>
          <div className="mt-[4px] flex w-[251px] justify-between text-[8px] leading-[12px]" style={{ ...kaz, fontWeight: 200 }}>
            <span>күн</span><span>cағат</span><span>минут</span><span>секунд</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-[20px] w-full overflow-hidden">
          <motion.img src="/img/divider-line.svg" alt="" className="h-[19px] w-[556px] max-w-none" animate={{ x: [0, -162] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        </div>
      </section>

      {/* ═══ INVITATION ═══ */}
      <section className="bg-white px-10 pt-[50px] pb-[30px] text-center">
        <motion.p {...fadeUp()} className="text-[14px] uppercase leading-[22px] text-black" style={{ ...kaz, fontWeight: 200 }}>ҚҰРМЕТТІ ҚОНАҚТАР!</motion.p>
        <motion.p {...fadeUp(0.08)} className="mt-[18px] text-[11px] leading-[17px] text-black" style={{ ...kazakh, fontWeight: 600 }}>Сіздерді ұлымыз</motion.p>
        <motion.p {...fadeUp(0.16)} className="mt-[8px] text-[34px] leading-[53px] text-[#aa915d]" style={{ ...kaz, fontWeight: 900 }}>{GROOM} мен {BRIDE}</motion.p>
        <motion.p {...fadeUp(0.24)} className="mt-[4px] text-[11px] uppercase leading-[20px] text-black" style={{ ...kaz, fontWeight: 200 }}>
          келініміздің шаңырақ көтеру тойына арналған салтанатты<br />Ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!
        </motion.p>
        <motion.div {...fadeUp(0.32)} className="mt-[22px] flex justify-center"><Image src="/img/ornament.svg" alt="" width={69} height={34} /></motion.div>
        <motion.p {...fadeUp(0.4)} className="mt-[20px] text-[11px] uppercase leading-[17px] text-black" style={{ ...kaz, fontWeight: 200 }}>той иелері:</motion.p>
        <motion.p {...fadeUp(0.48)} className="mt-[2px] text-[30px] leading-[47px] text-[#aa915d]" style={{ ...kaz, fontWeight: 900 }}>{PARENTS_FATHER} - {PARENTS_MOTHER}</motion.p>
      </section>

      {/* ═══ VENUE PHOTO ═══ */}
      <section className="relative h-[250px] w-full">
        <Image src="/img/venue-photo.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </section>

      {/* ═══ DATE + TIME ═══ */}
      <section className="bg-white px-10 pt-[30px] pb-[10px] text-center">
        <motion.p {...fadeUp()} className="text-[33px] leading-[51px] text-[#aa915d]" style={{ ...kaz, fontWeight: 900 }}>Той салтанаты:</motion.p>
        <motion.p {...fadeUp(0.1)} className="mt-[4px] text-[12px] leading-[22px] text-black" style={{ ...kaz, fontWeight: 200 }}>
          {EVENT_DATE_DISPLAY}<br />Басталу уақыты: <span className="underline">{EVENT_TIME}</span>
        </motion.p>
      </section>

      {/* ═══ CALENDAR ═══ */}
      <section className="bg-white px-10 pt-[10px] pb-[30px] text-center">
        <motion.div {...fadeUp()} className="mx-auto w-full max-w-[280px]">
          <p className="text-[22px] font-bold uppercase tracking-[0.1em] text-black" style={kaz}>{cal.name}</p>
          <p className="text-[22px] font-bold tracking-[0.05em] text-black" style={kaz}>{cal.y}</p>
          <div className="mt-3 grid grid-cols-7 text-center text-[12px]" style={kaz}>
            {dayH.map(d => <span key={d} className="py-1.5 text-[10px] tracking-wider text-black/40">{d}</span>)}
            {Array.from({ length: cal.shift }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: cal.days }).map((_, i) => {
              const day = i + 1;
              const hit = day === cal.td;
              return (
                <span key={day} className={`relative py-1.5 ${hit ? "text-[15px] font-bold text-[#aa915d]" : "text-[14px] text-black/70"}`}>
                  {hit && <span className="absolute inset-0 flex items-center justify-center"><span className="h-8 w-8 rounded-full border-2 border-[#aa915d]" /></span>}
                  <span className="relative z-10">{day}</span>
                </span>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ═══ PLACE + MAP ═══ */}
      <section className="bg-white px-10 pt-[20px] pb-[40px] text-center">
        <motion.div {...fadeUp()} className="flex justify-center"><Image src="/img/ornament.svg" alt="" width={69} height={34} /></motion.div>
        <motion.p {...fadeUp(0.1)} className="mt-[14px] text-[33px] leading-[51px] text-[#aa915d]" style={{ ...kaz, fontWeight: 900 }}>Мекен - жайымыз:</motion.p>
        <motion.p {...fadeUp(0.18)} className="mt-[14px] text-[11px] uppercase leading-[20px] text-black" style={{ ...kaz, fontWeight: 200 }}>
          {VENUE_CITY},<br />{VENUE_NAME}
        </motion.p>
        <motion.div {...fadeUp(0.26)} className="mt-[20px] flex justify-center">
          <motion.a href={VENUE_MAP_URL} target="_blank" rel="noopener noreferrer" className="flex h-[37px] w-[204px] items-center justify-center rounded-[44px] bg-[#aa915d] no-underline" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <span className="text-[11px] leading-[20px] text-white" style={{ ...kaz, fontWeight: 200 }}>картаға өту</span>
          </motion.a>
        </motion.div>
        <motion.div {...fadeUp(0.34)} className="mt-[28px] flex justify-center"><Image src="/img/ornament.svg" alt="" width={69} height={34} /></motion.div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="bg-white px-6 pt-[10px] pb-[40px] text-center">
        <motion.p {...fadeUp()} className="mb-[32px] text-[33px] leading-[51px] text-[#aa915d]" style={{ ...kaz, fontWeight: 900 }}>Той бағдарламасы:</motion.p>
        <motion.div {...fadeUp(0.1)} className="relative mx-auto max-w-[300px]">
          <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-[#aa915d]/20" />
          {[
            { time: "16:00", text: "Қонақтардың жиналуы", side: "left" as const },
            { time: "16:30", text: "Фотосессия, фуршет", side: "right" as const },
            { time: "17:00", text: "Тойдың басталуы, беташар", side: "left" as const },
            { time: "17:30", text: "Құдалардың қарсы алу", side: "right" as const },
            { time: "21:00", text: "Жас жұбайлардың вальсі", side: "left" as const },
            { time: "22:00", text: "Тойдың торты", side: "right" as const },
          ].map((item, i) => (
            <div key={i} className="relative mb-5 flex items-center">
              <div className={`w-[46%] ${item.side === "left" ? "pr-4 text-right" : ""}`}>
                {item.side === "left" && <>
                  <p className="text-[15px] font-bold text-[#aa915d]" style={kaz}>{item.time}</p>
                  <p className="mt-0.5 text-[10px] uppercase leading-snug tracking-[0.06em] text-black" style={kaz}>{item.text}</p>
                </>}
              </div>
              <div className="flex w-[8%] justify-center"><span className="relative z-10 h-2.5 w-2.5 rounded-full bg-[#aa915d]" /></div>
              <div className={`w-[46%] ${item.side === "right" ? "pl-4" : ""}`}>
                {item.side === "right" && <>
                  <p className="text-[15px] font-bold text-[#aa915d]" style={kaz}>{item.time}</p>
                  <p className="mt-0.5 text-[10px] uppercase leading-snug tracking-[0.06em] text-black" style={kaz}>{item.text}</p>
                </>}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══ RSVP ═══ */}
      <section className="bg-white px-6 pt-[30px] pb-[40px] text-center">
        <motion.div {...fadeUp()} className="flex justify-center"><Image src="/img/ornament.svg" alt="" width={69} height={34} /></motion.div>
        <motion.p {...fadeUp(0.1)} className="mt-[14px] text-[32px] leading-[1.55] text-[#826547]" style={{ ...kaz, fontWeight: 900 }}>Сауалнама</motion.p>
        <motion.p {...fadeUp(0.18)} className="mx-auto mt-[15px] max-w-[290px] text-[12px] leading-[1.7] text-black" style={{ ...kaz, fontWeight: 200 }}>
          тойға қатысуыңызды<br />растауыңызды сұраймыз:
        </motion.p>

        <motion.form {...fadeUp(0.26)} onSubmit={handleSubmit} className="mx-auto mt-[24px] w-full max-w-[313px] text-left">
          <div className="mb-5">
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Аты-Жөніңіз"
              className="h-[50px] w-full border-0 border-b border-black bg-transparent px-0 text-[14px] leading-[1.33] text-black outline-none placeholder:uppercase placeholder:text-[#99928a]"
              style={{ ...kaz, fontWeight: 200 }} />
          </div>
          <div className="mb-6">
            <p className="mb-[5px] text-[10px] leading-[1.55] text-black" style={{ ...kaz, fontWeight: 200 }}>Жұбыңызбен келсеңіз, есімдеріңізді бірге жаза кетіңіз</p>
            <div className="mt-[20px] flex flex-col gap-[14px]">
              {RSVP_OPTIONS.map(opt => {
                const sel = answer === opt.value;
                return (
                  <label key={opt.value} className={`flex cursor-pointer items-center rounded-md px-1 py-1 transition-colors ${sel ? "bg-[#aa915d]/10" : ""}`}>
                    <input type="radio" name="rsvp" value={opt.value} checked={sel} onChange={e => setAnswer(e.target.value)} className="sr-only" />
                    <span className={`mr-[10px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${sel ? "border-[#aa915d] ring-2 ring-[#aa915d]/30" : "border-black/50"}`}>
                      <span className={`h-[10px] w-[10px] rounded-full transition-transform ${sel ? "scale-100 bg-[#aa915d]" : "scale-0 bg-transparent"}`} />
                    </span>
                    <span className={`text-[10px] leading-[1.55] transition-colors ${sel ? "text-[#6b5630]" : "text-black"}`} style={{ ...kaz, fontWeight: 200 }}>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center">
            <button type="submit" disabled={formStatus === "loading" || !name || !answer}
              className="h-[40px] w-[251px] rounded-[1px] border border-[#aa915d] bg-[#aa915d] text-center text-[16px] leading-none text-white transition-opacity disabled:opacity-50"
              style={{ ...kaz, fontWeight: 200 }}>
              {formStatus === "loading" ? "Жіберілуде..." : "Жауапты жіберу"}
            </button>
          </div>
          {formStatus === "error" && <p className="mt-3 text-center text-[12px] text-red-500" style={{ ...kaz, fontWeight: 200 }}>Қате пайда болды. Қайтадан көріңіз.</p>}
        </motion.form>
      </section>

      {/* ═══ FOOTER ═══ */}
      <section className="bg-white px-8 pt-[30px] pb-[60px] text-center">
        <motion.div {...fadeUp()}>
          <p className="text-[32px] leading-[1.55] text-[#826547]" style={{ ...kaz, fontWeight: 900 }}>
            Қуанышымызға<br />ортақ болыңыздар!
          </p>
        </motion.div>
      </section>

      {/* ═══ SUCCESS POPUP ═══ */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[1000000] bg-black/80" onClick={closeSuccessPopup} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Escape" || e.key === "Enter") closeSuccessPopup(); }}>
          <div className="absolute left-1/2 top-1/2 w-[350px] max-w-[calc(100vw-40px)] -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-white px-[40px] pt-[50px] pb-[50px] text-center" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={closeSuccessPopup} className="absolute right-[14px] top-[14px] text-black" aria-label="Жабу">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 23 23" fill="currentColor"><path d="M0 1.41L1.4 0l21.22 21.21-1.41 1.42z" /><path d="M21.21 0l1.42 1.4L1.4 22.63 0 21.21z" /></svg>
            </button>
            <svg className="mx-auto mb-[15px]" width="50" height="50" viewBox="0 0 50 50" fill="#62C584" aria-hidden="true">
              <path d="M25.1 49.28A24.64 24.64 0 0 1 .5 24.68 24.64 24.64 0 0 1 25.1.07a24.64 24.64 0 0 1 24.6 24.6 24.64 24.64 0 0 1-24.6 24.61zm0-47.45A22.87 22.87 0 0 0 2.26 24.68 22.87 22.87 0 0 0 25.1 47.52a22.87 22.87 0 0 0 22.84-22.84A22.87 22.87 0 0 0 25.1 1.83z" />
              <path d="M22.84 30.53l-4.44-4.45a.88.88 0 1 1 1.24-1.24l3.2 3.2 8.89-8.9a.88.88 0 1 1 1.25 1.26L22.84 30.53z" />
            </svg>
            <p className="text-[20px] font-bold text-black" style={kaz}>Жауабыңызға рақмет!</p>
          </div>
        </div>
      )}
    </main>
  );
}
