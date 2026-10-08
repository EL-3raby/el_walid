import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | إعدادات العد التنازلي وتطبيق الوليد",
  description: "لوحة تحكم وتعديل موعد انتهاء العد التنازلي وروابط متاجر التطبيق بعد الإطلاق",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
