export function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatLastSeen(ts: number) {
  const now = new Date();
  const msgDate = new Date(ts);
  const diffTime = now.getTime() - msgDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return formatTime(ts);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return msgDate.toLocaleDateString([], { weekday: "short" });
  return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
}
