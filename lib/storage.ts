import fs from "fs";
import path from "path";
import { launchConfig } from "@/config/launch";

export interface DynamicLaunchConfig {
  launchDate: string;
  googlePlay: string;
  appStore: string;
  forceLaunched: boolean;
  tagline: string;
  description: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(DATA_DIR, "launch-config.json");

// 1. فحص Vercel Blob
const HAS_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// 2. فحص Vercel KV / Upstash Redis
const KV_URL =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL;

const KV_TOKEN =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

const HAS_KV = Boolean(KV_URL && KV_TOKEN);

export const hasCloudStorage = Boolean(HAS_BLOB || HAS_KV);

export function getDefaultConfig(): DynamicLaunchConfig {
  return {
    launchDate: launchConfig.launchDate,
    googlePlay: launchConfig.storeLinks.googlePlay,
    appStore: launchConfig.storeLinks.appStore,
    forceLaunched: false,
    tagline: launchConfig.tagline,
    description: launchConfig.description,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * جلب البيانات من Vercel Blob
 */
async function getFromBlob(): Promise<DynamicLaunchConfig | null> {
  if (!HAS_BLOB) return null;

  try {
    const { get } = await import("@vercel/blob");
    // تجربة القراءة كـ private أولاً لأن المتجر من نوع Private
    let blobRes = null;
    try {
      blobRes = await get("launch-config.json", { access: "private" });
    } catch {
      try {
        blobRes = await get("launch-config.json", { access: "public" });
      } catch {}
    }

    if (blobRes && blobRes.statusCode === 200 && blobRes.stream) {
      const text = await new Response(blobRes.stream).text();
      const data = JSON.parse(text);
      return {
        ...getDefaultConfig(),
        ...data,
      };
    }
  } catch (error) {
    console.warn("Notice: get() from Vercel Blob returned empty or failed:", error);
  }

  // محاولة بديلة عبر list
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "launch-config.json", limit: 1 });
    if (blobs && blobs.length > 0) {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      const res = await fetch(blobs[0].url, {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        return {
          ...getDefaultConfig(),
          ...data,
        };
      }
    }
  } catch (error) {
    console.error("Error fallback reading from Vercel Blob:", error);
  }

  return null;
}

/**
 * حفظ البيانات في Vercel Blob
 */
async function saveToBlob(config: DynamicLaunchConfig): Promise<boolean> {
  if (!HAS_BLOB) return false;

  const content = JSON.stringify(config, null, 2);

  // 1. تجربة الحفظ كـ private (المتجر منشأ كـ Private على Vercel)
  try {
    const { put } = await import("@vercel/blob");
    await put("launch-config.json", content, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return true;
  } catch (errPrivate) {
    console.warn("Private put attempt error, attempting public fallback:", errPrivate);
    // 2. تجربة public كبديل
    try {
      const { put } = await import("@vercel/blob");
      await put("launch-config.json", content, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return true;
    } catch (errPublic) {
      console.error("Error saving to Vercel Blob:", errPublic);
      return false;
    }
  }
}

/**
 * جلب البيانات من Vercel KV / Upstash السحابي
 */
async function getFromCloudKV(): Promise<DynamicLaunchConfig | null> {
  if (!HAS_KV || !KV_URL || !KV_TOKEN) return null;

  try {
    const res = await fetch(KV_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["GET", "alwaleed_launch_config"]),
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        const parsed =
          typeof data.result === "string" ? JSON.parse(data.result) : data.result;
        return {
          ...getDefaultConfig(),
          ...parsed,
        };
      }
    }
  } catch (error) {
    console.error("Error reading from Vercel KV / Upstash:", error);
  }

  return null;
}

/**
 * حفظ البيانات في Vercel KV / Upstash السحابي
 */
async function saveToCloudKV(config: DynamicLaunchConfig): Promise<boolean> {
  if (!HAS_KV || !KV_URL || !KV_TOKEN) return false;

  try {
    const res = await fetch(KV_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["SET", "alwaleed_launch_config", JSON.stringify(config)]),
    });

    if (res.ok) {
      return true;
    }
  } catch (error) {
    console.error("Error saving to Vercel KV / Upstash:", error);
  }

  return false;
}

/**
 * جلب الإعدادات المحدثة:
 * 1. أولاً من Vercel Blob إذا كان متصلاً.
 * 2. ثانياً من Vercel KV / Upstash إذا كان متصلاً.
 * 3. ثالثاً من الملف المحلي data/launch-config.json على السيرفر المحلي.
 * 4. رابعاً من القيم الافتراضية.
 */
export async function getLaunchConfig(): Promise<DynamicLaunchConfig> {
  // 1. فحص Vercel Blob
  if (HAS_BLOB) {
    const blobData = await getFromBlob();
    if (blobData) return blobData;
  }

  // 2. فحص Vercel KV / Upstash
  if (HAS_KV) {
    const kvData = await getFromCloudKV();
    if (kvData) return kvData;
  }

  // 3. فحص الملف المحلي (بيئة Localhost)
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = await fs.promises.readFile(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return {
        ...getDefaultConfig(),
        ...parsed,
      };
    }
  } catch (error) {
    console.warn("Could not read local file config:", error);
  }

  return getDefaultConfig();
}

/**
 * حفظ الإعدادات:
 * 1. في Vercel Blob إن وجد.
 * 2. في Vercel KV / Upstash إن وجد.
 * 3. في الملف المحلي إن كان نظام الملفات يسمح بالكتابة (Localhost).
 */
export async function saveLaunchConfig(
  updates: Partial<DynamicLaunchConfig>
): Promise<{ config: DynamicLaunchConfig; savedToCloud: boolean; savedToLocal: boolean }> {
  const current = await getLaunchConfig();
  const updated: DynamicLaunchConfig = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  let savedToCloud = false;
  let savedToLocal = false;

  // 1. حفظ في Vercel Blob
  if (HAS_BLOB) {
    savedToCloud = await saveToBlob(updated);
  }

  // 2. حفظ في Vercel KV
  if (HAS_KV) {
    const kvSaved = await saveToCloudKV(updated);
    savedToCloud = savedToCloud || kvSaved;
  }

  // 3. الحفظ المحلي (للعمل في البيئة المحلية)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(
      CONFIG_FILE,
      JSON.stringify(updated, null, 2),
      "utf-8"
    );
    savedToLocal = true;
  } catch (error) {
    console.warn("Local filesystem write skipped (expected on Vercel):", error);
  }

  return {
    config: updated,
    savedToCloud,
    savedToLocal,
  };
}
