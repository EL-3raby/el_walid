"use client";

import React, { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";

import { GooglePlayLogo } from "./GooglePlayLogo";

interface LaunchedStateProps {
  appStoreUrl?: string;
  googlePlayUrl?: string;
  showAppStore?: boolean;
  showGooglePlay?: boolean;
}

export function LaunchedState({
  appStoreUrl,
  googlePlayUrl,
  showAppStore = false,
  showGooglePlay = true,
}: LaunchedStateProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    // احتفال ناعم بألوان الهوية فقط (الذهبي، الساجي، الأزرق المحيطي)
    const end = Date.now() + 1200;
    const colors = ["#F0E295", "#ABC8A3", "#28729F"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [shouldReduceMotion]);

  const hasAppStore = Boolean(showAppStore && appStoreUrl);
  const hasGooglePlay = Boolean(showGooglePlay && googlePlayUrl);
  const hasBoth = hasAppStore && hasGooglePlay;
  const hasOnlyOne = (hasAppStore && !hasGooglePlay) || (!hasAppStore && hasGooglePlay);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mx-auto my-6 sm:my-8 px-4 flex flex-col items-center text-center"
    >
      {/* إشارة التوفر الفوري باللهجة المصرية */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ABC8A3]/30 bg-[#023A22]/80 backdrop-blur-sm mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F0E295] animate-pulse" />
        <span className="text-xs sm:text-sm text-[#F0E295] font-semibold">
          التطبيق نزل خلاص!
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F0E295] mb-2 font-display">
        التطبيق متاح دلوقتي
      </h2>

      <p className="text-sm sm:text-base text-[#ABC8A3] max-w-md mx-auto mb-6 sm:mb-8 font-light leading-relaxed">
        تقدر تنزّل تطبيق الوليد حالًا وتبدأ تستكشف الميزات كلها وتعيش التجربة بنفسك.
      </p>

      {/* أزرار التحميل: تظهر حسب التفعيل من لوحة التحكم */}
      {hasBoth ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-md">
          {/* زر Google Play */}
          {hasGooglePlay && (
            <a
              href={googlePlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-[#ABC8A3]/40 bg-[#023A22] text-[#F0E295] font-semibold transition-all duration-300 hover:border-[#F0E295] hover:bg-[#03492b] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.5)] active:scale-[0.98]"
            >
              <GooglePlayLogo className="w-6 h-6 shrink-0" />
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[10px] font-normal text-[#ABC8A3]/85">متاح على</span>
                <span className="text-sm font-bold tracking-tight">Google Play</span>
              </div>
            </a>
          )}

          {/* زر App Store */}
          {hasAppStore && (
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-[#F0E295] text-[#023A22] font-semibold transition-all duration-300 hover:bg-[#fff5a8] hover:shadow-[0_8px_20px_-4px_rgba(240,226,149,0.35)] active:scale-[0.98]"
            >
              <svg
                className="w-6 h-6 fill-current shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.07.62-2.73 1.39-.58.67-1.1 1.77-.96 2.82 1.04.08 2.12-.51 2.75-1.28z" />
              </svg>
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[10px] font-normal opacity-85">نزّله من</span>
                <span className="text-sm font-bold tracking-tight">App Store</span>
              </div>
            </a>
          )}
        </div>
      ) : hasOnlyOne ? (
        <div className="w-full max-w-xs flex justify-center">
          {hasGooglePlay && (
            <a
              href={googlePlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full group relative flex items-center justify-center gap-3.5 px-6 py-4 rounded-xl border-2 border-[#F0E295]/70 bg-gradient-to-r from-[#012616] via-[#023A22] to-[#012616] text-[#F0E295] font-bold shadow-[0_8px_25px_-6px_rgba(240,226,149,0.3)] transition-all duration-300 hover:border-[#F0E295] hover:scale-[1.02] hover:shadow-[0_12px_30px_-6px_rgba(240,226,149,0.45)] active:scale-[0.98]"
            >
              <GooglePlayLogo className="w-7 h-7 shrink-0" />
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[11px] font-normal text-[#ABC8A3]">حمّل التطبيق الآن من</span>
                <span className="text-base font-extrabold tracking-tight">Google Play</span>
              </div>
            </a>
          )}

          {hasAppStore && (
            <a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full group relative flex items-center justify-center gap-3.5 px-6 py-4 rounded-xl bg-[#F0E295] text-[#023A22] font-bold shadow-[0_8px_25px_-6px_rgba(240,226,149,0.35)] transition-all duration-300 hover:bg-[#fff5a8] hover:scale-[1.02] hover:shadow-[0_12px_30px_-6px_rgba(240,226,149,0.5)] active:scale-[0.98]"
            >
              <svg
                className="w-7 h-7 fill-current shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.07.62-2.73 1.39-.58.67-1.1 1.77-.96 2.82 1.04.08 2.12-.51 2.75-1.28z" />
              </svg>
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[11px] font-normal opacity-85">نزّله الآن من</span>
                <span className="text-base font-extrabold tracking-tight">App Store</span>
              </div>
            </a>
          )}
        </div>
      ) : (
        <div className="px-5 py-3 rounded-full bg-[#012616]/70 border border-[#ABC8A3]/30 text-xs sm:text-sm text-[#ABC8A3]">
          ⏳ روابط التحميل ستتوفر هنا فور اكتمال التجهيز
        </div>
      )}
    </motion.div>
  );
}
