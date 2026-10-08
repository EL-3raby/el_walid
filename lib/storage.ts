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

export async function getLaunchConfig(): Promise<DynamicLaunchConfig> {
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
    console.error("Error reading launch config from disk:", error);
  }
  return getDefaultConfig();
}

export async function saveLaunchConfig(
  updates: Partial<DynamicLaunchConfig>
): Promise<DynamicLaunchConfig> {
  const current = await getLaunchConfig();
  const updated: DynamicLaunchConfig = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(
      CONFIG_FILE,
      JSON.stringify(updated, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error saving launch config to disk:", error);
  }

  return updated;
}
