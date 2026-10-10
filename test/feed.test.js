import assert from "node:assert/strict";
import { parseFeed, decode } from "../src/feed.js";

const entry = (id, title, published, link = `https://www.youtube.com/watch?v=${id}`) => `
 <entry>
  <id>yt:video:${id}</id>
  <yt:videoId>${id}</yt:videoId>
  <yt:channelId>UC9wWITRrvU3R1KFU_vNoznQ</yt:channelId>
  <title>${title}</title>
  <link rel="alternate" href="${link}"/>
  <author><name>Iglesia Adventista IASD Las Piedras, PR</name></author>
  <published>${published}</published>
  <updated>${published}</updated>
  <media:group><media:title>${title}</media:title><media:thumbnail url="https://i1.ytimg.com/vi/${id}/hqdefault.jpg" width="480" height="360"/></media:group>
 </entry>`;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <title>Iglesia Adventista IASD Las Piedras, PR</title>
 ${entry("abcDEF12345", "Iglesia Adventista Las Piedras, PR Live Stream", "2026-10-03T13:10:00+00:00")}
 ${entry("short_12345", "Un short", "2026-10-02T13:10:00+00:00", "https://www.youtube.com/shorts/short_12345")}
 ${entry("bad", "id inválido", "2026-10-01T13:10:00+00:00")}
 ${entry("Q-w_E-r_T-y", "Semana de oración &amp; cánticos &#8220;especial&#8221;", "2026-09-26T13:10:00+00:00")}
</feed>`;

const list = parseFeed(xml);
assert.equal(list.length, 2, "shorts and bad ids are skipped");
assert.deepEqual(list[0], { id: "abcDEF12345", title: "Iglesia Adventista Las Piedras, PR Live Stream", published: "2026-10-03T13:10:00.000Z" });
assert.equal(list[1].title, "Semana de oración & cánticos “especial”");
assert.equal(parseFeed(xml, 1).length, 1, "limit works");
assert.equal(parseFeed("not xml").length, 0);
assert.equal(decode("&lt;b&gt; &#x41; &unknown;"), "<b> A &unknown;");
console.log("feed tests passed");
