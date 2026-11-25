import { isIP } from "node:net";

export function clientIp(request: Request) {
  // The production proxy must overwrite these headers; do not forward client-supplied values.
  const raw = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "";
  const candidate = raw.trim();
  return isIP(candidate) ? candidate : "unknown-client";
}
