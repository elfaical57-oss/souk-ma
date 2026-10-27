import api from "@/lib/api";

export function trackAdEvent(type: "impression" | "click") {
  api.post(`/ads/homepage/${type}`).catch(() => {});
}
