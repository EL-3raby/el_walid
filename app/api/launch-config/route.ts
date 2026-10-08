import { NextResponse } from "next/server";
import { getLaunchConfig, saveLaunchConfig, getDefaultConfig } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await getLaunchConfig();
    return NextResponse.json(
      { success: true, config },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/launch-config error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load configuration", config: getDefaultConfig() },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await saveLaunchConfig(body);
    return NextResponse.json(
      { success: true, message: "تم حفظ الإعدادات بنجاح", config: updated },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/launch-config error:", error);
    return NextResponse.json(
      { success: false, error: "فشل حفظ التعديلات" },
      { status: 500 }
    );
  }
}
