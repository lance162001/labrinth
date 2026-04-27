# Narrator Glitch Escalation — Design Spec

**Date:** 2026-04-27  
**Scope:** `html/js/narrator.js` (primary), all `scenes-*.js` files (narrator key additions)

---

## Problem

The narrator currently ignores `S.depth` entirely — every line fires identically at depth 1 and depth 25. Many scenes have no narrator coverage at all. A user can reach nominally "deep" state by clicking footer links without experiencing anything meaningful.

---

## Goals

1. Add narrator coverage to all uncovered scenes across all 8 narrative paths.
2. Make the narrator progressively lose composure — fragmentation, then fourth-wall breach, then character corruption — as a function of how deep the user has gone into a *single path*.
3. Prevent trivial depth inflation: clicking around shallowly across many pages should not trigger glitch behavior.

---

## Milestone System (`PATH_MILESTONES`)

A standalone `PATH_MILESTONES` object maps each path to an ordered array of scene keys. Narrator lines and milestone logic are fully decoupled — covering a scene narratively does not make it a milestone, and a milestone scene need not have narrator lines.

`S.pathDepth` is a per-path counter object (`{ onboarding: 3, delete: 1, ... }`). `S.narratorGlitch` (0–4) is recomputed as `max(Object.values(S.pathDepth))` each time `narratorEnter()` fires.

### Milestone table

| Path | Milestone scenes (in order) | Count |
|---|---|---|
| `onboarding` | `signup` → `signup_3` → `signup_7` → `verify_bypass` → `onboard_workspace` → `onboard_calendar` → `onboard_teammates` → `onboard_quiz` → `onboard_done` → `dashboard` | 10 |
| `delete` | `delete_account` → `del_schedule` → `del_done` → `del_jordan_ring` → `del_call` → `del_committee` | 6 |
| `support` | `help` → `support_ticket` → `ticket_needs_info` → `ticket_escalated` → `ticket_merged` → `ticket_appeal` → `ticket_appeal_denied` | 7 |
| `unsubscribe` | `unsubscribe` → `unsub_2` → `unsub_3` → `unsub_captcha` → `unsub_done` | 5 |
| `survey` | `survey` → surveyStep 7 (Q8 entry) → surveyStep 14 (Q15 entry) → surveyStep 21 (Q22) → `survey_done` | 5 |
| `navigator` | `main` → `features` → `signin` → `contact_sales` → `contact_sales_sent` | 5 |
| `adventure` | `adv_intro` → `adv_lobby` → `adv_take_keycard` → `adv_try_elevator` → `adv_try_stairs` → `adv_breakroom` → `adv_examine_whiteboard` → `adv_take_badge` → `adv_floor2` → `adv_ending` | 10 |
| `backrooms` | `backrooms_enter` → slot 1 → slot 10 → slot 26 (stage 2) → slot 35 → slot 51 (stage 3) → slot 60 → slot 76 (stage 4) → slot 85 → slot 100 or exit | 10 |

Milestones are deduplicated — visiting the same scene twice does not increment the counter again.

---

## Glitch Tiers

| `S.narratorGlitch` | Deepest path milestones | Effect |
|---|---|---|
| 0 | 0–2 | Clean — existing dry, precise, literary voice |
| 1 | 3–5 | **B — Fragmentation:** sentences restart, parentheticals swallow themselves, the narrator loses the thread mid-clause and picks it back up |
| 2 | 6–8 | **E — Fourth-wall breach:** third person collapses, narrator addresses the user directly, asks questions it shouldn't need to ask |
| 3 | 9–10 | **A light — Character slippage:** occasional letter repetition, one Unicode stutter, one combining diacritic character |
| 4 | 11+ | **A heavy — Corruption worsens:** word-level repetition, sentences trail into em-dashes, visible restarts |

---

## Line Variant System

Each `NARRATOR` entry supports optional tier-keyed line variants alongside the base `lines`:

```js
signup: {
  lines:   ["The user clicks Get Started Free — account creation begins. Seven steps."],
  lines_1: ["The user clicks — the user clicks Get Started Free. (The narrator notes this is the beginning. The narrator notes this every time.) Seven steps. The narrator has counted."],
  lines_2: ["You clicked Get Started Free. The narrator is aware of this. There are seven steps — you will see all of them."],
  // tier 3+: base or lines_2 passed through glitchText()
}
```

**Resolution order:** `narratorEnter()` picks the highest available variant tier ≤ `S.narratorGlitch`, then applies `glitchText(str, severity)` if tier ≥ 3.

Existing entries do not need to be rewritten. If no variant exists for the current tier, the base `lines` fire unmodified.

---

## `glitchText(str, severity)` Post-Processor

Runs on the selected line string after variant resolution. Does not run at tiers 0–2.

**Severity 1 (tier 3):**
- Pick 1–2 words at random; double a random interior letter (`narrator` → `nnarrator`)
- Insert one Unicode combining character mid-word (`c̷o̷u̷n̷t̷r̷y̷` style — one word only, not a block)
- Leave punctuation intact

**Severity 2 (tier 4):**
- Apply severity 1 rules
- Pick one sentence; repeat its first 3–4 words before it continues (`The narrator — the narrator observes`)
- Trail the last sentence with an em-dash if it ends with a period

The function is deterministic per `(str, S.narratorMsgCount)` so corruption is stable across re-renders.

---

## New Scene Coverage Plan

### Delete flow (gaps: `del_1`, `del_2`, `del_3`, `del_done`, `del_email_confirm`, `del_offer_accept`)
Dry procedural commentary. The narrator notes the exact word required in the field, counts the words in the retention essay, describes the countdown on the offer with careful detachment. The narrator is not neutral about Jordan.

### Unsubscribe middle (`unsub_2`, `unsub_3`, `unsub_captcha`)
The narrator observes the reason-selection screen without comment on the options. Notes the countdown timer on the retention offer. Describes the CAPTCHA that fails regardless of the answer — the narrator has tried.

### Survey (`survey_done`, Q8/Q15/Q22 step thresholds)
The survey has no individual scene keys — it runs inside a single `scene_survey()` via `S.surveyStep`. Milestones at surveyStep 7, 14, and 21 are triggered by `markNarratorMilestone('survey', n)` calls inside `renderSurveyStep()`. The narrator fires a new line at each tier-entry threshold via a dedicated `narratorEnter('survey_q8')` / `'survey_q15'` / `'survey_q22'` call from within `renderSurveyStep()` — these are virtual keys that exist only in `NARRATOR`, not as real scenes. The narrator notes when the questions stop being about the product. At Q15 it goes quiet for a beat before speaking. `survey_done` gets a prediction that was already true before the promo code appeared.

### Navigator path (`main`, `about`, `features`, `signin`, `signin_sso`, `contact_sales`, `contact_sales_sent`)
Lighter coverage. The narrator is patient and slightly curious. This path hasn't earned fragmentation; the tone stays clean even at higher glitch tiers because the path milestone count is low by the time the user leaves.

### Adventure (all `adv_*` scenes)
The narrator recognizes the genre and finds it uncomfortable. It knows where the badge is. It knows the elevator is permanently out of service. It comments on what the player assumes is locked versus what is actually locked. The narrator does not spoil the puzzle but its silence is conspicuous.

### Backrooms (`backrooms_enter`, stage transition rooms)
Coverage gets sparser as rooms increase. Stage 1: full sentences. Stage 2: shorter, clipped. Stage 3: one line, no prediction. Stage 4: one line it shouldn't say — something that suggests the narrator is also inside the backrooms, not observing from outside. The narrator's composure collapses here faster than anywhere else — backrooms is the path most likely to hit tier 3–4. Milestone tracking uses `markNarratorMilestone('backrooms', n)` calls inside `scene_backrooms()` at the slot thresholds listed above.

### Secondary scenes (`billing`, `dash_new_project`, `data_export`, `session_expire`, `changelog`, `roadmap`, help articles, footer pages)
One-line dry observations. No prediction. No follow-up. These don't carry narrative weight — they get coverage so the narrator isn't silent, not so it can comment meaningfully.

---

## Implementation Notes

- `PATH_MILESTONES` and the milestone-tracking logic live at the top of `narrator.js`, before the `NARRATOR` object.
- `S.pathDepth` initializes as `{}`. Each path key is added on first milestone hit.
- Milestone deduplication: track visited milestone scenes in `S.pathMilestonesSeen = new Set()`.
- `glitchText()` uses `S.narratorMsgCount` as a seed so the same line doesn't corrupt differently on repeated visits.
- Backrooms milestone tracking uses slot thresholds (slot 1, 10, 26, 35, 51, 60, 76, 85, 100) — `scene_backrooms()` calls `markNarratorMilestone('backrooms', n)` when `slot` crosses each threshold for the first time (tracked via `S.pathMilestonesSeen`).

---

## Out of Scope

- Changing `S.depth` or any existing depth-escalation site effects
- Narrator lines for scenes that don't exist yet
- Making the narrator interactive / responsive to user input beyond the existing fallback pool
