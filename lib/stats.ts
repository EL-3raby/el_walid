import fs from "fs";
import path from "path";
import { checkHasBlob } from "@/lib/storage";

export interface SiteStats {
  totalPageViews: number;
  googlePlayClicks: number;
  appStoreClicks: number;
  lastVisitedAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STATS_FILE = path.join(DATA_DIR, "stats.json");

export function getDefaultStats(): SiteStats {
  return {
    totalPageViews: 0,
    googlePlayClicks: 0,
    appStoreClicks: 0,
    lastVisitedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * جلب الإحصائيات من Vercel Blob
 */
async function getStatsFromBlob(): Promise<SiteStats | null> {
  if (!checkHasBlob()) return null;

  try {
    const { get } = await import("@vercel/blob");
    let blobRes = null;
    try {
      blobRes = await get("stats.json", { access: "private", useCache: false });
    } catch {
      try {
        blobRes = await get("stats.json", { access: "public", useCache: false });
      } catch {}
    }

    if (blobRes && blobRes.statusCode === 200 && blobRes.stream) {
      const text = await new Response(blobRes.stream).text();
      const data = JSON.parse(text);
      return {
        ...getDefaultStats(),
        ...data,
      };
    }
  } catch (err) {
    console.warn("Could not read stats from Blob:", err);
  }

  // محاولة بديلة عبر list
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "stats.json", limit: 1 });
    if (blobs && blobs.length > 0) {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      const res = await fetch(blobs[0].url, {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        return {
          ...getDefaultStats(),
          ...data,
        };
      }
    }
  } catch (err) {
    console.warn("Could not list stats from Blob:", err);
  }

  return null;
}

/**
 * حفظ الإحصائيات في Vercel Blob
 */
async function saveStatsToBlob(stats: SiteStats): Promise<boolean> {
  if (!checkHasBlob()) return false;

  const content = JSON.stringify(stats, null, 2);

  try {
    const { put } = await import("@vercel/blob");
    await put("stats.json", content, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return true;
  } catch (errPrivate) {
    try {
      const { put } = await import("@vercel/blob");
      await put("stats.json", content, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return true;
    } catch (errPublic) {
      console.error("Error saving stats to Vercel Blob:", errPublic);
      return false;
    }
  }
}

/**
 * جلب الإحصائيات الحالية
 */
export async function getStats(): Promise<SiteStats> {
  // 1. من Vercel Blob
  if (checkHasBlob()) {
    const blobStats = await getStatsFromBlob();
    if (blobStats) return blobStats;
  }

  // 2. من الملف المحلي
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = await fs.promises.readFile(STATS_FILE, "utf-8");
      return {
        ...getDefaultStats(),
        ...JSON.parse(data),
      };
    }
  } catch (err) {
    console.warn("Could not read local stats file:", err);
  }

  return getDefaultStats();
}

/**
 * تسجيل حدث جديد (زيارة صفحة أو ضغطة على زر متجر)
 */
export async function recordStatEvent(
  event: "pageview" | "click_google_play" | "click_app_store"
): Promise<SiteStats> {
  const current = await getStats();
  const now = new Date().toISOString();

  const updated: SiteStats = {
    ...current,
    totalPageViews:
      event === "pageview"
        ? current.totalPageViews + 1
        : current.totalPageViews,
    googlePlayClicks:
      event === "click_google_play"
        ? current.googlePlayClicks + 1
        : current.googlePlayClicks,
    appStoreClicks:
      event === "click_app_store"
        ? current.appStoreClicks + 1
        : current.appStoreClicks,
    lastVisitedAt: now,
    updatedAt: now,
  };

  // 1. حفظ في Vercel Blob
  if (checkHasBlob()) {
    await saveStatsToBlob(updated);
  }

  // 2. حفظ في الملف المحلي
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(STATS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (err) {
    console.warn("Skipped local stats write:", err);
  }

  return updated;
}

/**
 * تصفير العداد عند الحاجة
 */
export async function resetStats(): Promise<SiteStats> {
  const reset = getDefaultStats();
  if (checkHasBlob()) {
    await saveStatsToBlob(reset);
  }
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(STATS_FILE, JSON.stringify(reset, null, 2), "utf-8");
  } catch (_) {}

  return reset;
}
