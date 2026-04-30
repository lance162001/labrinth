# Secret Tower Chat — Design Spec
**Date:** 2026-04-28

## Overview

Replace the `scene_secret_site()` placeholder with a redirect to a fully standalone `html/secret.html` page — an anonymous real-time chat room called "nexus // tower." Only users who have solved the credential puzzle can access it. Messages are relayed and stored via Firebase Realtime DB (no custom server required).

---

## Files

| File | Change |
|------|--------|
| `html/js/scenes-secret.js` | Rewritten: sets sessionStorage access flag, animates "connecting to tower...", then redirects to `/secret.html` |
| `html/secret.html` | New standalone page: credential gate + chat room |

No other files change. `secret.html` is fully self-contained — no shared CSS or JS from the main site.

---

## Access Control

### Entry via puzzle flow
`scene_secret_site()` sets `sessionStorage.setItem('nexus_tower_access', '1')` before redirecting. `secret.html` checks for this flag on load and enters the chat immediately, no prompt.

### Direct URL access
If `nexus_tower_access` is absent from sessionStorage, `secret.html` shows a minimal credential prompt. Accepted values:
- Email: `labrinth@nexus.app`
- Password: `d3pth0`

Correct credentials → set flag + enter chat. Wrong credentials → denial screen ("access denied") with a "try again" link that re-shows the prompt. These are client-side checks — security is through obscurity, intentional for this project.

---

## Anonymous Identity

**Format:** `{buzzword}_{4hexchars}` — e.g. `leverage_7f4a`, `pivot_ae91`, `disrupt_3b2e`

**Word list:** leverage, disrupt, pivot, synergy, scale, iterate, ideate, align, optimize, streamline, unlock, accelerate, empower, transform, innovate, execute

**Generation:** Client-side on first access. Stored in `sessionStorage` as `nexus_codename`. Persists through page refreshes within the same browser session; opening a new tab generates a new identity.

**Color:** Each codename gets a deterministic purple shade derived from a hash of the codename string, drawn from a palette of ~8 muted purple/indigo tones. Makes multi-user conversations easier to follow.

---

## Firebase Setup

**Service:** Firebase Realtime Database, free Spark tier.

**Rules:** Open read/write (no Firebase Auth). Acceptable given the page is hidden behind a credential gate.

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Config:** Five constants at the top of `secret.html` that the operator fills in after creating a Firebase project: `apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId`.

---

## Data Structure

```
/tower/
  messages/
    {push_id}/
      from:  "leverage_7f4a"   (string, max 20 chars)
      text:  "how did you find this"  (string, max 500 chars)
      ts:    1745800000000     (Unix ms)
  presence/
    {codename}: true
```

- **Messages:** Appended via `push()`. On load, fetch `limitToLast(50)`. Real-time listener (`onChildAdded`) receives new messages as they arrive.
- **Presence:** Written as `true` on connect. `onDisconnect().remove()` cleans up on tab close or disconnect. Client listens to `/tower/presence` to derive live user count.

---

## System Messages (Join / Leave)

Generated **client-side** from presence changes — not stored in Firebase. This prevents new arrivals from seeing stale "X connected 3 days ago" entries. When the presence listener fires `child_added` or `child_removed`, the client appends a local system message to the chat view.

---

## Chat UI

**Aesthetic:** Matches existing `scene_secret_site` — background `#08080e`, muted purple palette, `'Courier New'` monospace throughout.

**Layout:**
```
┌─────────────────────────────────────┐
│ nexus // tower        codename  N ● │  ← header
├─────────────────────────────────────┤
│                                     │
│  >> leverage_7f4a connected (1)     │  ← system msg
│  14:02  [disrupt_3b2e]  hi          │  ← chat msg
│  14:03  [leverage_7f4a] hey         │
│                                     │
├─────────────────────────────────────┤
│ > [input field________________] send│  ← input bar
└─────────────────────────────────────┘
```

**Behaviors:**
- Auto-scroll to bottom on new message, unless user has manually scrolled up (threshold: 80px from bottom)
- Enter key sends; Shift+Enter is a no-op (no multiline)
- Messages truncated to 500 chars client-side before send
- Own messages display codename in a slightly brighter shade for self-identification
- Firebase offline state (`.info/connected`) shown in header as "reconnecting..."

---

## `scene_secret_site()` Transition

```
[existing "you found it." text stays]
[status line animates through]:
  "connecting to tower."
  "connecting to tower.."
  "connecting to tower..."
  "connecting to tower"   ← loops ~3 times over 2.4s
→ sessionStorage flag set
→ window.location.href = '/secret.html'
```

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Firebase offline on load | Header shows "reconnecting..." in dim red; retries automatically via Firebase SDK |
| Message send failure | Inline error appended to chat view: `>> failed to send` |
| Presence write failure | Silent — user still enters chat, just won't appear in count |
| Direct URL, wrong creds | Denial screen, no redirect |

---

## Out of Scope

- Message moderation or rate limiting
- Message deletion or expiry (messages persist in Firebase indefinitely)
- Typing indicators
- Message reactions
- Any connection to the `/place` feature (future work)
