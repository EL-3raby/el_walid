import type { Metadata } from "next";
import { QrCodeViewer } from "@/components/QrCodeViewer";
import { BackgroundFx } from "@/components/BackgroundFx";
import { launchConfig } from "@/config/launch";

export const metadata: Metadata = {
  title: `رمز الاستجابة السريعة (QR) | ${launchConfig.appName}`,
  description: `توليد وطباعة كود الـ QR لحملة إطلاق تطبيق ${launchConfig.appName}.`,
};

export default function QrPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-[#023A22]">
      <BackgroundFx />
      <div className="relative z-10 w-full max-w-xl py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0E295] font-display mb-1.5">
            رمز الاستجابة السريعة (QR Code)
          </h1>
          <p className="text-sm text-[#ABC8A3]/80">
            امسح الكود بكاميرا الموبايل أو نزّله بجودة عالية عشان تطبعه في حملتك الترويجية.
          </p>
        </div>

        <QrCodeViewer />
      </div>
    </main>
  );
}
