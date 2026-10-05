/**
 * دوال تنسيق الأرقام والوقت
 */

/**
 * تنسيق الأرقام باللغة الإنجليزية (Western Arabic Numerals: 00, 01, 09, 25...)
 */
export function formatEnglishDigits(value: number | string, pad = 2): string {
  return String(value).padStart(pad, "0");
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
  isLaunched: boolean;
}

/**
 * حساب الفارق الزمني بين الوقت الحالي وموعد الإطلاق
 */
export function calculateTimeLeft(targetIsoString: string): TimeLeft {
  const target = new Date(targetIsoString).getTime();
  const now = Date.now();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMilliseconds: 0,
      isLaunched: true,
    };
  }

  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;

  const days = Math.floor(diff / DAY);
  const hours = Math.floor((diff % DAY) / HOUR);
  const minutes = Math.floor((diff % HOUR) / MINUTE);
  const seconds = Math.floor((diff % MINUTE) / SECOND);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMilliseconds: diff,
    isLaunched: false,
  };
}
