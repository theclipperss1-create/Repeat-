export function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

export function isTomorrow(date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear();
}

export function formatReminderTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffMinutes > 0 && diffMinutes <= 60) return `In ${diffMinutes} min`;
  if (diffHours > 0 && diffHours <= 4) return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  if (diffMinutes < 0 && diffMinutes >= -30) return `${Math.abs(diffMinutes)} min ago`;

  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  if (isToday(date)) return `Today, ${timeStr}`;
  if (isTomorrow(date)) return `Tomorrow, ${timeStr}`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${timeStr}`;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning.';
  if (hour < 17) return 'Good afternoon.';
  return 'Good evening.';
}

export function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
