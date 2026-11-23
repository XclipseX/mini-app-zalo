import type { Request } from "firebase-functions/v2/https";
import type { Response } from "express";

// Lỗi có mã HTTP
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Bọc handler: chỉ nhận POST JSON, trả lỗi dạng {error}
export function handle(fn: (body: any) => Promise<unknown>) {
  return async (req: Request, res: Response) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    try {
      const body = req.body && typeof req.body === "object" ? req.body : {};
      res.json(await fn(body));
    } catch (e: any) {
      const status = e instanceof HttpError ? e.status : 500;
      if (status === 500) console.error(e);
      res.status(status).json({ error: e?.message || "Internal error" });
    }
  };
}

export function str(v: unknown, name: string): string {
  if (typeof v !== "string" || !v) throw new HttpError(400, `Thiếu ${name}`);
  return v;
}
