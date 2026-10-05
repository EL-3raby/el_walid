"use client";

import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { launchConfig } from "@/config/launch";

export function QrCodeViewer() {
  const [url, setUrl] = useState(launchConfig.meta.url);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(
      url,
      {
        width: 1024,
        margin: 2,
        color: {
          dark: "#023A22",
          light: "#F0E295",
        },
      },
      (err, generatedDataUrl) => {
        if (!err && generatedDataUrl) {
          setDataUrl(generatedDataUrl);
        }
      }
    );
  }, [url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `alwaleed-qr-code-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="w-full p-6 sm:p-8 rounded-3xl glass-panel flex flex-col items-center border border-[#ABC8A3]/30 shadow-2xl">
        <div className="relative p-4 rounded-2xl bg-[#F0E295] shadow-lg mb-6">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dataUrl}
              alt="رمز QR لصفحة إطلاق الوليد"
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
            />
          ) : (
            <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center text-[#023A22]">
              بنجهزلك الكود ثواني...
            </div>
          )}
        </div>

        {/* حقل تخصيص الرابط */}
        <div className="w-full mb-6">
          <label className="block text-xs text-[#ABC8A3] mb-1.5 font-medium">
            الرابط اللي بيفتح منه الكود (تقدر تعدله لمعاينة أي رابط تاني):
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#023A22]/90 border border-[#ABC8A3]/30 text-sm text-[#F0E295] focus:outline-none focus:border-[#F0E295] transition-colors dir-ltr font-mono"
              placeholder="https://your-domain.com"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-[#28729F] text-white text-xs font-medium hover:bg-[#3488bc] transition-colors whitespace-nowrap"
            >
              {copied ? "اتنسخ خلاص ✓" : "نسخ الرابط"}
            </button>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F0E295] text-[#023A22] font-semibold text-sm hover:bg-[#fff5a8] transition-all shadow-[0_4px_14px_rgba(240,226,149,0.3)] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            نزّل صورة الكود (PNG)
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#ABC8A3]/40 bg-[#023A22] text-[#F0E295] font-semibold text-sm hover:border-[#F0E295] hover:bg-[#03492b] transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            اطبع البوستر فورًا
          </button>
        </div>
      </div>

      <div className="w-full mt-6 p-5 rounded-2xl border border-[#ABC8A3]/15 bg-[#023A22]/50 text-xs text-[#ABC8A3]/80 leading-relaxed">
        <h3 className="font-bold text-[#F0E295] text-sm mb-2 font-display">
          💡 إزاي تستخدم الكود ده في الدعاية؟
        </h3>
        <ul className="list-disc list-inside space-y-1.5">
          <li>الكود معمول بأعلى درجات التباين عشان يتقرأ بسرعة حتى لو الإضاءة ضعيفة.</li>
          <li>نزّل الصورة بجودة الطباعة الأصلية (1024×1024) واستخدمها على الرول آب، الاستيكرات، أو البنرات.</li>
          <li>عشان تثبت الرابط النهائي، عدل متغير <code className="text-[#F0E295] font-mono">meta.url</code> في الملف <code className="text-[#F0E295] font-mono">config/launch.ts</code>.</li>
        </ul>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#ABC8A3] hover:text-[#F0E295] transition-colors"
        >
          <span>← ارجع لصفحة الإطلاق الرئيسية</span>
        </Link>
      </div>
    </div>
  );
}
