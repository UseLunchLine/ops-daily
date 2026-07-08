const CACHE_NAME = 'ops-daily-v1';

// Do NOT call skipWaiting — let the new SW wait until all tabs are closed
// before activating. This prevents force-reloading open tabs on every deploy.
self.addEventListener('install', e => {
  // intentionally no skipWaiting
});

self.addEventListener('activate', e => {
  // Take control of existing clients only after natural takeover
  e.waitUntil(clients.claim());
});

self.addEventListener('push', e => {
  let data = { title: 'Ops Daily', body: 'New notification' };
  try { data = e.data ? e.data.json() : data; } catch(err) {}
  const options = {
    body: data.body,
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    requireInteraction: data.urgent || false,
    tag: data.title,
    renotify: true,
    data: { url: data.url || '/' }
  };
  e.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
    for(const c of list){ if('focus' in c) return c.focus(); }
    return clients.openWindow('/');
  }));
});
