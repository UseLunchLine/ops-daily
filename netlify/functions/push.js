const webPush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

webPush.setVapidDetails(
  'mailto:admin@opsdaily.app',
  VAPID_PUBLIC,
  VAPID_PRIVATE
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { title, body, school_id, urgent, from_user_id } = JSON.parse(event.body);
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Get relevant subscriptions
    let query = supabase.from('push_subscriptions').select('*');
    // Don't notify the person who sent it
    if (from_user_id) query = query.neq('user_id', from_user_id);
    // If school-specific, get that school's subscribers + admin/directors
    const { data: subs } = await query;
    if (!subs || subs.length === 0) return { statusCode: 200, body: 'No subscribers' };

    const payload = JSON.stringify({
      title: 'Ops Daily — ' + title,
      body,
      urgent: urgent || false,
      url: '/'
    });

    const results = await Promise.allSettled(
      subs.map(sub => {
        try {
          const subscription = JSON.parse(sub.subscription_data);
          return webPush.sendNotification(subscription, payload);
        } catch (e) {
          return Promise.reject(e);
        }
      })
    );

    const sent = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Clean up expired subscriptions
    const expiredIndexes = results.reduce((acc, r, i) => {
      if (r.status === 'rejected' && r.reason?.statusCode === 410) acc.push(subs[i].id);
      return acc;
    }, []);
    if (expiredIndexes.length) {
      await supabase.from('push_subscriptions').delete().in('id', expiredIndexes);
    }

    return { statusCode: 200, body: JSON.stringify({ sent, failed }) };
  } catch (e) {
    console.error('Push error:', e);
    return { statusCode: 500, body: e.message };
  }
};
