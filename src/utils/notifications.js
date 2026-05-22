export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function showNotification(title, body) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        tag: 'repeat-reminder',
        requireInteraction: true, // Keep it visible until dismissed on supported OS
      });
    } catch (e) {
      console.warn("Could not fire desktop notification:", e);
    }
  }
}
