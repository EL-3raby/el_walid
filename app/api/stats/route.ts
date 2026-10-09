import { NextResponse } from "next/server";
import { getStats, recordStatEvent, resetStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(
      { success: true, stats },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { success: false, error: "فشل جلب الإحصائيات" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const event = body.event;

    if (event === "reset") {
      const stats = await resetStats();
      return NextResponse.json({ success: true, stats, message: "تم تصفير العداد بنجاح" });
    }

    if (
      event === "pageview" ||
      event === "click_google_play" ||
      event === "click_app_store"
    ) {
      const stats = await recordStatEvent(event);
      return NextResponse.json({ success: true, stats });
    }

    return NextResponse.json(
      { success: false, error: "نوع الحدث غير معروف" },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /api/stats error:", error);
    return NextResponse.json(
      { success: false, error: "فشل تسجيل الإحصائية" },
      { status: 500 }
    );
  }
}
