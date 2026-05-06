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
    const base = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
    fetch(`${base}/api/analytics/track`, {
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
