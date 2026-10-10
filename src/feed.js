// Parses YouTube's public channel feed (Atom XML) into a small list of videos.
// No API key needed. The feed holds the channel's 15 most recent uploads.

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

export function decode(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
      if (e[0] === "#") {
        const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m;
      }
      return ENTITIES[e.toLowerCase()] ?? m;
    });
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1].trim()) : "";
}

export function parseFeed(xml, limit = 15) {
  const out = [];
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  for (const e of entries) {
    const id = tag(e, "yt:videoId");
    if (!/^[\w-]{11}$/.test(id)) continue;
    // skip Shorts: this section is for services
    const link = (e.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/) || [])[1] || "";
    if (link.includes("/shorts/")) continue;
    const published = tag(e, "published");
    out.push({
      id,
      title: tag(e, "title").slice(0, 200),
      published: Number.isNaN(Date.parse(published)) ? null : new Date(published).toISOString(),
    });
    if (out.length >= limit) break;
  }
  return out;
}
