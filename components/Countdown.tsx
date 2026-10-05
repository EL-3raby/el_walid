"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { formatEnglishDigits } from "@/lib/formatters";

interface CountdownProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isHydrated: boolean;
}

interface UnitBlockProps {
  value: number;
  label: string;
  symbol: string;
  num: string;
  isHydrated: boolean;
  isSeconds?: boolean;
}

function PeriodicBlock({ value, label, symbol, num, isHydrated, isSeconds = false }: UnitBlockProps) {
  const shouldReduceMotion = useReducedMotion();
  const formattedValue = isHydrated ? formatEnglishDigits(value) : "00";

  return (
    <div className={`relative flex-1 flex flex-col items-center justify-center py-2.5 sm:py-4 px-1 rounded-2xl bg-[#012515]/65 border ${isSeconds ? 'border-[#F0E295]/40 shadow-[0_0_15px_-3px_rgba(240,226,149,0.15)]' : 'border-[#ABC8A3]/20'} shadow-md group transition-all duration-300 hover:border-[#F0E295]/50 hover:bg-[#02311c]/80`}>
      {/* رأس بطاقة عنصر الجدول الدوري: العدد الذري ورمز العنصر اللاتيني */}
      <div className="w-full flex items-center justify-between px-2 sm:px-2.5 text-[10px] sm:text-[11px] font-mono select-none">
        <span className="text-[#ABC8A3]/60 font-semibold">{num}</span>
        <span className="text-[#F0E295] font-bold tracking-wider">{symbol}</span>
      </div>

      {/* رقم العداد بالخط الإنجليزي (Unbounded) والتدرج الذهبي الفاخر */}
      <div className="relative h-11 sm:h-16 flex items-center justify-center font-digits my-0.5 sm:my-1 w-full overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={formattedValue}
            initial={shouldReduceMotion ? false : { y: 14, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { y: -14, opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.32,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="text-3xl sm:text-5xl font-black golden-numeral-gradient tracking-tight tabular-nums select-none leading-none drop-shadow-[0_4px_14px_rgba(240,226,149,0.35)]"
          >
            {formattedValue}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* تسمية الوحدة الزمنية */}
      <div className="flex items-center gap-1">
        {isSeconds && isHydrated && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#F0E295] animate-live-dot" />
        )}
        <span className="text-[10px] sm:text-xs font-medium text-[#ABC8A3]/85 select-none">
          {label}
        </span>
      </div>
    </div>
  );
}

export function Countdown({
  days,
  hours,
  minutes,
  seconds,
  isHydrated,
}: CountdownProps) {
  const units = [
    { value: days, label: "يوم", symbol: "Dy", num: "24" },
    { value: hours, label: "ساعة", symbol: "Hr", num: "60" },
    { value: minutes, label: "دقيقة", symbol: "Mn", num: "60" },
    { value: seconds, label: "ثانية", symbol: "Sc", num: "01", isSeconds: true },
  ];

  return (
    <div className="w-full max-w-lg sm:max-w-xl mx-auto my-4 sm:my-6 px-1 sm:px-2">
      {/* لوح الجدول الدوري المعملي المصمم بألوان الهوية */}
      <div className="relative rounded-2xl sm:rounded-3xl countdown-container p-2 sm:p-3.5 overflow-hidden">
        {/* علامات المعمل الكيميائية في الزوايا */}
        <div aria-hidden="true" className="absolute top-2 left-2 text-[#ABC8A3]/30 text-[9px] font-mono leading-none select-none">⌜</div>
        <div aria-hidden="true" className="absolute top-2 right-2 text-[#ABC8A3]/30 text-[9px] font-mono leading-none select-none">⌝</div>
        <div aria-hidden="true" className="absolute bottom-2 left-2 text-[#ABC8A3]/30 text-[9px] font-mono leading-none select-none">⌞</div>
        <div aria-hidden="true" className="absolute bottom-2 right-2 text-[#ABC8A3]/30 text-[9px] font-mono leading-none select-none">⌟</div>

        {/* شبكة بطاقات عناصر الجدول الدوري الأربعة */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2.5">
          {units.map((u) => (
            <PeriodicBlock
              key={u.label}
              value={u.value}
              label={u.label}
              symbol={u.symbol}
              num={u.num}
              isHydrated={isHydrated}
              isSeconds={u.isSeconds}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
