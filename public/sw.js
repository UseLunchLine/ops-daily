const CACHE_NAME = 'ops-daily-v1';

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

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
