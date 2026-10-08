"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { launchConfig } from "@/config/launch";
import { useCountdown } from "@/lib/useCountdown";
import { BackgroundFx } from "@/components/BackgroundFx";
import { HeroLogo } from "@/components/HeroLogo";
import { Countdown } from "@/components/Countdown";
import { LaunchedState } from "@/components/LaunchedState";

export default function LandingPage() {
  const [dynamicConfig, setDynamicConfig] = useState({
    launchDate: launchConfig.launchDate,
    googlePlay: launchConfig.storeLinks.googlePlay,
    appStore: launchConfig.storeLinks.appStore,
    forceLaunched: false,
    tagline: launchConfig.tagline,
    description: launchConfig.description,
  });

  useEffect(() => {
    // 1. استرجاع سريع وفوري من الذاكرة المحلية لتفادي أي تأخير
    try {
      const cached = localStorage.getItem("alwaleed_launch_config");
      if (cached) {
        setDynamicConfig((prev) => ({ ...prev, ...JSON.parse(cached) }));
      }
    } catch (_) {}

    // 2. مزامنة مباشرة مع الخادم لجلب أي تحديث تم حفظه من لوحة التحكم
    fetch("/api/launch-config", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setDynamicConfig((prev) => ({ ...prev, ...data.config }));
          try {
            localStorage.setItem("alwaleed_launch_config", JSON.stringify(data.config));
          } catch (_) {}
        }
      })
      .catch((err) => console.error("Error syncing launch config:", err));
  }, []);

  const { days, hours, minutes, seconds, isLaunched, isHydrated } = useCountdown(
    dynamicConfig.launchDate
  );

  const showLaunchedState = dynamicConfig.forceLaunched || isLaunched;

  return (
    <main className="relative min-h-[100dvh] flex flex-col justify-center items-center overflow-x-hidden bg-[#023A22] py-4 sm:py-10 px-3 sm:px-6">
      {/* المؤثرات البصرية الدقيقة للخلفية */}
      <BackgroundFx />

      {/* المحتوى الرئيسي للموبايل مع التوسع التناسقي للشاشات الكبيرة */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* 1. شعار الوليد داخل اللوح الزجاجي المصنفر (Hero Logo) */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center mb-4 sm:mb-6"
        >
          <HeroLogo appName={launchConfig.appName} isLaunched={showLaunchedState} />
        </motion.section>

        {/* 2. الشعار اللفظي (Tagline) يظهر فقط أثناء فترة العد التنازلي ويختفي فور انتهاء العداد */}
        {!showLaunchedState && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-3 sm:mb-5 px-2 w-full"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-tight sm:leading-snug golden-heading-gradient drop-shadow-[0_4px_24px_rgba(240,226,149,0.35)] select-none hype-pulse-glow">
              {dynamicConfig.tagline || launchConfig.tagline}
            </h1>
          </motion.div>
        )}

        {/* 3. العداد التنازلي أو حالة التطبيق متاح الآن عند بلوغ الصفر */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {showLaunchedState ? (
            <LaunchedState
              appStoreUrl={dynamicConfig.appStore || launchConfig.storeLinks.appStore}
              googlePlayUrl={dynamicConfig.googlePlay || launchConfig.storeLinks.googlePlay}
            />
          ) : (
            <Countdown
              days={days}
              hours={hours}
              minutes={minutes}
              seconds={seconds}
              isHydrated={isHydrated}
            />
          )}
        </motion.div>

        {/* 4. الوصف التوضيحي المقتضب للتطبيق (يظهر فقط أثناء فترة العد التنازلي) */}
        {!showLaunchedState && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-sm sm:text-base text-[#ABC8A3]/90 max-w-lg mx-auto font-light leading-relaxed px-3"
          >
            {dynamicConfig.description || launchConfig.description}
          </motion.p>
        )}

        {/* 6. توقيع الشركة المطورة (FAMEX) بتصميم بريميوم فخم */}
        {launchConfig.company && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-10 flex flex-col items-center"
          >
            <a
              href={launchConfig.company.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Powered by FAMEX"
              className="group relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#012616]/80 border border-[#ABC8A3]/25 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-[#ABC8A3]/50 hover:bg-[#02331e] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.7)] hover:-translate-y-0.5"
            >
              {/* هالة خافتة خلف الشعار عند التحويم */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,rgba(171,200,163,0.15)_0%,transparent_70%)] pointer-events-none"
              />

              <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#ABC8A3]/65 group-hover:text-[#ABC8A3] transition-colors dir-ltr font-mono">
                Powered by
              </span>

              <span className="w-px h-3.5 bg-[#ABC8A3]/25" />

              <div className="relative w-20 h-6 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <Image
                  src={launchConfig.company.logo}
                  alt={launchConfig.company.name}
                  fill
                  className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                />
              </div>

              {/* سهم أنيق خافت يشير للرابط الخارجي */}
              <svg
                className="w-3 h-3 text-[#ABC8A3]/40 group-hover:text-[#F0E295] transition-colors -rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </motion.div>
        )}
      </div>
    </main>
  );
}
