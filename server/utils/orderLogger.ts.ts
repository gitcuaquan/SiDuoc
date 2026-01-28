// server/utils/orderLogger.ts
import { promises as fs } from "fs";
import path from "path";

const LOG_DIR = path.resolve("server/logs");
const MAX_DAYS = 30;

function getTodayFile() {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(LOG_DIR, `orders-${date}.log`);
}

async function ensureDir() {
  await fs.mkdir(LOG_DIR, { recursive: true });
}

// Xóa log quá 30 ngày
async function cleanupOldLogs() {
  const files = await fs.readdir(LOG_DIR).catch(() => []);
  const now = Date.now();

  for (const file of files) {
    if (!file.startsWith("orders-")) continue;
    const datePart = file.replace("orders-", "").replace(".log", "");
    const time = new Date(datePart).getTime();
    if (now - time > MAX_DAYS * 24 * 60 * 60 * 1000) {
      await fs.unlink(path.join(LOG_DIR, file)).catch(() => {});
    }
  }
}

export async function logOrder(orderData: any) {
  await ensureDir();
  await cleanupOldLogs();

  const file = getTodayFile();
  const logLine =
    `[${new Date().toISOString()}] ` + JSON.stringify(orderData) + "\n";

  await fs.appendFile(file, logLine, "utf8");
}
