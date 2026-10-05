"use client";

import { useState, useEffect } from "react";
import { calculateTimeLeft, TimeLeft } from "./formatters";

/**
 * Hook مخصص لإدارة العداد التنازلي مع منع خطأ عدم تطابق الخادم والعميل (Hydration Mismatch)
 */
export function useCountdown(targetIsoDate: string) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMilliseconds: 1,
    isLaunched: false,
  });

  useEffect(() => {
    setMounted(true);
    // تحديث فوري فور الاتصال بالعميل
    setTimeLeft(calculateTimeLeft(targetIsoDate));

    const timer = setInterval(() => {
      const updated = calculateTimeLeft(targetIsoDate);
      setTimeLeft(updated);
      if (updated.isLaunched) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetIsoDate]);

  return {
    ...timeLeft,
    isHydrated: mounted,
  };
}
