import { randomUUID } from "node:crypto";
import { logOrder } from "../utils/orderLogger.ts.js";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const order = {
    id: randomUUID(),
    ...body,
    createdAt: new Date().toISOString(),
  };

  await logOrder(order);

  return { success: true, order };
});
