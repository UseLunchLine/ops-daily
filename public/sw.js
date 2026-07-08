const CACHE_NAME = 'ops-daily-v1';

// On install, do NOT auto-skipWaiting — this prevents force-reloading
// open tabs on every deploy. Instead we wait for a message from the app.
self.addEventListener('install', e => {
  // intentionally no skipWaiting here
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Allow the app to trigger skipWaiting manually (e.g. when user is idle)
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', e => {
  // Activate immediately so push events are never missed
  e.waitUntil(
    self.skipWaiting().then(() => clients.claim()).then(() => {
      let data = { title: 'Ops Daily', body: 'New notification' };
      try { data = e.data ? e.data.json() : data; } catch(err) {}
      const options = {
        body: data.body,
        icon: '/apple-touch-icon.png',
        badge: '/apple-touch-icon.png',
        vibrate: [200, 100, 200],
        requireInteraction: data.urgent || false,
        tag: data.title,
        renotify: true,
        data: { url: data.url || '/' }
      };
      return self.registration.showNotification(data.title, options);
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
      for(const c of list){ if('focus' in c) return c.focus(); }
      return clients.openWindow('/');
    })
  );
});
