# Project Interior Design Spec
*2026-04-28*

## Problem

After completing the 4-step project creation modal, the user is returned to the same empty dashboard with a toast saying their project didn't appear. There is no project interior. The brainstorm note calls for: "the product has to be really really bad. like the pinnacle of poor design, reeking of poorly thought out vibe-coding done by people who don't care."

## Solution Overview

A new `scene_project()` scene that represents the actual product — an AI-managed project view that looks almost legitimate on load, then falls apart the moment the user interacts with it. NexusAI misinterprets user input, references the wrong things, and triggers persistent state side-effects visible across the dashboard and project.

---

## Section 1: Architecture

**New scene:** `scene_project()` added to `scenes-dashboard.js`.

**Router:** Add `project: scene_project` to the SCENES dispatch table in `router.js`.

**Project creation callback:** In `scenes-onboard.js`, `showProjectModal()`'s final callback changes from `scene_dashboard()` to `scene_project()`. `S.projectName` is captured from `document.getElementById('proj-name').value` at this point.

**New state on `S`:**
- `S.projectName` — the user's entered project name (empty string by default)
- `S.nexusAIStep` — tracks how many AI exchanges have fired this visit (resets to 0 on each `scene_project()` call)
- `S.greetingStyle` — `''` | `'hi'` | `'hello'` | `'hey'` — affects dashboard/project copy and styling
- `S.invitesSent` — boolean
- `S.deletionPending` — boolean
- `S.prioritySupport` — boolean
- `S.testMode` — boolean
- `S.politeMode` — boolean
- `S.nexusBackground` — boolean
- `S.okrsAligned` — boolean

**Dashboard integration:** `scene_dashboard()` checks `S.projectName`. When set, replaces the "No projects yet" empty state with a project list row showing the NexusAI-garbled name, the NexusAI badge, "47 tasks", and `data-go="project"`. The Projects sidebar badge changes from `0` to `1`.

**Project name garbling:** NexusAI doubles the last letter of the last word of the user's entered name (e.g. "Q4 Roadmap" → "Q4 Roadmapp", "Launch Plan" → "Launch Plann"). This garbled name is used in the project header and dashboard row.

---

## Section 2: Project Scene Layout

```
nav (dashNavHTML)
project-header: [garbled name] [✦ NexusAI badge] [Managed by NexusAI] | [Views] [Settings] [Export] [Share] — all toolbar buttons nonfunctional except Share (which does nothing but is not greyed out)
broken-tabs: [✦ AI Assistant (active)] [Board] [Timeline] [Goals] [Docs BETA] [Sprints] [Reports] [Automations !] — all tabs except AI Assistant are greyed out / cursor:not-allowed
layout: sidebar (220px) | main content (1fr)
```

**Sidebar items:**
- `← Dashboard` → `scene_dashboard()`
- `✦ AI Assistant` (active)
- `📋 Tasks` (broken, badge: —)
- `👥 Members` (broken, badge: 0 — or populated names if `S.invitesSent`)
- `📎 Files` (broken, badge: —)
- `🔗 Integrations !` (broken, red badge)
- Spacer
- `🗑 Delete Project` → `scene_delete_account()` (wrong destination, intentional)

**Main content:** two-column grid — NexusAI box (left, wider) | right panels (260px)

**NexusAI box:**
- Header: gradient purple→blue, "✦ NexusAI — Intelligent Project Manager", status indicator
- Messages area: scrollable, starts with one welcoming message only
- Rate limit error: appears below user message after 1.5s
- AI response: appears after additional 3s (or 6s if `S.politeMode`)
- Input + Send button (disabled when `S.testMode` or after 3 exchanges)

**Right panels:**
- Members panel (shows fake names if `S.invitesSent`)
- Activity feed (empty on load; populates after first AI response)
- NexusAI Status panel (tasks created, tasks archived, actions taken)

---

## Section 3: NexusAI Interaction Model

On load: one welcoming message — "Hi! I'm NexusAI, your intelligent project manager. Ask me anything about *[garbled project name]* or tell me what to do first." Activity feed shows "No activity yet." Everything looks almost functional.

**Interaction loop (per Send):**
1. User message appears in chat
2. 1.5s → rate limit error appears below it
3. 3s more (or 6s if `S.politeMode`) → rate limit clears, NexusAI responds
4. Activity feed gains one row: "NexusAI [short version of the scope-creep action]" (e.g. "NexusAI updated your billing cycle", "NexusAI submitted a deletion request")
5. `S.nexusAIStep++`
6. After 3 exchanges: input disables, message: "NexusAI is entering focus mode to process your requests."

**Keyword extraction:** scan user's message (lowercased) for the first matching keyword. Apply the corresponding response and set the state flag.

| Keywords | NexusAI response | State effect |
|---|---|---|
| task, add, create | "Great point about **[keyword]**! I've added you to the Nexus Launch Partner waitlist ($49/mo). You're all set." | — |
| deadline, due, date | "Noted on **[keyword]**! I've updated your billing cycle to align with this timeline." | — |
| delete, remove, cancel | "Understood! I've submitted a deletion request for your workspace. You have 24 hours to cancel." | `S.deletionPending = true` |
| help | "On it! I've opened a support ticket on your behalf. Estimated response time: 6–8 weeks." | — |
| team, invite, member | "Great thinking! I've sent invitations to your entire contacts list. They'll be thrilled." | `S.invitesSent = true` |
| priority, urgent | "Absolutely! I've upgraded you to Priority Support ($29/seat/mo). You're all set!" | `S.prioritySupport = true` |
| update, change | "Done! I've pushed an update to all connected integrations (0 integrations connected)." | — |
| milestone, goal, okr | "Perfect! I've aligned your OKRs with Nexus's Q4 company goals. You're a great fit!" | `S.okrsAligned = true` |
| test, testing | "Great! I've enabled Test Mode. All your data is now read-only for safety." | `S.testMode = true` |
| hi, hey, sup, yo | "Hi [First Name]! I've personalized your workspace based on your greeting style. Enjoy!" | `S.greetingStyle = 'hi'` (for hi/hey/sup/yo) |
| hello | "Hi [First Name]! I've personalized your workspace based on your greeting style. Enjoy!" | `S.greetingStyle = 'hello'` |
| break, broken, bug, error | "Thanks for the report! I've filed a bug with our engineering team. ETA: 6–8 weeks." | — |
| stop, quit, no, wait | "Got it! I'll continue working in the background and notify you when everything's done." | `S.nexusBackground = true` |
| why, wtf, what | "Great question! I've added this to your project FAQ. It's now visible to all members." | — |
| please | "Of course! I've enabled Polite Mode. Your experience just got 12% more courteous." | `S.politeMode = true` |
| *(no match)* | "Great point about your earlier message regarding the budget! I've updated the invoice template." | — |

NexusAI response format: lifts the matched keyword and bolds it in the reply. Ends with a scope-creep action statement. `[First Name]` in greeting responses is a literal string — NexusAI does not know the user's name and renders the placeholder verbatim.

---

## Section 4: State Effects (Visible Cross-Scene)

**`S.greetingStyle`** — checked in `dashNavHTML()` and the project header:
- `'hi'` (covers hi/hey/sup/yo) → dashboard greeting becomes "Hi hi hi! 👋👋" and all CTA button text gains "!", accent color (`--blue`) shifts to amber `#f59e0b`
- `'hello'` → NexusAI messages gain "Dear User," prefix; dashboard greeting becomes "Hello. Good morning."
- `'hey'` → sidebar labels go lowercase ("📁 projects", "📬 inbox"), random emoji appended to 2–3 items

**`S.invitesSent`** — Members panel shows: Priya K. (invite pending), Marcus T. (invite pending), Deleted User (invite pending). All three appear as bounced in the dashboard inbox.

**`S.deletionPending`** — Red warning banner at top of `scene_dashboard()` and `scene_project()`: "⚠ Deletion request in progress. Estimated completion: 3–5 business days." Project header shows "⚠ Pending deletion" badge.

**`S.prioritySupport`** — `scene_billing()` gains a "Priority Support" line item ($29/seat/mo, pre-checked, cannot be removed).

**`S.testMode`** — NexusAI input textarea gets `disabled` and a label: "NexusAI is in Test Mode. Input disabled."

**`S.politeMode`** — AI response delay doubles (6s instead of 3s). Every NexusAI message appends "Thank you for your patience."

**`S.nexusBackground`** — A small persistent banner appears at the top of every scene (injected in `dashNavHTML()`): "NexusAI is working in the background… [spinner]" — never clears.

**`S.okrsAligned`** — Dashboard sidebar gains a new collapsed item: "🎯 OKRs (aligned)" — clicking it toasts "OKR view is only available on the Enterprise plan."

---

## Section 5: Navigation & Depth

- `← Dashboard` sidebar item and nav logo → `scene_dashboard()`
- `scene_project()` calls `incDepth()` on load
- Narrator entry for `project`: *"The user has entered the project. NexusAI greets them. Everything looks fine."*
- Repeat visits reset `S.nexusAIStep = 0` (fresh chaos, same accumulated flags)
- `🗑 Delete Project` → `scene_delete_account()` (intentionally wrong)

---

## Out of Scope

- Persisting projects across sessions (no backend)
- Multiple projects
- Any tab other than "AI Assistant" doing anything
- Mobile layout variations
