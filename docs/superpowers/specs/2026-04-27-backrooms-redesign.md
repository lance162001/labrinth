# Backrooms Path Redesign
*Spec — 2026-04-27*

## Overview

Rewrite and significantly expand Path 8 (The Backrooms) in `html/index.html`. The path currently has 15 rooms across 3 stages. The new design has 100 rooms across 4 stages, with a template pool for variation, decayed portal elements from other site scenes, real browser/session data, and cosmetic URL bar manipulation.

**Theme:** Digital infrastructure horror. The web as something vast, broken, and indifferent underneath. The site is an iceberg — the backrooms is everything below the waterline. Not literal rooms or creatures. The horror is the user, the site, the internet, and the machine running it.

---

## Stage Structure

100 rooms per cycle. Content is driven by `slot = ((roomArg - 1) % 100) + 1`. Stage is derived from slot:

- **Stage 1:** slots 1–25
- **Stage 2:** slots 26–50
- **Stage 3:** slots 51–75
- **Stage 4:** slots 76–100

Display number jumps ~950,000 per loop: `displayNum = roomArg + floor((roomArg - 1) / 100) * 950000`.

`br-mode` CSS class applies from Stage 2 onward (currently from Stage 2). Stage 4 gets an additional `br-deep` class.

---

## Stage 1 — The Diagnostic Surface (Slots 1–25)

**Visual:** Still looks like the Nexus SaaS UI. Clean nav, system cards, buttons. Things are subtly wrong — nav links go forward, step counters are off, status cards contradict themselves.

**Tone:** Clinical. The system acknowledges your presence as routine. No overt dread yet.

**Browser data used:** `navigator.userAgent` (parsed to browser name + version), `window.innerWidth`/`innerHeight`, `navigator.platform`, `new Date().toLocaleTimeString()`.

**Template pool (slots used by templates):** ~17 slots. 8 landmark slots are fixed content (see below).

### Stage 1 Template Assignment

Non-landmark slots use template selected by `(slot % 5)`: 0→T1-A, 1→T1-B, 2→T1-C, 3→T1-D, 4→T1-E.

### Stage 1 Templates

**T1-A — Status Card:** A system status card. `All systems operational.` or a fault. One field always says `Client: [browser] / [platform]` or `Viewport: [w]×[h]`. Button: `Proceed →`.

**T1-B — Pipeline Notice:** Short bureaucratic notice. Phrasing cycles. Signer varies: `— The Nexus Infrastructure Team`, `— Automated Diagnostics`, `— Cache Warming Process`. Button: `Proceed →`.

**T1-C — Diagnostic Log (short):** 4–5 log lines. One line references room number. One line references viewport or browser. All lines end `OK`. Button: `Proceed →`.

**T1-D — Free Trial Card:** Looks like the dashboard trial banner. Always says `14 days remaining`. Below in small text: `(has always been 14 days remaining)`. Button: `Proceed →`.

**T1-E — Two-Button Room:** Pipeline status: nominal. Two identical `Proceed →` buttons side by side. Both go forward.

### Stage 1 Landmark Rooms

| Slot | Content |
|------|---------|
| 1 | `"Diagnostic Console"` heading. `"No errors found."` Below in italics: `"(you have been here before.)"` |
| 3 | Cookie banner appears mid-room: cookies named `session_ghost`, `render_id_orphan`, `consent_cache_stale`. Accept All / Customize both advance. |
| 7 | Pricing table fragment. Starter: `$NaN/mo`. Pro: `$undefined`. Enterprise: `Contact [object Object]`. Each CTA: `Proceed →`. |
| 12 | Signup step counter: `"Step 8 of 3"`. No other text. One `Proceed →`. |
| 15 | Features loading bar stuck at 95%. Status text: `"Loading: indeterminate"`. Below: `"This has been loading since before you arrived."` |
| 18 | `"Getting colder."` in green alert. Free trial: `14 days remaining`. Always. |
| 22 | Nav links replaced with `→ Next Room` × 3, labeled visibly. |
| 25 | Transition room. Status: `"Fault detected in layer below."` `"Descending to network layer."` Button: `continue`. Style starts shifting toward Stage 2. |

---

## Stage 2 — The Network Layer (Slots 26–50)

**Visual:** Yellow/sepia tones (`#f5f0e0` → `#d2c280` progression). Monospace everywhere. Letter-spacing widens with each room.

**Tone:** Infrastructure exposed. DNS, CDN, routing, latency. The pipes are visible and they are broken.

**Browser data used:** `Intl.DateTimeFormat().resolvedOptions().timeZone`, `navigator.language`, `navigator.languages.join(', ')`, `navigator.connection?.effectiveType ?? 'unknown'`, `navigator.onLine`.

### Stage 2 Template Assignment

Non-landmark slots use template selected by `(slot % 5)`: 0→T2-A, 1→T2-B, 2→T2-C, 3→T2-D, 4→T2-E.

### Stage 2 Templates

**T2-A — Fault Code:** `Pipeline fault detected. Attempting recovery.` Fault code: `0x[hex derived from roomArg × 7 + S.depth]`. Origin: unknown. Time elapsed: indeterminate.

**T2-B — Routing Notice:** CDN edge location derived from timezone region. `"Request routed through [region] edge."` `"Round-trip: [roomArg % 800 + 200]ms."` `"[roomArg % 3 === 0 ? 'Cache miss.' : 'Cache stale.']"`. Button: `continue`.

**T2-C — DNS Entry:** Fake DNS lookup result. Domain: `nexus-[hex].internal`. Record: `CNAME → [another fake domain]`. TTL: `indeterminate`. Below: `"This record has been propagating since [2017 + (slot % 6)]."` Button: `continue`.

**T2-D — Support Chat (inline):** Border box. Header: `SUPPORT CHAT — CONNECTED`. Nexus Bot: `"Still looking into it…"`. Time sent: unknown. Agents available: 0. Button: `continue`.

**T2-E — Newsletter Capture (decayed):** The Blog "Coming Soon" newsletter form, but the email field is pre-filled with `navigator.language` (e.g. `"en-US"`). Label: `"Subscribing: [language]"`. Submit button goes forward.

### Stage 2 Landmark Rooms

| Slot | Content |
|------|---------|
| 26 | First Stage 2 room. Full-width header: `NEXUS — NETWORK DIAGNOSTIC — LAYER 2`. Below: `"You have passed the application layer."` `"What follows is not intended for users."` |
| 30 | Changelog fragment. Every entry: `"[timestamp] User navigated deeper."` Dozens of entries, all identical except timestamp. Last entry timestamp: `now`. |
| 35 | Roadmap, but columns are `"In Transit"`, `"Routing"`, `"Lost in Queue"`. All items are infrastructure items: `"Resolve DNS ambiguity (since 2019)"`, `"Drain legacy session pool"`, `"Migrate CDN region (blocked)"`. |
| 38 | Auto-ticket: `"> Ticket #[displayNum] opened automatically"` / `"> Analyzing issue…"` / `"> Ticket resolved: you are not supposed to be here"` / `"> Closing ticket."` |
| 42 | `"P l e a s e  r e a d  t h e —"` × 3, stuttering. Then: `"P l e a s e  r e a d  t h e  t e r m s"`. `[Recede]` button goes forward. `[Continue]` button is faded with note `(goes forward)`. |
| 46 | Connection status card. `"Your connection: [effectiveType]."` `"Language: [navigator.language]."` `"Online: [navigator.onLine]."` `"None of this is unusual."` |
| 50 | **Landmark — The Log Room.** Full-width server log. Rows scroll past (CSS animation): `GET /pricing 200 OK`, `GET /survey/q14 200 OK`, `GET /delete_account 200 OK`, etc. — events from elsewhere in the site. Then: `"GET /backrooms/room/00050 200 OK — you are reading this log."` Then: `"GET /backrooms/room/00051 200 OK — already written."` Button: `continue`. |

---

## Stage 3 — Server / Data Horror (Slots 51–75)

**Visual:** Dark backgrounds (`#1a1410` → `#0d0a06`). Amber/dim text. Near-black.

**Tone:** The server side. The site knows things. Session data, logs, cached requests, data that shouldn't exist. The site reflects the user back at themselves.

**Browser data used:** `performance.now()` formatted as session duration, `history.length`, `document.referrer`, `window.location.href`, `localStorage.length`, `document.cookie.length`, `screen.width`/`screen.height`.

### Stage 3 Template Assignment

Non-landmark slots use template selected by `(slot % 5)`: 0→T3-A, 1→T3-B, 2→T3-C, 3→T3-D, 4→T3-E.

### Stage 3 Templates

**T3-A — Session Mirror:** Reflects one piece of real session data per room. Cycles: viewport → session duration → history depth → referrer → cookie count → localStorage keys. Framing: `"[Field]: [value]"` `"This is noted."` Button: `keep going`.

**T3-B — Query Fragment:** `SELECT * FROM sessions WHERE id = '[performance.now() as hex]'` — result: `1 row expected. 1 row returned. 0 rows found.` Or: `UPDATE users SET [field] = '[value]' WHERE — [ERROR: ambiguous target]`. Button: `keep going`.

**T3-C — Log Entry (dense):** 6–8 lines of server log. Every line references the user's real data (timezone, language, viewport). One line: `"Session [hex]: active for [duration]."` One line: `"History depth: [history.length] entries."` Button: `keep going`.

**T3-D — Notice from Infrastructure:** Short notice, signer changes per room: `— Cache Layer 3`, `— An Automated Process`, `— The Part of the System That Handles This`, `— No One In Particular`. Content: a bureaucratic non-message about the user's presence being logged.

**T3-E — Export Status:** `"the export is [near-zero]% complete."` × 3. `"the export will never complete."` Then: `"it has your data."` Button: `keep going`.

### Stage 3 Landmark Rooms

| Slot | Content |
|------|---------|
| 51 | Transition. `"You have passed the network layer."` `"What follows is not a product."` Dark background begins. |
| 55 | Session expiry timer, but counting *up*. `"You have been here for [performance.now() formatted as m:ss]."` `"The session will not expire."` |
| 58 | Social proof widget. Companies: `"Your Browser"`, `"Your ISP"`, `"The CDN Serving This Page"`, `"A Server in [timezone region] You Have Never Heard Of"`. Testimonial: `"We knew you were here."` |
| 62 | Delete account modal fragment. Step 1 prompt: `"Type [roomArg] to confirm."` Input field accepts anything. Submit goes forward. |
| 66 | Survey Q19 appears floating. No UI chrome. Just: `"Are you currently being observed?"` Radio options: `Yes`, `No`, `This question is making me paranoid`, `Yes. Something is in the walls.` Any option advances. |
| 70 | Jordan's call script, fragments only. `"Jordan: We want to make sure you're getting value—"` `"[Hold music. Indeterminate.]"` `"Brad: This is Brad, Senior Retention Specialist."` `"Brad: We've noted your location in the system."` `"[End of available transcript.]"` |
| 75 | Onboarding checklist, all items checked red: `"Browser identified ✓"`, `"Viewport logged ✓"`, `"History indexed ✓"`, `"Session cached ✓"`, `"Exit path: unavailable ✓"`. Button: `keep going`. |

---

## Stage 4 — The Void (Slots 76–100)

**Visual:** Near-black or fully black. Minimal. Sparse text. Exit input visible from slot 76 onward.

**Tone:** The site is gone. What's left is the machine running it. Hardware numbers. The user as data.

**Browser data used:** `navigator.hardwareConcurrency`, `navigator.deviceMemory ?? 'unknown'`, `screen.colorDepth`, `navigator.getBattery()` (async, stored in `S.brBattery`), `window.devicePixelRatio`, `navigator.cookieEnabled`.

**CSS class:** `br-deep` added to body. New `@keyframes br-deep-flicker` — slower, more irregular than Stage 3.

### Stage 4 Template Assignment

Non-landmark slots use template selected by `(slot % 5)`: 0→T4-A, 1→T4-B, 2→T4-C, 3→T4-D, 4→T4-E.

### Stage 4 Templates

**T4-A — Raw Numbers:** Dump of hardware data. `"Cores: [hardwareConcurrency]"`. `"Memory: [deviceMemory]GB"`. `"Color depth: [colorDepth]bit"`. `"Pixel ratio: [devicePixelRatio]"`. `"Battery: [battery%] — [charging/discharging]"`. No framing. Just the numbers. Button: `keep going`.

**T4-B — Dissolved Notice:** A 1-sentence notice so stripped of context it means nothing. E.g.: `"The record has been updated."` Or `"Your request has been received."` Signer: nothing. Button: `keep going`.

**T4-C — Fragment Room:** A half-sentence from somewhere else in the site. Cut off mid-thought. E.g.: `"Jordan begins the retention scri—"` or `"Step 8 of —"` or `"All systems opera—"`. Then silence. Button: `keep going`.

**T4-D — Two-Button Trap:** Two identically labeled `[ return ]` buttons. Both go forward. No other text.

**T4-E — Empty Room:** Just the room number. Nothing else. One button with no label (empty string). Goes forward.

### Stage 4 Landmark Rooms

| Slot | Content |
|------|---------|
| 76 | First Stage 4 room. `"you have been here for [duration]."` `"the exit is here."` Exit input appears. |
| 80 | Careers confirmation fragment. `"Application submitted!"` Position: `[undefined]`. `"We'll be in touch in [NaN]–[NaN] weeks."` `"The assessment is still pending."` |
| 84 | Nav bar only. No logo text — just the wordmark in color barely distinguishable from background. No links. Room number in top-right. Button: `keep going` in bottom-left. |
| 88 | **The hint room.** `"the code is"` followed by the word `LEVEL0` in text colored to match background (`color: #0d0a06` on `#0d0a06` bg). Selectable but invisible. Button: `keep going`. |
| 92 | `"you have been here before."` `"you will be here again."` `"there is no other direction."` Exit input. Button: `keep going`. |
| 96 | Mirror of Room 1, but degraded. Same heading: `"Diagnostic Console"`. Same text: `"No errors found."` But background is near-black, text is barely visible, and below: `"(you have been here before.)"` has become `"(you never left.)"`. |
| 100 | Final room before loop. `"end of indexed range."` `"continuing."` Display number jumps on next press. Exit input. Button: `continue`. |

---

## URL Bar Progression

Each `scene_backrooms()` call runs `history.replaceState(null, '', path)` to cosmetically update the URL. Path grows with each room and is never shortened. On exit, reset to `/`.

**Stage 1 format:** `/dashboard/export/diagnostic/session/[slot-derived segment]`
- Example: `/dashboard/export/diagnostic/session/repair/manifest/fallback`

**Stage 2 format:** `/cdn-edge/[timezone-derived region]/cache/layer[2-4]/0x[hex]/[slot-derived segments]`
- Example: `/cdn-edge/us-east-1/cache/layer3/0x4f3a2b/timeout/retry/fallback/propagating`

**Stage 3 format:** `/internal/session/[performance.now() as short hex]/log/entry/[roomArg]/user/trace/[language]/undefined`
- Example: `/internal/session/a3f7b2/log/entry/4421/user/trace/en-US/undefined/orphan`

**Stage 4 format:** `/proc/net/tcp6/[viewport as hex-like string]/[roomArg in hex]/[hardwareConcurrency]core/[colorDepth]bit/orphan/[roomArg-derived suffix]`
- Example: `/proc/net/tcp6/0590:0384/0x4c/8core/24bit/orphan/no_return`
- Suffix cycles from a fixed pool of 8 strings (e.g. `no_return`, `null_route`, `dropped`, `undefined`, `orphan_2`, `unreachable`, `blackhole`, `stale`) indexed by `roomArg % 8`.

**Path accumulation:** Each room call appends 1–2 new segments to `S.brUrlPath` rather than replacing it. The path is never shortened. Cap at 400 characters — once exceeded, new segments are still appended but the oldest segments (after the first 3) are dropped from the front to keep total length near 400. This means the path is always overflowing but never infinite.

---

## Cross-Path Integration

The existing survey cross-path (`S.brVisited === true` unlocks hidden option on Q19) is preserved. A second hint is added: if `S.brRoom > 76`, the survey Q19 hidden option text changes from `"Yes. Something is in the walls. The code is LEVEL0."` to `"Yes. The code is LEVEL0. You already know this."`.

---

## State Changes

New state fields added to `S`:
- `S.brBattery` — populated async via `navigator.getBattery()` when backrooms is entered. Null if unavailable.
- `S.brUrlPath` — current cosmetic URL path string, built up incrementally.

Existing:
- `S.brRoom` — current room arg (not slot)
- `S.brVisited` — set true on entry

---

## Implementation Scope

All changes are in `html/index.html`:
1. CSS: add `br-deep` class rules and `br-deep-flicker` keyframes
2. `S` object: add `brBattery`, `brUrlPath`
3. `scene_backrooms_enter()`: add battery fetch, reset `brUrlPath`
4. `scene_backrooms()`: rewrite entirely — 4-stage dispatch, template pools, landmark rooms, portal elements, URL push
5. `scene_backrooms_exit()`: add `history.replaceState(null, '', '/')` on exit
6. Survey scene: update Q19 cross-path condition to check `S.brRoom > 76`
