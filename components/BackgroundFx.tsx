"use client";

import React from "react";

/**
 * خلفية كيميائية متطورة فائقة الحيوية
 * تتضمن:
 * 1. جزيئات كيميائية متحركة (حلقات بنزين وسلاسل ذرية) تطفو وتدور ببطء ثلاثي الأبعاد
 * 2. نموذج ذري دوّار مع مدارات بيضاوية وإلكترونات نشطة
 * 3. دورق كيميائي معملي هندسي بتفاعل وفقاعات صاعدة
 * 4. فقاعات تفاعل كيميائي متصاعدة عبر الشاشة بالكامل (Screen Effervescence)
 * 5. شبكة الجزيئات السداسية وسحب التبخير المعملي مع ملمس الحبيبات (Film Grain)
 */
export function BackgroundFx() {
  // فقاعات كيميائية صاعدة عبر كامل ارتفاع الشاشة بسرعات وتأخيرات متفاوتة
  const screenBubbles = [
    { id: 1, size: 5, left: "8%", delay: "0s", duration: "16s", drift: "28px", color: "#ABC8A3" },
    { id: 2, size: 7, left: "24%", delay: "4s", duration: "21s", drift: "-22px", color: "#28729F" },
    { id: 3, size: 4, left: "42%", delay: "8s", duration: "18s", drift: "35px", color: "#F0E295" },
    { id: 4, size: 8, left: "62%", delay: "2s", duration: "24s", drift: "-30px", color: "#ABC8A3" },
    { id: 5, size: 5, left: "79%", delay: "6s", duration: "19s", drift: "20px", color: "#28729F" },
    { id: 6, size: 6, left: "91%", delay: "10s", duration: "22s", drift: "-25px", color: "#F0E295" },
    { id: 7, size: 4, left: "16%", delay: "12s", duration: "17s", drift: "32px", color: "#F0E295" },
    { id: 8, size: 7, left: "54%", delay: "7s", duration: "20s", drift: "-18px", color: "#28729F" },
    { id: 9, size: 5, left: "70%", delay: "3s", duration: "15s", drift: "24px", color: "#ABC8A3" },
    { id: 10, size: 6, left: "33%", delay: "11s", duration: "23s", drift: "-35px", color: "#ABC8A3" },
  ];

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. طبقة الـ Film-Grain السينمائية */}
      <svg className="film-grain" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.45 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* 2. شبكة خطوط الجزيئات الكيميائية السداسية (Hexagonal Benzene Grid) */}
      <div className="absolute inset-0 opacity-[0.09]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="chemHexPattern"
              width="140"
              height="121"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(0.85)"
            >
              <path
                d="M 35,0 L 70,0 L 87.5,30.3 L 70,60.6 L 35,60.6 L 17.5,30.3 Z"
                fill="none"
                stroke="#ABC8A3"
                strokeWidth="1.2"
              />
              <path
                d="M 105,60.6 L 140,60.6 L 157.5,90.9 L 140,121.2 L 105,121.2 L 87.5,90.9 Z"
                fill="none"
                stroke="#ABC8A3"
                strokeWidth="1.2"
              />
              <path
                d="M 37,6 L 68,6"
                stroke="#F0E295"
                strokeWidth="0.8"
                strokeDasharray="3 3"
                opacity="0.7"
              />
              <path
                d="M 107,66.6 L 138,66.6"
                stroke="#28729F"
                strokeWidth="0.8"
                strokeDasharray="3 3"
                opacity="0.8"
              />
              <circle cx="35" cy="0" r="2.5" fill="#ABC8A3" />
              <circle cx="70" cy="0" r="2.5" fill="#ABC8A3" />
              <circle cx="87.5" cy="30.3" r="3" fill="#28729F" />
              <circle cx="70" cy="60.6" r="2.5" fill="#ABC8A3" />
              <circle cx="35" cy="60.6" r="2.5" fill="#ABC8A3" />
              <circle cx="17.5" cy="30.3" r="2" fill="#F0E295" />
              <circle cx="105" cy="60.6" r="2.5" fill="#ABC8A3" />
              <circle cx="140" cy="60.6" r="2.5" fill="#ABC8A3" />
              <circle cx="87.5" cy="90.9" r="3" fill="#28729F" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chemHexPattern)" />
        </svg>
      </div>

      {/* 3. سحب التبخير المعملي والانبعاثات الكيميائية الخافتة (Chemical Vapor Mist) */}
      <div
        className="smoke-cloud-1 absolute -top-[15%] -left-[10%] w-[120vw] sm:w-[650px] h-[600px] rounded-full blur-[80px] opacity-[0.14] pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, #ABC8A3 0%, #28729F 45%, #023A22 75%, transparent 100%)",
        }}
      />
      <div
        className="smoke-cloud-2 absolute -bottom-[15%] -right-[10%] w-[120vw] sm:w-[700px] h-[650px] rounded-full blur-[100px] opacity-[0.12] pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, #28729F 0%, #023A22 65%, transparent 100%)",
        }}
      />

      {/* ========================================================================= */}
      {/* 4. الأشكال الكيميائية المتحركة (Animated Chemical Floating Structures)   */}
      {/* ========================================================================= */}

      {/* الشكل 1: جزيء حلقة البنزين المركب الطافي والدوّار (أعلى اليمين) */}
      <div
        className="absolute top-[8%] -right-[10px] sm:right-[6%] w-44 h-44 sm:w-56 sm:h-56 opacity-25 animate-molecule-1 pointer-events-none"
        style={{ "--duration": "46s" } as React.CSSProperties}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          {/* الروابط السداسية الرئيسية */}
          <polygon
            points="100,30 155,62 155,126 100,158 45,126 45,62"
            fill="none"
            stroke="#ABC8A3"
            strokeWidth="1.8"
          />
          {/* رابطة كيميائية ثنائية داخلية تنبض */}
          <line x1="56" y1="70" x2="94" y2="48" stroke="#F0E295" strokeWidth="1.4" strokeDasharray="4 3" className="animate-bond-flow" />
          <line x1="144" y1="70" x2="144" y2="118" stroke="#28729F" strokeWidth="1.4" strokeDasharray="4 3" className="animate-bond-flow" />
          <line x1="56" y1="118" x2="94" y2="140" stroke="#F0E295" strokeWidth="1.4" strokeDasharray="4 3" className="animate-bond-flow" />

          {/* روابط خارجية ممتدة لذرات مرتبطة */}
          <line x1="100" y1="30" x2="100" y2="8" stroke="#ABC8A3" strokeWidth="1.5" />
          <line x1="155" y1="62" x2="178" y2="48" stroke="#ABC8A3" strokeWidth="1.5" />
          <line x1="155" y1="126" x2="178" y2="140" stroke="#ABC8A3" strokeWidth="1.5" />
          <line x1="100" y1="158" x2="100" y2="182" stroke="#ABC8A3" strokeWidth="1.5" />
          <line x1="45" y1="126" x2="22" y2="140" stroke="#ABC8A3" strokeWidth="1.5" />
          <line x1="45" y1="62" x2="22" y2="48" stroke="#ABC8A3" strokeWidth="1.5" />

          {/* ذرات العقد الرئيسية والمضيئة */}
          <circle cx="100" cy="30" r="5" fill="#F0E295" filter="drop-shadow(0 0 6px #F0E295)" />
          <circle cx="155" cy="62" r="4.5" fill="#ABC8A3" />
          <circle cx="155" cy="126" r="5" fill="#28729F" filter="drop-shadow(0 0 6px #28729F)" />
          <circle cx="100" cy="158" r="4.5" fill="#ABC8A3" />
          <circle cx="45" cy="126" r="5" fill="#F0E295" filter="drop-shadow(0 0 6px #F0E295)" />
          <circle cx="45" cy="62" r="4.5" fill="#28729F" />

          {/* ذرات الفروع الخارجية */}
          <circle cx="100" cy="8" r="3.5" fill="#ABC8A3" />
          <circle cx="178" cy="48" r="4" fill="#28729F" />
          <circle cx="178" cy="140" r="3" fill="#F0E295" />
          <circle cx="100" cy="182" r="4" fill="#28729F" />
          <circle cx="22" cy="140" r="3.5" fill="#ABC8A3" />
          <circle cx="22" cy="48" r="3" fill="#F0E295" />
        </svg>
      </div>

      {/* الشكل 2: النموذج الذري الدوّار مع مدارات بيضاوية وإلكترونات (منتصف اليسار) */}
      <div
        className="absolute top-[48%] -left-[20px] sm:left-[4%] w-40 h-40 sm:w-52 sm:h-52 opacity-25 animate-molecule-2 pointer-events-none"
        style={{ "--duration": "38s" } as React.CSSProperties}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* نواة الذرة المركزية المتوهجة */}
          <div className="w-5 h-5 rounded-full bg-[#F0E295] shadow-[0_0_12px_#F0E295] flex items-center justify-center z-10">
            <span className="w-2 h-2 rounded-full bg-[#023A22]" />
          </div>

          {/* المدار الإلكتروني الأول (مائل 30 درجة) */}
          <div
            className="absolute inset-2 rounded-full border border-[#ABC8A3]/40 animate-orbital"
            style={{ borderRadius: "50%", transform: "rotate(30deg) scaleY(0.45)" }}
          >
            {/* إلكترون يدور على المدار */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#28729F] shadow-[0_0_8px_#28729F]" />
          </div>

          {/* المدار الإلكتروني الثاني (مائل -45 درجة عكسي) */}
          <div
            className="absolute inset-0 rounded-full border border-[#28729F]/50 animate-orbital-rev"
            style={{ borderRadius: "50%", transform: "rotate(-45deg) scaleY(0.4)" }}
          >
            {/* إلكترون ثانٍ */}
            <span className="absolute bottom-0 right-1/4 w-2.5 h-2.5 rounded-full bg-[#F0E295] shadow-[0_0_6px_#F0E295]" />
          </div>

          {/* المدار الإلكتروني الثالث (رأسي مائل 80 درجة) */}
          <div
            className="absolute inset-1 rounded-full border border-[#ABC8A3]/35 animate-orbital"
            style={{ borderRadius: "50%", transform: "rotate(85deg) scaleY(0.42)", animationDuration: "34s" }}
          >
            <span className="absolute top-1/4 right-0 w-2.5 h-2.5 rounded-full bg-[#ABC8A3] shadow-[0_0_6px_#ABC8A3]" />
          </div>
        </div>
      </div>

      {/* الشكل 3: سلسلة كيميائية جزيئية متفرعة طافية (أسفل اليمين) */}
      <div
        className="absolute bottom-[10%] right-[4%] sm:right-[10%] w-48 h-36 sm:w-60 sm:h-44 opacity-25 animate-molecule-3 pointer-events-none"
        style={{ "--duration": "50s" } as React.CSSProperties}
      >
        <svg viewBox="0 0 240 160" className="w-full h-full overflow-visible">
          {/* روابط كيميائية متعرجة متصلة */}
          <polyline
            points="20,120 70,60 130,90 180,40 220,70"
            fill="none"
            stroke="#ABC8A3"
            strokeWidth="1.8"
          />
          {/* فرع كيميائي صاعد */}
          <line x1="130" y1="90" x2="145" y2="140" stroke="#ABC8A3" strokeWidth="1.5" />
          <line x1="70" y1="60" x2="60" y2="15" stroke="#ABC8A3" strokeWidth="1.5" strokeDasharray="3 3" className="animate-bond-flow" />

          {/* ذرات العقد الكيميائية الملونة */}
          <circle cx="20" cy="120" r="4.5" fill="#28729F" filter="drop-shadow(0 0 5px #28729F)" />
          <circle cx="70" cy="60" r="5.5" fill="#F0E295" filter="drop-shadow(0 0 8px #F0E295)" />
          <circle cx="130" cy="90" r="5" fill="#ABC8A3" />
          <circle cx="180" cy="40" r="6" fill="#28729F" filter="drop-shadow(0 0 8px #28729F)" />
          <circle cx="220" cy="70" r="4" fill="#F0E295" />
          <circle cx="145" cy="140" r="3.5" fill="#ABC8A3" />
          <circle cx="60" cy="15" r="4" fill="#F0E295" filter="drop-shadow(0 0 6px #F0E295)" />
        </svg>
      </div>

      {/* الشكل 4: دورق كيميائي معملي هندسي مع تفاعل صاعد (أعلى اليسار) */}
      <div
        className="absolute top-[16%] left-[3%] sm:left-[8%] w-28 h-36 sm:w-36 sm:h-44 opacity-20 animate-molecule-1 pointer-events-none"
        style={{ "--duration": "42s" } as React.CSSProperties}
      >
        <svg viewBox="0 0 100 130" className="w-full h-full overflow-visible">
          {/* فوهة وعنق الدورق الكيميائي */}
          <rect x="42" y="10" width="16" height="4" rx="2" fill="none" stroke="#ABC8A3" strokeWidth="1.5" />
          <line x1="45" y1="14" x2="45" y2="45" stroke="#ABC8A3" strokeWidth="1.5" />
          <line x1="55" y1="14" x2="55" y2="45" stroke="#ABC8A3" strokeWidth="1.5" />
          
          {/* جسم الدورق المخروطي */}
          <path
            d="M 45,45 L 18,105 A 6,6 0 0,0 23,114 L 77,114 A 6,6 0 0,0 82,105 L 55,45 Z"
            fill="none"
            stroke="#ABC8A3"
            strokeWidth="1.6"
          />

          {/* منسوب السائل الكيميائي التفاعلي */}
          <path
            d="M 28,90 Q 50,86 72,90 L 78,108 A 4,4 0 0,1 74,112 L 26,112 A 4,4 0 0,1 22,108 Z"
            fill="#28729F"
            opacity="0.35"
          />

          {/* شرط قياس المليليتر على جدار الدورق */}
          <line x1="30" y1="95" x2="36" y2="95" stroke="#F0E295" strokeWidth="1.2" opacity="0.8" />
          <line x1="34" y1="85" x2="38" y2="85" stroke="#ABC8A3" strokeWidth="1.2" opacity="0.6" />
          <line x1="38" y1="75" x2="44" y2="75" stroke="#ABC8A3" strokeWidth="1.2" opacity="0.6" />

          {/* فقاعات كيميائية نشطة تتصاعد داخل الدورق */}
          <circle cx="48" cy="98" r="2.5" fill="#F0E295" opacity="0.8" className="animate-bubble" style={{ "--bubble-duration": "2.8s", "--drift-x": "2px" } as React.CSSProperties} />
          <circle cx="58" cy="104" r="2" fill="#28729F" opacity="0.9" className="animate-bubble" style={{ "--bubble-duration": "3.4s", "--bubble-delay": "1s", "--drift-x": "-3px" } as React.CSSProperties} />
          <circle cx="40" cy="106" r="1.8" fill="#ABC8A3" opacity="0.7" className="animate-bubble" style={{ "--bubble-duration": "2.2s", "--bubble-delay": "0.5s", "--drift-x": "4px" } as React.CSSProperties} />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 5. فقاعات التفاعل الكيميائي الصاعدة عبر الشاشة بالكامل (Effervescence)   */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none">
        {screenBubbles.map((bubble) => (
          <span
            key={bubble.id}
            className="absolute rounded-full animate-screen-bubble"
            style={
              {
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: bubble.left,
                bottom: "0px",
                backgroundColor: bubble.color,
                boxShadow: `0 0 8px ${bubble.color}aa`,
                "--bubble-duration": bubble.duration,
                "--bubble-delay": bubble.delay,
                "--drift-x": bubble.drift,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* 6. إضاءة مركزية خافتة لحفظ التباين والقراءة المريحة */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[550px] h-[550px] rounded-full blur-[150px] opacity-[0.11] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #F0E295 0%, #023A22 65%, transparent 100%)",
        }}
      />
    </div>
  );
}
