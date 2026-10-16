const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Fire-and-forget: a slow/unreachable frontend should never fail the write
// that triggered it.
export async function revalidatePaths(paths: string[]): Promise<void> {
  try {
    await fetch(`${FRONTEND_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  } catch (err: any) {
    console.error("[revalidate] failed:", err?.message ?? err);
  }
}
