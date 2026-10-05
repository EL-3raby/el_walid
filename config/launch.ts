/**
 * ملف إعدادات إطلاق تطبيق "الوليد" (Launch Configuration)
 * -------------------------------------------------------------
 * باللهجة المصرية العصرية مع الحفاظ على الفخامة والاحترافية.
 */

export interface LaunchConfig {
  /** اسم التطبيق */
  appName: string;
  /** الشعار اللفظي */
  tagline: string;
  /** وصف مختصر باللهجة المصرية */
  description: string;
  /** تاريخ ووقت الإطلاق المجدول بصيغة ISO 8601 */
  launchDate: string;
  /** روابط تحميل التطبيق بعد اكتمال العد التنازلي */
  storeLinks: {
    appStore: string;
    googlePlay: string;
  };
  /** زر التنبيه المسبق عبر واتساب */
  notification: {
    enabled: boolean;
    buttonText: string;
    subText: string;
    whatsappUrl: string;
  };
  /** اسم العميل وحقوق الملكية للتذييل */
  clientName: string;
  /** بيانات الشركة المطورة */
  company?: {
    name: string;
    facebookUrl: string;
    logo: string;
  };
  /** بيانات بطاقات المشاركة لشبكات التواصل */
  meta: {
    title: string;
    description: string;
    url: string;
  };
}

export const launchConfig: LaunchConfig = {
  appName: "الوليد",
  tagline: "العد التنازلي بدأ",
  description: "مفاجأة تستحق الانتظار",
  
  // موعد الإطلاق: عدّل هذا التاريخ لضبط العداد تلقائيًا
  launchDate: "2026-11-15T20:00:00+03:00",

  storeLinks: {
    appStore: "https://apps.apple.com/app/alwaleed/id0000000000",
    googlePlay: "https://play.google.com/store/apps/details?id=com.alwaleed.app",
  },

  notification: {
    enabled: false,
    buttonText: "فكّرني أول ما ينزل",
    subText: "هنبعتلك رسالة على الواتساب أول ما التطبيق يفتح رسميًا",
    whatsappUrl: "https://wa.me/966500000000?text=" + encodeURIComponent("يا هلا يا وليد! فكرني أول ما التطبيق ينزل عشان أكون أول واحد يجربه 🔥"),
  },

  clientName: "شركة الوليد للحلول المتطورة",

  company: {
    name: "FAMEX",
    facebookUrl: "https://www.facebook.com/share/19RUrLcLWb/",
    logo: "/famex-logo.png",
  },

  meta: {
    title: "الوليد | قرّبنا.. استنّوا اللي جاي!",
    description: "قريبًا… حاجة مختلفة خالص بتتحضر على نار هادية. ترقبوا الإطلاق الرسمي لتطبيق الوليد قريبًا.",
    url: "https://alwaleed.app",
  },
};
