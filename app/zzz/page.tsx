"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { launchConfig } from "@/config/launch";
import { calculateTimeLeft, TimeLeft } from "@/lib/formatters";
import { GooglePlayLogo } from "@/components/GooglePlayLogo";

interface ConfigState {
  launchDate: string;
  googlePlay: string;
  appStore: string;
  forceLaunched: boolean;
  tagline: string;
  description: string;
}

function toDatetimeLocal(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
}

function fromDatetimeLocal(localString: string): string {
  try {
    const date = new Date(localString);
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function formatArabicDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  } catch {
    return dateStr;
  }
}

export default function AdminPage() {
  const [config, setConfig] = useState<ConfigState>({
    launchDate: launchConfig.launchDate,
    googlePlay: launchConfig.storeLinks.googlePlay,
    appStore: launchConfig.storeLinks.appStore,
    forceLaunched: false,
    tagline: launchConfig.tagline,
    description: launchConfig.description,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMilliseconds: 0,
    isLaunched: false,
  });

  // جلب الإعدادات من الخادم
  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        const res = await fetch("/api/launch-config", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.config) {
            setConfig({
              launchDate: data.config.launchDate || launchConfig.launchDate,
              googlePlay: data.config.googlePlay || launchConfig.storeLinks.googlePlay,
              appStore: data.config.appStore || launchConfig.storeLinks.appStore,
              forceLaunched: Boolean(data.config.forceLaunched),
              tagline: data.config.tagline || launchConfig.tagline,
              description: data.config.description || launchConfig.description,
            });
            localStorage.setItem("alwaleed_launch_config", JSON.stringify(data.config));
          }
        }
      } catch (err) {
        console.error("Failed to load config:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  // تحديث العداد المباشر كل ثانية
  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft(config.launchDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config.launchDate]);

  // حفظ التعديلات
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage("");

    try {
      const res = await fetch("/api/launch-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(true);
        localStorage.setItem("alwaleed_launch_config", JSON.stringify(config));
        setTimeout(() => setSaveSuccess(false), 4500);
      } else {
        setErrorMessage(data.error || "حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      console.error("Save error:", err);
      setErrorMessage("فشل الاتصال بالخادم لحفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  // أزرار سريعة لضبط التاريخ
  const applyPreset = (msFromNow: number) => {
    const target = new Date(Date.now() + msFromNow);
    setConfig((prev) => ({
      ...prev,
      launchDate: target.toISOString(),
      forceLaunched: msFromNow <= 0,
    }));
  };

  const isActuallyLaunched = config.forceLaunched || timeLeft.isLaunched;

  return (
    <div className="min-h-screen bg-[#012616] text-[#ABC8A3] py-6 sm:py-12 px-4 sm:px-6 relative overflow-x-hidden selection:bg-[#F0E295] selection:text-[#023A22]">
      {/* خلفية جمالية خافتة */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#ABC8A3_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
        {/* شريط الرأس: عنوان الصفحة وزر المعاينة */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#023A22]/90 border border-[#ABC8A3]/25 backdrop-blur-xl shadow-[0_12px_35px_-8px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-xl bg-[#012616] border border-[#F0E295]/40 flex items-center justify-center p-2 shadow-inner">
              <Image
                src="/logo.png"
                alt="الوليد"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#F0E295] font-display">
                  لوحة تحكم إطلاق تطبيق الوليد
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F0E295]/15 text-[#F0E295] border border-[#F0E295]/30 font-bold">
                  Admin
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#ABC8A3]/75 mt-0.5">
                تعديل تاريخ العد التنازلي وروابط التحميل (Google Play & App Store)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#012616] hover:bg-[#02331e] text-[#F0E295] border border-[#ABC8A3]/30 hover:border-[#F0E295] text-xs sm:text-sm font-bold transition-all duration-300 shadow-md group"
            >
              <span>معاينة الصفحة الرئيسية</span>
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </header>

        {/* كارت الحالة الحالية الحية للعداد (Live Status Badge) */}
        <section className="p-5 rounded-2xl bg-[#023A22]/80 border border-[#ABC8A3]/25 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`w-3.5 h-3.5 rounded-full ${
                  isActuallyLaunched
                    ? "bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]"
                    : "bg-[#F0E295] animate-pulse shadow-[0_0_12px_#F0E295]"
                }`}
              />
              <div>
                <span className="text-xs text-[#ABC8A3]/70 font-medium">حالة التطبيق الحالية:</span>
                <div className="text-base sm:text-lg font-extrabold text-[#F0E295]">
                  {isActuallyLaunched ? (
                    <span className="text-emerald-300 flex items-center gap-1.5">
                      🚀 التطبيق في حالة الإطلاق (الروابط ظاهرة للزوار الآن)
                    </span>
                  ) : (
                    <span>⏱️ العد التنازلي نشط ومستمر حتى موعد الإطلاق</span>
                  )}
                </div>
              </div>
            </div>

            {/* العداد المصغر المباشر */}
            {!isActuallyLaunched && (
              <div className="flex items-center gap-2 bg-[#012616]/90 px-4 py-2 rounded-xl border border-[#ABC8A3]/20 text-center font-digits">
                <div className="flex flex-col">
                  <span className="text-lg font-black text-[#F0E295] leading-none">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-[#ABC8A3]/60 font-body">يوم</span>
                </div>
                <span className="text-[#ABC8A3]/40 font-bold">:</span>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-[#F0E295] leading-none">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-[#ABC8A3]/60 font-body">ساعة</span>
                </div>
                <span className="text-[#ABC8A3]/40 font-bold">:</span>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-[#F0E295] leading-none">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-[#ABC8A3]/60 font-body">دقيقة</span>
                </div>
                <span className="text-[#ABC8A3]/40 font-bold">:</span>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-emerald-400 leading-none">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-[#ABC8A3]/60 font-body">ثانية</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* نموذج التعديل الرئيسي */}
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* 1. قسم ضبط تاريخ ووقت انتهاء العد التنازلي */}
          <div className="p-6 rounded-2xl bg-[#023A22]/90 border border-[#ABC8A3]/25 backdrop-blur-md shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#ABC8A3]/15 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#F0E295]/15 border border-[#F0E295]/30 flex items-center justify-center text-[#F0E295] text-sm">
                  📅
                </span>
                <div>
                  <h2 className="text-lg font-bold text-[#F0E295]">
                    موعد انتهاء العد التنازلي
                  </h2>
                  <p className="text-xs text-[#ABC8A3]/75">
                    حدد تاريخ ووقت الإطلاق المجدول، سينتهي العداد فور الوصول إليه
                  </p>
                </div>
              </div>
            </div>

            {/* حقل اختيار التاريخ والوقت */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-semibold text-[#ABC8A3] mb-1.5">
                  اختر التاريخ والوقت (اليوم / الشهر / السنة / الساعة):
                </label>
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(config.launchDate)}
                  onChange={(e) => {
                    const iso = fromDatetimeLocal(e.target.value);
                    setConfig((prev) => ({ ...prev, launchDate: iso }));
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#012616] border border-[#ABC8A3]/35 text-[#F0E295] text-sm font-bold focus:outline-none focus:border-[#F0E295] focus:ring-2 focus:ring-[#F0E295]/20 transition-all font-mono"
                  required
                />
              </div>

              {/* بطاقة التوضيح باللغة العربية */}
              <div className="w-full sm:w-1/2 p-3.5 rounded-xl bg-[#012616]/75 border border-[#ABC8A3]/20">
                <span className="text-[11px] text-[#ABC8A3]/65 block mb-1">
                  التاريخ باللغة العربية:
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#F0E295]">
                  {formatArabicDate(config.launchDate) || "تاريخ غير محدد"}
                </span>
              </div>
            </div>

            {/* أزرار سريعة للاختبار والضبط الفوري */}
            <div>
              <span className="block text-xs font-semibold text-[#ABC8A3]/80 mb-2">
                ⚡ خيارات ضبط سريعة (بنقرة زر واحدة):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset(-1000)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all active:scale-95 shadow-sm"
                >
                  🚀 إنهاء العداد الآن (إظهار الروابط فورًا)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(5 * 60 * 1000)}
                  className="px-3 py-1.5 rounded-lg bg-[#012616] hover:bg-[#02331e] border border-[#ABC8A3]/30 hover:border-[#F0E295] text-[#F0E295] text-xs font-semibold transition-all active:scale-95"
                >
                  ⏱️ بعد 5 دقائق (للاختبار)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(60 * 60 * 1000)}
                  className="px-3 py-1.5 rounded-lg bg-[#012616] hover:bg-[#02331e] border border-[#ABC8A3]/30 hover:border-[#F0E295] text-[#ABC8A3] text-xs font-medium transition-all active:scale-95"
                >
                  + ساعة واحدة
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(24 * 60 * 60 * 1000)}
                  className="px-3 py-1.5 rounded-lg bg-[#012616] hover:bg-[#02331e] border border-[#ABC8A3]/30 hover:border-[#F0E295] text-[#ABC8A3] text-xs font-medium transition-all active:scale-95"
                >
                  + 24 ساعة (غدًا)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(7 * 24 * 60 * 60 * 1000)}
                  className="px-3 py-1.5 rounded-lg bg-[#012616] hover:bg-[#02331e] border border-[#ABC8A3]/30 hover:border-[#F0E295] text-[#ABC8A3] text-xs font-medium transition-all active:scale-95"
                >
                  + 7 أيام (أسبوع)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(30 * 24 * 60 * 60 * 1000)}
                  className="px-3 py-1.5 rounded-lg bg-[#012616] hover:bg-[#02331e] border border-[#ABC8A3]/30 hover:border-[#F0E295] text-[#ABC8A3] text-xs font-medium transition-all active:scale-95"
                >
                  + 30 يومًا (شهر)
                </button>
              </div>
            </div>
          </div>

          {/* 2. قسم روابط التحميل بعد انتهاء العد التنازلي (Google Play & App Store) */}
          <div className="p-6 rounded-2xl bg-[#023A22]/90 border border-[#ABC8A3]/25 backdrop-blur-md shadow-xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#ABC8A3]/15 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-sm">
                  🔗
                </span>
                <div>
                  <h2 className="text-lg font-bold text-[#F0E295]">
                    روابط تحميل التطبيق بعد انتهاء العد
                  </h2>
                  <p className="text-xs text-[#ABC8A3]/75">
                    الروابط التي سيتم توجيه الزوار إليها بمجرد انتهاء العداد واكتمال الإطلاق
                  </p>
                </div>
              </div>
            </div>

            {/* حقل رابط Google Play (المطلوب الرئيسي) */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between text-xs font-bold text-[#F0E295]">
                <span className="flex items-center gap-2">
                  <GooglePlayLogo className="w-4 h-4 shrink-0" />
                  رابط متجر جوجل بلاي (Google Play URL):
                </span>
                {config.googlePlay && (
                  <a
                    href={config.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#F0E295] hover:underline flex items-center gap-1"
                  >
                    <span>اختبار الرابط</span>
                    <svg className="w-3 h-3 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://play.google.com/store/apps/details?id=com.alwaleed.app"
                  value={config.googlePlay}
                  onChange={(e) => setConfig((prev) => ({ ...prev, googlePlay: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#012616] border border-[#ABC8A3]/35 text-[#F0E295] text-sm focus:outline-none focus:border-[#F0E295] focus:ring-2 focus:ring-[#F0E295]/20 transition-all font-mono dir-ltr text-left"
                />
              </div>
              <p className="text-[11px] text-[#ABC8A3]/65">
                💡 بمجرد انتهاء العد التنازلي، عند ضغط المستخدم على زر Google Play سيتم نقله فورًا إلى هذا الرابط.
              </p>
            </div>

            {/* حقل رابط App Store (Apple) */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between text-xs font-bold text-[#ABC8A3]">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current text-[#F0E295]" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.07.62-2.73 1.39-.58.67-1.1 1.77-.96 2.82 1.04.08 2.12-.51 2.75-1.28z" />
                  </svg>
                  رابط متجر آب ستور (Apple App Store URL):
                </span>
                {config.appStore && (
                  <a
                    href={config.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#F0E295] hover:underline flex items-center gap-1"
                  >
                    <span>اختبار الرابط</span>
                    <svg className="w-3 h-3 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
              </label>
              <input
                type="url"
                placeholder="https://apps.apple.com/app/alwaleed/id0000000000"
                value={config.appStore}
                onChange={(e) => setConfig((prev) => ({ ...prev, appStore: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-[#012616] border border-[#ABC8A3]/35 text-[#F0E295] text-sm focus:outline-none focus:border-[#F0E295] focus:ring-2 focus:ring-[#F0E295]/20 transition-all font-mono dir-ltr text-left"
              />
            </div>

            {/* مفتاح التفعيل الإجباري الفوري (Force Launch Mode) */}
            <div className="mt-2 p-4 rounded-xl bg-[#012616]/80 border border-[#ABC8A3]/20 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-[#F0E295]">
                  🚀 تفعيل حالة الإطلاق يدويًا فورًا (تجاوز العداد)
                </span>
                <span className="text-[11px] text-[#ABC8A3]/70">
                  عند تفعيل هذا الخيار، ستظهر شاشة الروابط والمتاجر في الصفحة الرئيسية فورًا حتى لو كان موعد العداد في المستقبل.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.forceLaunched}
                  onChange={(e) => setConfig((prev) => ({ ...prev, forceLaunched: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#023A22] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 border border-[#ABC8A3]/30"></div>
              </label>
            </div>
          </div>

          {/* 3. قسم نصوص الصفحة الرئيسية (الشعار والوصف) */}
          <div className="p-6 rounded-2xl bg-[#023A22]/90 border border-[#ABC8A3]/25 backdrop-blur-md shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-[#ABC8A3]/15 pb-3">
              <span className="w-8 h-8 rounded-lg bg-[#F0E295]/15 border border-[#F0E295]/30 flex items-center justify-center text-[#F0E295] text-sm">
                ✏️
              </span>
              <div>
                <h2 className="text-lg font-bold text-[#F0E295]">
                  نصوص الصفحة الرئيسية
                </h2>
                <p className="text-xs text-[#ABC8A3]/75">
                  تعديل العنوان الرئيسي والوصف الظاهرين للزوار
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#ABC8A3] mb-1.5">
                  العنوان الرئيسي (الشعار اللفظي):
                </label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => setConfig((prev) => ({ ...prev, tagline: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#012616] border border-[#ABC8A3]/35 text-[#F0E295] text-sm font-bold focus:outline-none focus:border-[#F0E295]"
                  placeholder="العد التنازلي بدأ"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#ABC8A3] mb-1.5">
                  الوصف التوضيحي المقتضب:
                </label>
                <input
                  type="text"
                  value={config.description}
                  onChange={(e) => setConfig((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#012616] border border-[#ABC8A3]/35 text-[#ABC8A3] text-sm focus:outline-none focus:border-[#F0E295]"
                  placeholder="مفاجأة تستحق الانتظار"
                />
              </div>
            </div>
          </div>

          {/* 4. معاينة حية لشكل بطاقة التحميل كما ستظهر للزائر بعد انتهاء العد */}
          <div className="p-6 rounded-2xl bg-[#012616]/90 border border-[#ABC8A3]/25 backdrop-blur-md shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#ABC8A3]/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">👁️</span>
                <h3 className="text-sm font-bold text-[#F0E295]">
                  معاينة حية لشاشة انتهاء العد التنازلي (كما ستظهر للزوار):
                </h3>
              </div>
              <span className="text-[11px] text-[#ABC8A3]/60">معاينة تفاعلية</span>
            </div>

            {/* محاكاة بطاقة LaunchedState */}
            <div className="p-5 rounded-2xl bg-[#023A22]/70 border border-[#ABC8A3]/20 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ABC8A3]/30 bg-[#023A22] text-[#F0E295] text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-[#F0E295] animate-pulse" />
                التطبيق نزل خلاص!
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-[#F0E295] mb-1 font-display">
                التطبيق متاح دلوقتي
              </h4>
              <p className="text-xs text-[#ABC8A3]/80 max-w-sm mb-4">
                تقدر تنزّل تطبيق الوليد حالًا وتبدأ تستكشف الميزات كلها وتعيش التجربة بنفسك.
              </p>

              {/* أزرار التحميل في المعاينة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm">
                <a
                  href={config.appStore || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!config.appStore) e.preventDefault();
                  }}
                  className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#F0E295] text-[#023A22] font-bold text-xs transition-transform hover:scale-102"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.07.62-2.73 1.39-.58.67-1.1 1.77-.96 2.82 1.04.08 2.12-.51 2.75-1.28z" />
                  </svg>
                  <span>App Store</span>
                </a>

                <a
                  href={config.googlePlay || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!config.googlePlay) e.preventDefault();
                  }}
                  className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#ABC8A3]/40 bg-[#023A22] text-[#F0E295] font-bold text-xs transition-transform hover:scale-102"
                >
                  <GooglePlayLogo className="w-4 h-4 shrink-0" />
                  <span>Google Play</span>
                </a>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ الرئيسية والإشعارات */}
          <div className="sticky bottom-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#012616]/95 border-2 border-[#F0E295]/50 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F0E295] hover:bg-[#fff7b8] text-[#023A22] text-sm sm:text-base font-black transition-all shadow-[0_4px_20px_rgba(240,226,149,0.35)] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-[#023A22]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>جارٍ الحفظ...</span>
                  </>
                ) : (
                  <>
                    <span>💾 حفظ التعديلات الآن</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfig({
                    launchDate: launchConfig.launchDate,
                    googlePlay: launchConfig.storeLinks.googlePlay,
                    appStore: launchConfig.storeLinks.appStore,
                    forceLaunched: false,
                    tagline: launchConfig.tagline,
                    description: launchConfig.description,
                  });
                }}
                className="px-4 py-3 rounded-xl bg-[#023A22] hover:bg-[#03492b] border border-[#ABC8A3]/30 text-[#ABC8A3] text-xs font-semibold transition-all"
              >
                استعادة الافتراضي
              </button>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#F0E295] hover:underline"
            >
              <span>فتح الصفحة الرئيسية لمعاينة التغيير ↗</span>
            </Link>
          </div>
        </form>

        {/* إشعار النجاح المنبثق */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-950 border-2 border-emerald-400 text-emerald-200 text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              <span className="text-lg">✓</span>
              <span>تم حفظ تاريخ العد ورابط Google Play بنجاح وتحديث الموقع فورًا!</span>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-red-950 border-2 border-red-500 text-red-200 text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              <span className="text-lg">⚠️</span>
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
