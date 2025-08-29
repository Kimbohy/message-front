export function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatLastSeen(ts: number) {
  const now = new Date();
  const msgDate = new Date(ts);
  const diffTime = now.getTime() - msgDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  // Same day - show time
  if (diffDays === 0) {
    if (diffMinutes < 1) return "now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    return formatTime(ts);
  }

  // Yesterday
  if (diffDays === 1) return "Yesterday";

  // This week - show day name
  if (diffDays < 7) return msgDate.toLocaleDateString([], { weekday: "short" });

  // Older - show date
  if (diffDays < 365)
    return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });

  // Very old - show year too
  return msgDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
