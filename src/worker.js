// Serves the static site from ./public and one small endpoint:
//   GET /api/videos -> the channel's latest services, read from YouTube's public feed.
// Static files are served before this code runs, so the Worker only wakes up for /api/videos
// (and for 404s, which it hands back to the static 404 page).

import { parseFeed } from "./feed.js";

const CHANNEL_ID = "UC9wWITRrvU3R1KFU_vNoznQ";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const FRESH_SECONDS = 600; // check YouTube at most every 10 minutes

function json(body, status, maxAge) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${Math.min(maxAge, 300)}, s-maxage=${maxAge}`,
      "x-content-type-options": "nosniff",
    },
  });
}

async function videos(request, ctx) {
  if (request.method !== "GET" && request.method !== "HEAD") return json({ error: "method not allowed" }, 405, 0);

  const cache = caches.default;
  const key = new Request(new URL("/api/videos", request.url).toString(), { method: "GET" });
  const hit = await cache.match(key);
  if (hit) return hit;

  let res;
  try {
    const upstream = await fetch(FEED_URL, { cf: { cacheTtl: FRESH_SECONDS, cacheEverything: true } });
    if (!upstream.ok) throw new Error(`feed ${upstream.status}`);
    const list = parseFeed(await upstream.text());
    res = json({ channelId: CHANNEL_ID, videos: list }, 200, FRESH_SECONDS);
  } catch (err) {
    console.error("videos feed failed:", err && err.message);
    return json({ error: "feed unavailable", videos: [] }, 502, 60);
  }
  ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/videos") return videos(request, ctx);
    return env.ASSETS.fetch(request);
  },
};
