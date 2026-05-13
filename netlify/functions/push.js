const webPush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

webPush.setVapidDetails('mailto:admin@opsdaily.app', VAPID_PUBLIC, VAPID_PRIVATE);

const ADMIN_ROLES = ['admin', 'director', 'supervisor', 'chef'];

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { title, body, urgent, from_user_id, audience, notify_school_id } = JSON.parse(event.body);
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Get all push subscriptions joined with user data
    const { data: subs } = await supabase.from('push_subscriptions').select('*');
    if (!subs || !subs.length) return { statusCode: 200, body: 'No subscribers' };

    // Get user roles and school assignments for filtering
    const userIds = subs.map(s => s.user_id);
    const { data: users } = await supabase.from('app_users').select('id,role,school_ids').in('id', userIds);
    const userMap = {};
    (users || []).forEach(u => userMap[u.id] = u);

    const filtered = subs.filter(sub => {
      if (sub.user_id === from_user_id) return false;
      const u = userMap[sub.user_id];
      if (!u) return false;
      const role = u.role || 'admin';
      const schoolIds = u.school_ids || [];

      // Issue notification - filter by school
      if (notify_school_id) {
        if (ADMIN_ROLES.includes(role)) return true;
        if (role === 'kitchen_manager') return schoolIds.includes(notify_school_id);
        return false;
      }

      // Announcement - filter by audience
      if (audience === 'all') return true;
      if (audience === 'admin_team') return ADMIN_ROLES.includes(role);
      if (audience === 'kitchen_manager') return role === 'kitchen_manager';

      // Default admin team only
      return ADMIN_ROLES.includes(role);
    });

    if (!filtered.length) return { statusCode: 200, body: 'No matching subscribers' };

    const payload = JSON.stringify({ title: 'Ops Daily — ' + title, body, urgent: urgent || false, url: '/' });

    const results = await Promise.allSettled(
      filtered.map(sub => {
        try { return webPush.sendNotification(JSON.parse(sub.subscription_data), payload); }
        catch (e) { return Promise.reject(e); }
      })
    );

    const expired = results.reduce((acc, r, i) => {
      if (r.status === 'rejected' && r.reason?.statusCode === 410) acc.push(filtered[i].id);
      return acc;
    }, []);
    if (expired.length) await supabase.from('push_subscriptions').delete().in('id', expired);

    return { statusCode: 200, body: JSON.stringify({ sent: results.filter(r => r.status === 'fulfilled').length }) };
  } catch (e) {
    console.error('Push error:', e);
    return { statusCode: 500, body: e.message };
  }
};
