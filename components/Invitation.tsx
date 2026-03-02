"use client";

import { motion } from "framer-motion";
import {
  GROOM,
  BRIDE,
  PARENTS_FATHER,
  PARENTS_MOTHER,
} from "@/lib/constants";

export default function Invitation() {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
        >
          <p className="ornament mb-4">❋</p>

          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-text mb-8 leading-relaxed">
            Құрметті ағайын-туыс,
            <br />
            бауырлар, дос-жарандар,
            <br />
            көршілер және әріптестер!
          </h2>

          <div className="gold-divider" />

          <p className="font-serif text-lg sm:text-xl text-text-light leading-relaxed mt-8">
            Сіздерді ұлымыз
          </p>

          <p className="font-script text-4xl sm:text-5xl text-gold my-4">
            {GROOM}
          </p>

          <p className="font-serif text-lg sm:text-xl text-text-light">пен</p>

          <p className="font-script text-4xl sm:text-5xl text-gold my-4">
            {BRIDE}
          </p>

          <p className="font-serif text-lg sm:text-xl text-text-light leading-relaxed mt-2">
            келініміздің үйлену
            <br />
            тойына арналған салтанатты
            <br />
            ақ дастарханымыздың
            <br />
            қадірлі қонағы болуға
            <br />
            шақырамыз!
          </p>

          <div className="gold-divider" />

          <p className="mt-8 font-serif text-base sm:text-lg text-text-light tracking-widest uppercase">
            Той иелері:
          </p>
          <p className="mt-3 font-script text-3xl sm:text-4xl text-gold">
            {PARENTS_FATHER} – {PARENTS_MOTHER}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
