import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const schema = z.object({
  paths: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const token = req.headers.get("x-revalidate-token");
  const expected = process.env.REVALIDATE_TOKEN;
  if (!expected || token !== expected) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 },
    );
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid body" },
      { status: 400 },
    );
  }

  for (const path of parsed.data.paths ?? []) {
    revalidatePath(path);
  }
  for (const tag of parsed.data.tags ?? []) {
    revalidateTag(tag);
  }

  logger.info(
    { paths: parsed.data.paths, tags: parsed.data.tags },
    "on-demand revalidation",
  );

  return NextResponse.json({ ok: true });
}
