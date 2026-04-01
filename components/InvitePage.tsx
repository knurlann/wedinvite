"use client";

import { useEffect, useState, useRef, useCallback, type FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  BRIDE, PARENTS_FATHER, PARENTS_MOTHER,
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

type Status = "idle" | "loading" | "success" | "error";

export default function InvitePage() {
  const [time, setTime] = useState([0,0,0,0]);
  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);
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

    const audio = new Audio("/audio/MOLDANAZAR_-_Mahabbatym_(SkySound.cc).mp3");
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;
    setAudioReady(true);

    return () => { clearInterval(id); audio.pause(); audio.src = ""; };
  }, []);

  function handleOpen() {
    setOpened(true);
    const a = audioRef.current;
    if (a) a.play().then(() => setIsPlaying(true)).catch(() => {});
  }

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

  if (!opened) {
    return (
      <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#110b02] text-white" style={kaz}>
        <div className="absolute inset-0" style={{ backgroundImage: "url('/img/hero-bg.png')", backgroundPosition: "center", backgroundSize: "cover", opacity: 0.35 }} />
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <p className="text-[12px] uppercase tracking-[3px] leading-[20px]" style={{ fontWeight: 200 }}>Ұзату тойына ШАҚЫРУ</p>
          <br />
          <p className="mt-[12px] text-[42px] leading-[58px]" style={{ fontWeight: 900 }}>{BRIDE}</p>
          <br />
          <motion.button
            type="button"
            onClick={handleOpen}
            className="mt-[50px] h-[50px] w-[220px] rounded-full border-2 border-[#aa915d] bg-transparent text-[15px] uppercase tracking-[2px] text-[#aa915d] transition-colors hover:bg-[#aa915d] hover:text-white"
            style={{ fontWeight: 200 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Ашу
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full bg-white">

      {/* ═══ HERO ═══ */}
      <section className="relative aspect-[430/739] w-full overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "url('/img/hero-bg.png')", backgroundPosition: "center 20%", backgroundSize: "cover", backgroundRepeat: "no-repeat" }} />
        {/* <div className="absolute inset-0 bg-[#110b02]/70" /> */}

        {audioReady && (
          <motion.button type="button" onClick={toggleMusic} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="absolute left-[18px] top-[16px] z-20 flex h-[61px] w-[59px] items-center justify-center" aria-label={isPlaying ? "Музыканы тоқтату" : "Музыканы қосу"}>
            <Image src="/img/gh.svg" alt="" fill className="object-contain" priority />
            <span className="absolute inset-0 flex items-center justify-center text-[22px] text-white/80" aria-hidden>{isPlaying ? "❚❚" : "▶"}</span>
          </motion.button>
        )}

        <div className="absolute inset-x-0 top-0 h-[35%] pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div className="absolute inset-x-0 top-[70px] flex flex-col items-center text-center text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)' }}>
          <p className="text-[13px] uppercase leading-[20px] tracking-[2px]" style={{ ...kaz, fontWeight: 200 }}>Ұзату тойына ШАҚЫРУ</p>
          <p className="mt-0 text-[38px] leading-[58px]" style={{ ...kaz, fontWeight: 900 }}>{BRIDE}</p>
          <p className="mt-[12px] text-[10px] uppercase leading-[16px] tracking-[1.5px]" style={{ ...kaz, fontWeight: 200 }}>{heroDateText}</p>
          {/* <div className="relative h-[66px] w-[65px]" style={{ marginTop: '70px' }}><Image src="/img/logo.svg" alt="" fill className="object-contain" /></div> */}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
        <div className="absolute inset-x-0 bottom-[80px] flex items-end justify-center text-center text-white" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)' }}>
          <div className="flex items-center" style={kaz}>
            {tl.map((v, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <span className="tabular-nums text-[38px] leading-[62px]" style={{ fontWeight: 200 }}>{String(v).padStart(2, "0")}</span>
                  <span className="text-[10px] leading-[16px]" style={{ fontWeight: 200 }}>{["күн", "cағат", "минут", "секунд"][i]}</span>
                </div>
                {i < 3 && <span className="self-start text-[38px] leading-[62px]" style={{ fontWeight: 200, marginLeft: '16px', marginRight: '16px' }}>:</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-[20px] w-full overflow-hidden">
          <motion.img src="/img/divider-line.svg" alt="" className="h-[19px] w-[556px] max-w-none" animate={{ x: [0, -162] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        </div>
      </section>

      {/* ═══ INVITATION ═══ */}
      <section className="bg-white px-[18%] pb-[15px] text-center" style={{ paddingTop: '60px' }}>
        <motion.p {...fadeUp()} className="text-[18px] uppercase leading-[28px] text-black" style={{ ...kaz, fontWeight: 200 }}>
          ҚҰРМЕТТІ ҚОНАҚТАР!
        </motion.p>

        <motion.p {...fadeUp(0.08)} className="mt-[16px] text-[14px] leading-[22px] text-black" style={{ ...kaz, fontWeight: 200 }}>
          Сіздерді аяулы қызымыз
        </motion.p>
        <motion.p {...fadeUp(0.16)} className="mt-[7px] text-[42px] leading-[64px] text-[#aa915d]" style={{ ...kaz, fontWeight: 900 }}>
          Тоқжанның
        </motion.p>

        <motion.p {...fadeUp(0.24)} className="mt-0 text-center text-[14px] uppercase leading-[25px] text-black" style={{ ...kaz, fontWeight: 200 }}>
          қыз ұзату тойына арналған<br />
          салтанатты ақ дастарханымыздың  <br />
          қадірлі қонағы болуға шақырамыз!<br />
          <br />
        </motion.p>

        <motion.div {...fadeUp(0.32)} className="mt-[20px] flex justify-center">
          <Image src="/img/ornament.svg" alt="" width={69} height={34} />
        </motion.div>

        <motion.p {...fadeUp(0.4)} className="mt-[22px] text-[14px] uppercase leading-[22px] text-black" style={{ ...kaz, fontWeight: 200 }}>
          той иелері:
        </motion.p>

        <motion.p {...fadeUp(0.48)} className="text-[38px] leading-[58px] text-[#aa915d]" style={{ ...kaz, fontWeight: 900, marginBottom: '30px' }}>
        Тимур - Гаухар
        </motion.p>
      </section>

      {/* ═══ VENUE PHOTO ═══ */}
      <section className="relative aspect-[430/276] w-full">
        <Image src="/img/venue-photo.png" alt="" fill className="object-cover" />
        {/* <div className="absolute inset-0 bg-black/40" /> */}
      </section>

      {/* ═══ DATE + TIME ═══ */}
      <section className="bg-white px-[12%] pt-[28px] pb-[20px] text-center">
        <motion.p {...fadeUp()} className="text-[40px] leading-[62px] text-[#aa915d]" style={{ ...kaz, fontWeight: 900 }}>Той салтанаты:</motion.p>
        <motion.p {...fadeUp(0.1)} className="mt-[3px] text-[15px] leading-[27px] text-black" style={{ ...kaz, fontWeight: 200, marginBottom: '30px' }}>
          {EVENT_DATE_DISPLAY}<br />Басталу уақыты: <span className="underline">{EVENT_TIME}</span>
        </motion.p>
      </section>

      {/* ═══ CALENDAR ═══ */}
      <section className="flex justify-center bg-white px-[14%] pt-[20px] pb-[16px]">
        <motion.div {...fadeUp()} className="w-full max-w-[280px]" style={kaz}>
          <div className="grid grid-cols-7 text-center text-[14px]">
            {dayH.map(d => <span key={d} className="py-1.5 text-[13px] tracking-wider text-black/40">{d}</span>)}
            {Array.from({ length: cal.shift }).map((_, i) => <span key={`e${i}`} />)}
            {Array.from({ length: cal.days }).map((_, i) => {
              const day = i + 1;
              const hit = day === cal.td;
              return (
                <span key={day} className={`relative py-1.5 ${hit ? "text-[18px] font-bold text-[#aa915d]" : "text-[17px] text-black/70"}`}>
                  {hit && <span className="absolute inset-0 flex items-center justify-center"><span className="h-9 w-9 rounded-full border-2 border-[#aa915d]" /></span>}
                  <span className="relative z-10">{day}</span>
                </span>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ═══ PLACE + MAP ═══ */}
      <section className="bg-white px-[12%] pt-[20px] pb-0 text-center">
        <motion.div {...fadeUp()} className="flex justify-center"><Image src="/img/ornament.svg" alt="" width={69} height={34} /></motion.div>
        <motion.p {...fadeUp(0.1)} className="mt-[10px] text-[40px] leading-[62px] text-[#aa915d]" style={{ ...kaz, fontWeight: 900 }}>Мекен - жайымыз:</motion.p>
        <motion.p {...fadeUp(0.18)} className="mt-[4px] text-[14px] uppercase leading-[25px] text-black" style={{ ...kaz, fontWeight: 200 }}>
          {VENUE_CITY},<br />{VENUE_NAME}
        </motion.p>
        <motion.div {...fadeUp(0.26)} className="mt-[20px] flex justify-center">
          <motion.a href={VENUE_MAP_URL} target="_blank" rel="noopener noreferrer" className="flex h-[44px] w-[240px] items-center justify-center rounded-[44px] bg-[#aa915d] no-underline" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <span className="text-[14px] leading-[25px] text-white" style={{ ...kaz, fontWeight: 200 }}>картаға өту</span>
          </motion.a>
        </motion.div>
        <br />
        <motion.div {...fadeUp(0.34)} className="mt-[32px] flex justify-center"><Image src="/img/ornament.svg" alt="" width={69} height={34} /></motion.div>
      </section>

 

      {/* ═══ RSVP ═══ */}
      <section className="bg-white pt-[32px] pb-[27px] text-center">
        {/* <motion.div {...fadeUp()} className="flex justify-center"><Image src="/img/ornament.svg" alt="" width={69} height={34} /></motion.div> */}
        <motion.p {...fadeUp(0.1)} className="mt-[28px] text-[38px] leading-[60px] text-[#826547]" style={{ ...kaz, fontWeight: 900 }}>Сауалнама</motion.p>
        <motion.p {...fadeUp(0.18)} className="mt-[20px] text-[15px] leading-[25px] text-black" style={{ ...kaz, fontWeight: 200 }}>
          тойға қатысуыңызды<br />растауыңызды сұраймыз:
        </motion.p>

        <motion.form {...fadeUp(0.26)} onSubmit={handleSubmit} className="mt-[30px] flex flex-col items-center">
          <div className="w-[313px] max-w-[calc(100%-32px)] text-left">
            <div className="mb-[20px]">
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Аты-Жөніңіз"
                className="h-[50px] w-full border-0 border-b border-black bg-transparent px-0 text-[17px] leading-[1.33] text-black outline-none placeholder:uppercase placeholder:text-[#99928a]"
                style={{ ...kaz, fontWeight: 200 }} />
            </div>
            <div>
              <p style={{ fontFamily: "'kaz', Arial, sans-serif", fontWeight: 200, fontSize: '13px', lineHeight: 1.55, color: '#000', marginBottom: '30px' }}>Жұбыңызбен келсеңіз, есімдеріңізді бірге жаза кетіңіз</p>
              <div className="flex flex-col gap-[14px]">
                {RSVP_OPTIONS.map(opt => {
                  const sel = answer === opt.value;
                  return (
                    <label key={opt.value} className={`flex cursor-pointer items-center rounded-md px-1 py-1 transition-colors ${sel ? "bg-[#aa915d]/10" : ""}`}>
                      <input type="radio" name="rsvp" value={opt.value} checked={sel} onChange={e => setAnswer(e.target.value)} className="sr-only" />
                      <span className={`mr-[10px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${sel ? "border-[#aa915d] ring-2 ring-[#aa915d]/30" : "border-black/50"}`}>
                        <span className={`h-[10px] w-[10px] rounded-full transition-transform ${sel ? "scale-100 bg-[#aa915d]" : "scale-0 bg-transparent"}`} />
                      </span>
                      <span className={`text-[13px] leading-[1.55] transition-colors ${sel ? "text-[#6b5630]" : "text-black"}`} style={{ ...kaz, fontWeight: 200 }}>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div style={{ marginTop: '30px' }} className="flex justify-center">
              <button type="submit" disabled={formStatus === "loading" || !name || !answer}
                className="h-[46px] w-[280px] rounded-[1px] border border-[#aa915d] bg-[#aa915d] text-center text-[18px] leading-none text-white transition-opacity disabled:opacity-50"
                style={{ ...kaz, fontWeight: 200 }}>
                {formStatus === "loading" ? "Жіберілуде..." : "Жауапты жіберу"}
              </button>
            </div>
            {formStatus === "error" && <p className="mt-3 text-center text-[15px] text-red-500" style={{ ...kaz, fontWeight: 200 }}>Қате пайда болды. Қайтадан көріңіз.</p>}
          </div>
        </motion.form>
      </section>

      {/* ═══ FOOTER ═══ */}
      <section className="bg-white px-[8%] pt-[32px] pb-[67px] text-center">
        <motion.div {...fadeUp()}>
          <p className="text-[38px] leading-[1.55] text-[#826547]" style={{ ...kaz, fontWeight: 900 }}>
            Қуанышымызға<br />ортақ болыңыздар!
          </p>
        </motion.div>
      </section>

      {/* ═══ SUCCESS POPUP ═══ */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/80 px-5" onClick={closeSuccessPopup} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Escape" || e.key === "Enter") closeSuccessPopup(); }}>
          <div className="relative w-full max-w-[350px] rounded-[10px] bg-white px-8 py-12 text-center" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={closeSuccessPopup} className="absolute right-4 top-4 text-black" aria-label="Жабу">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 23 23" fill="currentColor"><path d="M0 1.41L1.4 0l21.22 21.21-1.41 1.42z" /><path d="M21.21 0l1.42 1.4L1.4 22.63 0 21.21z" /></svg>
            </button>
            <div className="flex justify-center">
              <svg width="60" height="60" viewBox="0 0 50 50" fill="#62C584" aria-hidden="true">
                <path d="M25.1 49.28A24.64 24.64 0 0 1 .5 24.68 24.64 24.64 0 0 1 25.1.07a24.64 24.64 0 0 1 24.6 24.6 24.64 24.64 0 0 1-24.6 24.61zm0-47.45A22.87 22.87 0 0 0 2.26 24.68 22.87 22.87 0 0 0 25.1 47.52a22.87 22.87 0 0 0 22.84-22.84A22.87 22.87 0 0 0 25.1 1.83z" />
                <path d="M22.84 30.53l-4.44-4.45a.88.88 0 1 1 1.24-1.24l3.2 3.2 8.89-8.9a.88.88 0 1 1 1.25 1.26L22.84 30.53z" />
              </svg>
            </div>
            <p className="mt-5 text-black" style={{ ...kaz, fontWeight: 900, fontSize: 'clamp(20px, 5.5vw, 24px)', lineHeight: 1.4 }}>Жауабыңызға рақмет!</p>
          </div>
        </div>
        
      )}
              <br />

    </main>
  );
}
