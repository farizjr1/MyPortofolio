import { useEffect } from "react";
import { useLocation } from "wouter";

let sessionId: string;
function getSessionId(): string {
  if (!sessionId) {
    sessionId = sessionStorage.getItem("_sid") ?? "";
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("_sid", sessionId);
    }
  }
  return sessionId;
}

export function usePageTracker() {
  const [location] = useLocation();

  useEffect(() => {
    const apiBase = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "")
      ?? import.meta.env.BASE_URL?.replace(/\/$/, "")
      ?? "";
    fetch(`${apiBase}/api/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: location,
        referrer: document.referrer || undefined,
        sessionId: getSessionId(),
      }),
    }).catch(() => {});
  }, [location]);
}
