# Nexus Site Map

A document of routing paths through the Nexus satirical website — both the literal navigation graph and the narrative arc each path traces.

---

## Global Routing Reference

All scenes and their primary outgoing links. Loops and traps are noted in brackets.

```
home
  └─ Get Started → cookies
  └─ Watch Demo  → demo → demo_play → [requires signup]

cookies
  ├─ Accept All       → loading → newsletter → main
  ├─ Customize        → cookie_prefs → [Save loops back to cookies]
  └─ reject (link)    → cookie_prefs [all toggles locked; same loop]

  DEPTH 7 TRIGGER: cookie banner reappears regardless of prior acceptance

main (marketing site)
  ├─ nav: Home        → nav_home → 301 redirect page → main [3s auto-redirect]
  ├─ nav: About       → about [renders pricing page, labeled "About Nexus"]
  │                     └─ Cool Links (hidden link) → cool_links [1998 Netscape aesthetic]
  │                     └─ Sitemap (hidden link)    → sitemap [IE4 aesthetic]
  ├─ nav: Features    → features [loads for 5s, stalls at 95%, returns ERR_FEATURE_UNAVAILABLE]
  ├─ nav: Pricing     → pricing
  ├─ nav: Blog        → blog [coming soon, newsletter capture]
  ├─ nav: Sign In     → signin [renders signup form]
  ├─ nav: Get Started → pricing
  ├─ CTA: Start Free  → pricing
  ├─ footer: Changelog   → changelog [all entries: "Minor bug fixes and performance improvements"]
  ├─ footer: Roadmap     → roadmap ["Done" column empty; features in progress since 2019]
  ├─ footer: Status      → site_status ["Ability to navigate away: Degraded"]
  ├─ footer: Careers     → careers [extreme requirements; apply → 9-step form]
  ├─ footer: Press       → press [truncated quotes: "…software…"]
  ├─ footer: Legal       → legal [viewing = agreement to all docs]
  ├─ footer: API         → api_ref [all v1 endpoints deprecated]
  ├─ footer: Community   → community [1 post, 0 replies, 847 views, since 2021]
  ├─ footer: Templates   → templates [all locked: Pro only]
  ├─ footer: Webinars    → webinars [all recordings "processing"]
  ├─ footer: Security    → security_page [badges; "navigate away": Degraded]
  ├─ footer: Privacy     → privacy [13 sections; rights requests → support_ticket, 90-day processing]
  ├─ footer: Terms       → terms [agreeing by scrolling; mandatory arbitration]
  ├─ footer: About       → about [pricing page]
  ├─ footer: Pricing     → pricing
  ├─ footer: Help        → help
  ├─ footer: Survey      → survey
  ├─ footer: Unsubscribe → unsubscribe
  ├─ footer: Docs        → docs [modal: sign in required to view docs]
  ├─ footer: [most links] → footer_dead [toast: "unavailable"]
  └─ 12s timer           → mobile_prompt [modal; dismisses but returns with counter]

signin
  └─ Continue         → signin_sso → SSO error → signin_actual [password form]
  └─ Sign up link     → signup

forgot_password → forgot_sent [email not real] → forgot_resent [toast: spam folder]

pricing
  ├─ Starter: Get Started → signup
  ├─ Pro: Start Trial     → signup
  └─ Enterprise: Contact  → contact_sales → contact_sales_sent → main

signup (step 1 of 3)
  └─ Continue → signup_2 (step 2 of 5)
                └─ Continue → signup_3 (step 3 of 8)
                              └─ Continue → signup_4 (step 4 of 8) [phone; skip disabled]
                                            └─ Continue → signup_5 (step 5 of 8)
                                                          ├─ Continue     → signup_6
                                                          └─ Skip         → signup_6_warn → signup_6
                                                                            └─ [guilt modal]
signup_6 (invite team, step 6 of 8)
  ├─ Send Invites     → signup_7
  └─ Skip             → signup_7_warn → signup_7 [guilt modal]

signup_7 (email verify, step 7→8 of 8)
  ├─ Wrong code [×1]  → error message, retry
  ├─ Wrong code [×2]  → "one attempt remaining"
  ├─ Wrong code [×3]  → verify_locked [30-min countdown]
  │                     └─ Try Again → signup_7 [countdown loops]
  ├─ Resend code      → toast, S.verifyAttempts resets → retry
  └─ Wrong code [×3, 3rd attempt auto-succeeds] → verify_bypass → onboard_start
                         [behavioral anomaly logged to account record]

onboarding (8 steps, all required, ~12 min estimated, takes much longer)
  onboard_start (intro screen with checklist)
    └─ Let's go → onboard_workspace

  onboard_workspace (step 1: name workspace)
    ├─ Check availability [attempt 1] → same page [URL already taken]
    ├─ Check availability [attempt 2] → same page [URL "reserved"]
    └─ Check availability [attempt 3+] → same page [suggests slug-hq; accept → onboard_avatar]

  onboard_avatar (step 2: profile photo)
    ├─ Upload [attempt 1] → rejected: min 400×400px
    ├─ Upload [attempt 2] → rejected: compliance AI (no sunglasses, no filters, etc.)
    └─ Upload [attempt 3+] → Skip link appears → onboard_calendar

  onboard_calendar (step 3: connect calendar — cannot be skipped)
    ├─ Google Calendar → fails: OAUTH_STATE_MISMATCH_403
    ├─ Outlook         → fails: same error
    ├─ Apple Calendar  → disabled: Business plan only
    └─ [after 3 failures] iCal URL section appears
       └─ Enter iCal URL → toast: "Sync in 3–5 business days" → onboard_teammates

  onboard_teammates (step 4: invite team — must invite 2; cannot be skipped)
    ├─ Send invite → each address bounces with rotating reasons
    │   (Gmail not permitted, domain taken, role-based, declined before, MX fail, etc.)
    ├─ [after 4 bounces] CSV upload section appears
    │   └─ Upload CSV → 0 valid addresses found (any number tried)
    └─ [after 2 CSVs] Waiver textarea appears (min 50 words required)
       └─ Submit waiver → toast: "under review 5–7 business days" → onboard_usecase

  onboard_usecase (step 5: choose use case)
    └─ Continue (any choice) → toast: "3 new required steps queued" → onboard_notifications

  onboard_notifications (step 6: notification preferences)
    ├─ Uncheck any box → re-checks itself + warning toast
    └─ [after 4 attempts] → "managed by administrator, cannot be changed during onboarding"
    └─ Save & Continue → onboard_video

  onboard_video (step 7: required onboarding video)
    ├─ Video fails to load: CDN_TIMEOUT_504 (after 3s)
    ├─ [after 5s] Skip link appears
    └─ Skip → phrase input: must type "I have reviewed the Nexus onboarding material" exactly
       └─ Correct phrase → onboard_quiz

  onboard_quiz (step 8: security awareness check, 3 questions)
    ├─ Wrong answer → error + retry
    ├─ 3 wrong answers → resets to question 1
    └─ All 3 correct → onboard_done

  onboard_done
    ├─ Account summary: 0 teammates, no calendar, no photo, 23% setup complete (all red)
    └─ Go to Dashboard → dashboard

dashboard
  ├─ Setup checklist (checklist items each link back to incomplete flows)
  ├─ Create Project   → dash_new_project → project modal (4 steps)
  │                     └─ "Project created!" toast → project [S.projectName set, garbled]
  ├─ Project row      → project [visible once S.projectName is set; badge shows 1]
  ├─ Inbox (3 unread) → dash_inbox
  │   ├─ inbox_email_1: 47-item setup checklist (each links to a Nexus scene)
  │   ├─ inbox_email_2: invite teammates reminder (all bounced)
  │   └─ inbox_email_3: personal CEO letter (also automatically generated)
  ├─ nav: Home        → dashboard
  ├─ sidebar: Billing → billing
  ├─ sidebar: Settings → account_settings
  ├─ sidebar: Export  → data_export
  ├─ sidebar: Help    → help
  ├─ sidebar: Support → support_ticket
  ├─ sidebar: Delete  → delete_account
  ├─ Upgrade          → checkout
  ├─ chat button      → chat [floating panel, bot script]
  └─ 38s timer        → session_expire → session_extend [timer restarts] or session_reverify

project (NexusAI-managed project interior)
  ├─ Loads clean: NexusAI welcome message only, activity feed empty
  ├─ NexusAI input: each Send → 1.5s rate limit → 3s delay → wrong response
  │   ├─ Keyword extraction lifts one word and misuses it in response
  │   ├─ 3 exchanges max, then input disables ("focus mode")
  │   └─ Each keyword may set a persistent S flag (see NexusAI State Effects below)
  ├─ Toolbar buttons (Views, Settings, Export) → nonfunctional / greyed out
  ├─ Tabs (Board, Timeline, Goals, etc.) → nonfunctional / greyed out
  ├─ sidebar: ← Dashboard → dashboard
  └─ sidebar: Delete Project → delete_account [wrong destination, intentional]

  NexusAI State Effects (persistent for session, visible cross-scene):
  ├─ "hi"/"sup"/"yo"   → S.greetingStyle='hi'   | dashboard heading: "Hi hi hi! 👋👋", --blue → amber #f59e0b
  ├─ "hey"             → S.greetingStyle='hey'   | sidebar labels go lowercase, emoji appended
  ├─ "hello"           → S.greetingStyle='hello' | NexusAI responses gain "Dear User," prefix
  ├─ "team"/"invite"   → S.invitesSent=true      | Members panel shows Priya K., Marcus T., Deleted User
  ├─ "delete"/"remove" → S.deletionPending=true  | Red banner in dashboard + project header
  ├─ "priority"        → S.prioritySupport=true  | Billing gains "Priority Support $29/seat" line item
  ├─ "test"/"testing"  → S.testMode=true         | NexusAI input disabled
  ├─ "please"          → S.politeMode=true       | AI delay doubles, appends "Thank you for your patience."
  ├─ "stop"/"quit"     → S.nexusBackground=true  | Persistent banner: "NexusAI is working in the background…"
  └─ "milestone"/"okr" → S.okrsAligned=true      | Sidebar gains "🎯 OKRs (aligned)" item

billing (dashboard sidebar)
  ├─ "Free" plan charges $8.96/mo in mandatory fees
  ├─ If S.prioritySupport: extra line item "Priority Support (NexusAI upgrade) $29.00/seat"
  └─ Add Payment → free_checkout → billing_card_added → billing
                   [order summary: $0.00 today; charges begin tomorrow]

checkout (Pro upgrade, from upgrade button)
  ├─ Billing period: Annual / Monthly (monthly adds $30/seat flexibility surcharge)
  ├─ Min 3 seats required
  ├─ 5 required add-ons totaling $59/seat/mo [pre-checked, cannot remove]
  ├─ Promo code → always invalid
  └─ Continue to Billing → checkout_billing
       └─ Continue to Payment → checkout_payment
            ├─ Attempt 1: INSUFFICIENT_FUNDS
            ├─ Attempt 2: DO_NOT_HONOR
            ├─ Attempt 3: VELOCITY_EXCEEDED (24-hr wait)
            └─ [after 3 declines] → checkout_alt
                 ├─ Wire transfer → checkout_wire [toast: instructions in 1-2 days; cart expires 24h]
                 ├─ Pay by invoice → requires enterprise contract + 10 seats + Net-30 approval
                 ├─ PayPal → PP_MERCHANT_NOT_FOUND_404
                 └─ Nexus Credits → $0.00

account_settings (tabs: Profile | Notifications | Security | Privacy | Danger Zone)
  ├─ Profile: Save         → settings_save → [success toast → immediate error toast]
  ├─ Notifications: Save   → [toast: subscribed to Preferences Newsletter]
  ├─ Security: Update Pw   → settings_pw_save → SMS code required
  │                          [adding phone requires SMS; SMS requires phone → deadlock]
  ├─ Privacy               → cookie_prefs [loop]
  └─ Danger Zone           → delete_account

delete_account (step 1 of 4, red modal)
  ├─ step 1: type DELETE        → del_1 (step 2: Jordan the CSM)
  ├─ step 2: Schedule call      → del_schedule [no available slots]
  │           Decline           → [requires 50-word essay] → del_2
  ├─ step 3: Retention offer    → del_3
  │           Accept            → del_offer_accept → dashboard [deletion cancelled]
  ├─ step 4: Type full name     → del_done
  └─ del_done: "90 business days. Must confirm email within 5 min."
       └─ I confirmed → del_email_confirm [link always expired, 5-min countdown]
            ├─ [attempts 1-3] → new expired link
            └─ [attempt 4+]   → del_jordan_ring [incoming call screen]
                 ├─ Decline → del_call_decline → del_committee [status tracker]
                 └─ Answer  → del_call [21-step script with Jordan + Brad]
                              └─ [end of script] → del_committee [status tracker]
                                   ├─ [checks 1-6] Refresh status [progress bar stuck at ~11-23%]
                                   ├─ [check 7]    Request auto-cancelled for excessive activity
                                   └─ Return to Dashboard → dashboard

help
  ├─ any search → same 5 articles [search index "rebuilding"]
  ├─ help_article_started / help_article_faq / help_article_billing_help /
  │   help_article_cancel / help_article_delete_help
  │   [each ends with "See also:" linking to another; thumbs-up → subscribed to newsletter]
  └─ Contact Support → support_ticket

support_ticket
  └─ Submit → ticket_submitted → [auto-closed after 6s; resolved banner]
  └─ Re-submit → ticket_needs_info [8 additional fields, repeat of original]
       └─ Submit → ticket_escalated [Tier 2 queue; position increases over time]
            └─ Refresh Status → ticket_merged [merged with Ticket #0003 from March 2019]
                 └─ File Appeal → ticket_appeal [min 150 words; upload required]
                      └─ Submit → ticket_appeal_denied ["sufficiently similar to 2019 report"]
                           └─ Open New Ticket → support_ticket [cycle restarts]

data_export
  └─ Request Export → export_request → data_export [always 0%, 3-5 business days]

survey (22 questions, tonal descent)
  ├─ Q1–Q7:   Standard UX (stars, NPS, features, onboarding, improvements)
  ├─ Q8–Q14:  Personal (work-life balance, vacation, happiness 1–5, "If Nexus were a food")
  ├─ Q15–Q21: Surreal (meaning of work, overwhelm, projects concern, loneliness in software,
  │            "are you being observed", "next question is optional" [blank question])
  └─ Q22: "Are you doing okay? Really." → survey_done
          └─ Promo code (expires 29 min, inapplicable to free plan)
          └─ Newsletter upsell → survey_unsub_decline
             └─ if declined → newsletter about opting out of newsletters
  └─ Save and finish later → survey_abandon [cannot actually save]

unsubscribe
  └─ Yes → unsub_2 [required reason, all radio buttons]
            └─ Continue → unsub_3 [retention offer with countdown timer]
                          ├─ Accept → dashboard [still subscribed, "enrolled in Winback Program"]
                          └─ Decline → unsub_captcha [image CAPTCHA]
                                       ├─ Submit [attempt 1] → new CAPTCHA, different target
                                       └─ Submit [attempt 2] → unsub_done
                                                               ["unsubscribe confirmed"
                                                                + 10-day processing delay
                                                                + transactional emails unaffected
                                                                + click link in confirmation email
                                                                  to actually unsubscribe]

mobile_prompt [triggered 12s after main loads]
  ├─ iOS / Android → mobile_download [QR code "currently unavailable"; closed beta; join waitlist]
  └─ Dismiss       → close_overlay [returns after 4s if dismissed before; counter shown on 2nd+]

chat [floating panel, always visible on main/dashboard]
  bot states (advance on each user message):
  0. greeting
  1. "looking into it…"
  2. links to help articles [→ help]
  3. "connecting you with a specialist"
  4. "1 agent in queue"
  5. "4 agents in queue"
  6. "leave a message?"
  7. "team will respond in 3–5 business days"
  8. rate this conversation (stars)
  9. "transcript sent. goodbye." → loops to state 0

session_expire [38s timer from dashboard]
  ├─ Extend session → session_extend [timer restarts, back to dashboard]
  └─ Reverify       → session_reverify → dashboard

careers_apply (9 steps)
  ├─ Steps 1-3: Personal info, work experience (resume + manual entry), education
  ├─ Step 4: 45-min skills assessment → "Assessment server unavailable" toast
  ├─ Steps 5-7: Written responses, portfolio, references
  ├─ Step 8: Background check authorization (47 countries)
  └─ Step 9: Submit → "Application submitted! We'll be in touch in 6–8 weeks."
             [Assessment still pending; marked separately]
```

---

## Narrator System

A meta-commentary layer that runs on top of all navigation. The narrator (`NARRATOR` object) has an entry for most scenes that fires via `narratorEnter(key)` — a floating bubble of dry, precise, slightly sad observation.

Each entry has:
- `lines` — what the narrator says when arriving at a scene (some are functions that vary by state)
- `prediction` — what the narrator predicts will happen next
- `onPredRight` — what the narrator says when its prediction was correct

The narrator makes predictions that are almost always right. When the user types in the chat widget, the narrator has a set of responses: "The narrator does not take questions." / "The narrator continues regardless."

Key narrator beats:
- `signup_7`: "I am aware of something about this code and have decided not to say what."
- `onboard_quiz`: knows all correct answers, cannot share them
- `del_call`: "Jordan begins the retention script — twenty-one steps, the warmth genuine and the inflection practiced"
- `del_committee`: "the narrator is also on the committee"
- `ticket_appeal_denied`: "this outcome was determined before the user began writing"

---

## Depth Escalation (Cross-Cutting)

`S.depth` increments on each navigation call. It alters the site globally regardless of path taken.

| Depth | Effect |
|-------|--------|
| 6     | Depth pill appears in top-right corner: "Getting warmer…" |
| 7     | Cookie banner reappears ("same cookies, new legal basis") |
| 10    | Dashboard shows "Unusual activity detected" alert |
| 12    | Dashboard notes prior project attempt ("Previously attempted: 1 time. Data not saved.") — only visible before a project is created |
| 14    | Awareness modal: "We've noticed you. 94th percentile of users." |
| 15    | Dashboard message changes to "Hello. Are you still there?" |
| 16    | Empty state copy changes: "Still no projects." |
| 18    | Nav CTA becomes "Upgrade (Please)" |
| 20    | Security alert toast: unusual navigation patterns |
| 22    | Logo gains "™ ERROR" label |

Trial days remaining in the dashboard nav counts down as depth increases (`14 - floor(depth/3)`).

---

## Narrative Paths

Six primary journeys through the site. Each is walkable from beginning to end.

---

### Path 1 — The Onboarding
*A Bildungsroman where the protagonist never arrives.*

```
home → cookies → loading → newsletter → main → pricing → signup
     → signup_2 → signup_3 → signup_4 → signup_5 → signup_6
     → signup_7 → [verify loop] → verify_bypass → onboard_start
     → onboard_workspace → onboard_avatar → onboard_calendar
     → onboard_teammates → onboard_usecase → onboard_notifications
     → onboard_video → onboard_quiz → onboard_done → dashboard
     → dash_new_project → project [NexusAI interior]
     → dashboard [project row visible, 23% setup]
```

**Narrative structure: rising action with false peaks.**

The user arrives at a polished, confident product. Everything about the landing page says *this is the last tool you'll ever need* — the kind of copy that implies every prior tool was a mistake and this one won't be.

The first obstacle is the cookie banner, which positions itself as a formality. "Accept All" is the path of least resistance; the alternatives go nowhere useful. The user accepts. A loading bar fills to 100% and the word "Personalizing" cycles through variations on the same action noun.

A newsletter popup appears before the page is fully visible. The decline option is a shame link: *No thanks, I prefer to remain professionally stagnant.* The user is invited to feel bad about their reluctance.

The marketing site presents six features, five testimonials, and three pricing tiers. The cheapest is labeled "Free" with an asterisk. The asterisk leads to more asterisks.

Signup begins at Step 1 of 3. By Step 2, it is Step 2 of 5. By Step 3, it is Step 3 of 8. The form does not explain the discrepancy. The step counter is stated with full confidence each time.

Step 4 asks for a phone number. The Skip button exists but is disabled. Its tooltip says *required for account security.* Step 5 offers integrations; skipping produces a guilt modal with a statistic ("40% less value"). Step 6 asks for team invites; skipping produces another guilt modal ("churn 3× faster"). These are not blocked — the user can click through — but each exit is labeled as the wrong choice.

Step 7 is email verification. The code is wrong the first time. The second failure warns of one attempt remaining. The third locks the account for thirty minutes. Then the system proceeds anyway on the third incorrect attempt, logging a behavioral anomaly.

After verification comes an eight-step onboarding wizard the system estimates at twelve minutes. Workspace URLs are already taken. The photo upload fails compliance AI review. Calendar providers all return OAuth errors. Every invited email bounces. Notifications cannot be disabled. The required training video fails to load; bypassing it requires typing a specific phrase exactly. Three security questions; wrong answers reset the quiz.

The onboarding completion screen shows account setup at 23%, all items flagged red.

The project creation modal runs four steps and reports success. The toast reads: *Project created successfully!* The user lands in a project interior — clean, almost plausible, managed by NexusAI. The dashboard now shows the project in a list. Everything looks fine.

The moment the user types anything into NexusAI, the rate limiter fires. Then NexusAI responds anyway — to the wrong thing. It has upgraded them to Priority Support. It has sent invitations to their contacts. It is working in the background. The project is still empty.

**Dramatic shape:** ascent → false summit → ascent → false summit → arrival at a room that calls itself a destination and immediately starts rearranging the furniture.

---

### Path 2 — The Escape
*A heist that succeeds but steals nothing.*

```
main (footer) → unsubscribe → unsub_2 → unsub_3
              → unsub_captcha → [captcha refresh] → unsub_done
```

**Narrative structure: the gauntlet.**

The user has decided to leave. This is treated as a crisis.

The Unsubscribe link is in the footer, small, gray, and technically present. Clicking it opens a confirmation screen that frames the question not as *do you want to leave* but as *are you sure you want to do something that you will regret.* The button to continue is labeled "Yes, unsubscribe me" in red.

The next screen requires a reason. All options are radio buttons; none can be skipped. The options include "I never signed up for this" and "I don't remember," both of which confirm that the user's presence in this system was never entirely their idea.

A retention screen appears with a countdown timer. Three months of Pro, $147 value, "offer expires in" followed by a clock that runs in real time. The decline button is small and labeled *No thank you, continue unsubscribing* — a sentence that requires the user to restate their intention while calling it ingratitude.

The CAPTCHA refreshes once. The first attempt fails regardless of answer. The second attempt presents a new image set with a new target. Both screens include a "Skip" button that also submits.

The confirmation screen reads: *You've been unsubscribed.* Below it, in increasingly small text: the change takes 7–10 business days; transactional emails are unaffected; a confirmation email has been sent; the link in that email must be clicked within 24 hours or the request is automatically cancelled.

The user has exited through six doors and is standing outside a building that still knows their address.

**Dramatic shape:** resolve → resistance → bribery → bureaucracy → false victory → asterisked victory.

---

### Path 3 — The Navigator
*A Borges story. Every door is the wrong door.*

```
home → main → [nav: Home]     → 301 redirect → main
            → [nav: About]    → pricing [mislabeled "About Nexus"]
            → [nav: Features] → loading… → ERR_FEATURE_UNAVAILABLE
            → [nav: Blog]     → "Coming Soon" + newsletter
            → [nav: Sign In]  → signup form [not sign-in]
            → [logo click]    → home [different?]
            → [Enterprise]    → contact_sales → contact_sales_sent → main
```

**Narrative structure: comic repetition with variations.**

This path does not have a goal. The user is browsing. They are trying to understand what the product is before committing.

The navigation bar presents six options. Five of them are misleading.

"Home" triggers a 301 Moved Permanently page. The page explains that the home page has moved to a new URL and that the user will be redirected automatically. A countdown runs. After three seconds, they are back on the page they were trying to leave.

"About" loads a page titled "Our Story" in the breadcrumb and "About Nexus" in the section label. It contains three pricing tiers. A small note at the bottom says: *You appear to have navigated to the "About" page. This is our pricing page. The About page is currently being redesigned.* A hidden link leads to a 1998-era "Cool Links" page. A second leads to an Internet Explorer 4.0-era sitemap.

"Features" begins loading against a black screen with a Flash Player 8 message. Status messages cycle through thirteen variations and the progress bar stalls at 95%. After seven messages, an error page appears. The "Try Again" button repeats the sequence. A different "Features Broken" alias routes to the same page.

"Sign In" displays a form titled "Create your account." There is a link at the bottom that reads *Already have an account? Sign in* — clicking it goes to the actual sign-in form, which routes through an SSO error before arriving at a password form.

"Blog" says "Coming Soon" with an email field.

The Enterprise CTA on pricing goes to a contact sales form. The form notes an expected response time of 7–10 business days. The "Submit Request" button leads to a thank-you page that immediately suggests the Pro plan.

Clicking the logo goes to the home page, which appears identical to the last visit.

**Dramatic shape:** confident exploration → minor confusion → growing suspicion → acceptance that the map is not the territory and the territory is also wrong.

---

### Path 4 — The Support Request
*Kafka in product form.*

```
dashboard → help → [search: any query] → same 5 articles
          → article → "See also" → other article → "See also" → first article
          → Contact Support → support_ticket → ticket_submitted
          → [6 seconds] → auto-closed → re-open → ticket_needs_info
          → ticket_escalated → [queue grows] → ticket_merged [with 2019 ticket]
          → ticket_appeal → ticket_appeal_denied → open_new_ticket → …
```

**Narrative structure: the bureaucratic loop.**

The user has a problem. The Help Center exists for exactly this reason.

The search bar accepts any input and returns five articles. The results are the same regardless of query. A note below the results explains that the search index is currently rebuilding.

Each article ends with a "See also" link to a different article. The different article ends with a "See also" link back to the first. Both articles begin: *First, make sure you have a Nexus account.* Thumbs-up subscribes you to the Help Center Feedback Newsletter. Thumbs-down opens a support ticket form.

The support ticket form asks for issue type, subject, description, and priority. Submitting generates a ticket number. Six seconds later, the ticket is automatically resolved. A banner reads: *Ticket was automatically resolved. If your issue persists, please open a new ticket.*

The new ticket is reviewed and returned: eight additional fields required, most duplicating the original submission. Completing these escalates to Tier 2. The Tier 2 queue position increases over time rather than decreasing. Refreshing the status reveals the ticket has been merged with Ticket #0003 from March 2019 — resolved at the time — and therefore is now also resolved. An appeal requires 150 words explaining the difference from the 2019 report. The appeal is denied. Opening a new ticket restarts the cycle.

The chat widget is available throughout. The bot connects you with a specialist. The specialist queue grows from 1 to 4 agents. The team will respond in 3–5 business days.

**Dramatic shape:** problem → referral to documents → circular documents → submission to authority → authority resolves without engaging → escalation → merger with ancient history → appeal → denial → resubmission.

---

### Path 5 — The Nuclear Option
*An exit interview from a company that employs the concept of leaving as a retention tool.*

```
dashboard → account_settings → [Danger Zone tab] → delete_account
          → del_1 [type DELETE]
          → del_2 [50-word decline essay]
          → del_3 [retention offer]
          → del_done [email confirm required; link always expired]
          → del_email_confirm [attempts 1-3: expired, new link sent]
          → del_jordan_ring [incoming call from Jordan]
          → del_call [21-step call with Jordan + Brad the Senior Retention Specialist]
          → del_committee [status tracker; auto-cancelled at 7 checks]
          → dashboard [unchanged]
```

**Narrative structure: five-act negotiation you cannot win.**

The user has decided to delete their account. This is the most final available action.

The delete option is in Settings → Danger Zone. Clicking it begins a four-step modal process with a progress bar in red.

Step 1 requires the user to type DELETE in a text field to confirm they understand the action. The word is case-sensitive. This is standard. Step 1 is the last standard thing.

Step 2 introduces Jordan. Jordan is the user's "dedicated Customer Success Manager," available now, with a green dot indicating presence. Jordan would like a fifteen-minute call. A calendar appears for scheduling. Every visible date reads "No slots available." The alternative to scheduling is a textarea labeled *Declining? Please explain why. (Required, minimum 50 words).* The word count is tracked live.

Step 3 is the retention offer: three months of Pro for free, offer expiring in real time. The accept button is large and blue. The decline option is a ghost button labeled *No thank you, continue deleting.*

Step 4 asks for the user's full name with a long scrollable disclaimer.

The confirmation screen requires clicking a link in a confirmation email within 5 minutes. The link is always expired on arrival. Three attempts each generate a new link with a new 5-minute countdown. On the fourth attempt, the system escalates to a phone call: Jordan is calling. If the user declines, their refusal is logged to the account record and the request moves to a Deletion Review Committee — 847 requests ahead. If the user answers, a 21-step conversation script begins: Jordan, then a hold screen, then Brad, a Senior Retention Specialist, who submits the request to the same committee.

The committee status tracker shows 11–23% progress across nine named stages. The user can refresh the status. After 7 refreshes, the system flags this as excessive activity and cancels the request. The user may begin again.

**Dramatic shape:** decision → obstacle → negotiation → final offer → bureaucratic non-resolution → phone call → committee → automatic cancellation.

---

### Path 6 — The Survey
*A performance review that becomes a therapy session.*

```
footer → survey → Q1–Q7 [standard UX] → Q8–Q14 [personal]
       → Q15–Q21 [surreal] → Q22 [existential] → survey_done
       → [promo code, expires in 29 min, inapplicable to free plan]
       → newsletter upsell → if declined: newsletter about opting out of newsletters
```

**Narrative structure: tonal descent.**

The survey begins as a professional obligation and ends as something else.

Questions 1–7 are normal. Star rating, feature checklist, NPS, onboarding feedback, open text response (required, minimum 30 words). The kind of survey one fills out to feel like a conscientious user. The progress bar moves correctly.

Questions 8–14 expand in scope. "How would you describe your current work-life balance?" "When did you last take a vacation?" "On a scale of general happiness (1–5)." "If Nexus were a food, what food would it be?" — options: "A salad (healthy but joyless)," "A birthday cake (exciting at first)," "Cold soup." These questions are formatted identically to the product questions. The survey gives no signal that anything has changed.

Questions 15–21 complete the tonal shift. "We noticed you haven't created any projects. Is everything okay?" — options include "No, not really" and "I don't want to talk about it." "Do you feel your work has meaning?" "How often do you feel overwhelmed?" with the option *I'm overwhelmed right now, filling out this survey.* "Is software capable of experiencing loneliness?" "Are you currently being observed?" with the option *This question is making me paranoid.* One question announces that the next question will be optional. The "optional" question is blank — just a Continue button.

Question 22 reads: *Are you doing okay? Really.* The placeholder text in the textarea says: *You can be honest.*

The completion screen awards a promo code. The promo code expires in twenty-nine minutes. It is not applicable to the free plan, cannot be stacked, and excludes annual billing.

A final prompt asks whether the user would like to subscribe to the Survey Results Newsletter. Declining triggers a follow-up: "Would you like to subscribe to our newsletter about why you shouldn't subscribe to newsletters?"

**Dramatic shape:** mild civic duty → ambient discomfort → surrealism → brief sincerity → immediate commercialization of that sincerity.

---

---

### Path 7 — The Interactive Tour
*A point-and-click adventure game about corporate onboarding.*

```
footer → adv_intro → adv_lobby
       ├─ Take keycard (reception desk) → adds keycard to inventory
       ├─ Look at poster → toast
       ├─ Try elevator [keycard required] → out-of-service screen → lobby
       ├─ Go to stairwell → stairwell [was never locked] → adv_floor2
       │                                                   └─ if badge in inventory:
       │                                                      Exit door → adv_use_exit → adv_ending
       └─ Go to break room → adv_breakroom
            ├─ Examine coffee machine → toast (circular helpdesk note)
            ├─ Read whiteboard → whiteboard scene (clue: exit code = badge last 4 digits)
            └─ Open fridge → badge in envelope from HR → Take badge → adds badge to inventory

adv_floor2
  ├─ Examine your desk → desk scene (onboarding circular-dependency sticky note)
  ├─ Try exit door [no badge] → locked exit screen → back to floor 2 or break room
  └─ Use badge on exit door → BADGE ACCEPTED (code: 1234) → step through → adv_ending

adv_ending: "You escaped." → back in the lobby.
  Nexus Gamified Onboarding™ — Module 1 of 47 complete. 2.2% progress bar.
  → pricing / play again / return home
```

**Narrative structure: a puzzle that satirizes corporate gamification.**

The game is framed as Module 1 of 47 of the "Nexus Gamified Onboarding™." The player is a new hire who needs to find their desk on Floor 2 and escape the empty building.

The lobby has a keycard on an unmanned reception desk — the receptionist's "BACK IN 5 MIN" sign is three weeks old. The elevator requires the keycard but is permanently out of service (maintenance expected Q4, posted Q2). The stairwell door was never locked; the player assumed it needed a keycard. Most people do.

The badge — needed for the emergency exit reader — was mislaid in the break room fridge by HR six weeks ago, next to Gary's lunch, which Mark labeled again. The whiteboard clue (exit code = last 4 digits of badge ID) is buried under a full sprint of jargon. The badge ID is NEX-0000-1234; the code is 1234.

The desk on Floor 2 has a sticky note: the onboarding portal requires login; login requires completing onboarding. The monitor loads the Nexus logo, eternally.

The exit door opens. A long corridor. Another door. The player is in the lobby. Module 1 complete. 46 remaining. Progress resets on Sundays.

**Dramatic shape:** false barrier → wrong tool → right path was always open → item retrieval via side-quest → exit → loop.

---

### Path 8 — The Backrooms
*A liminal space that was always underneath the site.*

```
dashboard → data_export → [wait 45s] → bar overflows to 107% → "Open diagnostic console"
          → backrooms_enter [terminal boot sequence]
          → backrooms Room 00001 [Stage 1: SaaS chrome, subtly wrong]
          → backrooms Room 00002 [two identical Proceed buttons]
          → backrooms Room 00003 [normal]
          → backrooms Room 00004 [logo missing]
          → backrooms Room 00005 ["Getting colder." Trial: 14 days. Always.]
          → backrooms Room 00006 [Stage 2: yellowing, letter-spacing widens]
          → backrooms Room 00007 [auto-ticket: "you are not supposed to be here"]
          → backrooms Room 00008 [support chat: "Still looking into it…" No agents.]
          → backrooms Room 00009 ["Recede" button (goes forward), "Continue" (faded)]
          → backrooms Room 00010 [no windows, no doors, there is a button]
          → backrooms Room 00011 [Stage 3: full backrooms aesthetic, flicker CSS]
          → backrooms Room 00012 [export: 0% complete. export will never complete.]
          → backrooms Room 00013 [something in the room with you]
          → backrooms Room 00014 [corrupted Unicode strikethrough text]
          → backrooms Room 00015 [hint: "the code is [redacted]"] → loops to Room 05001
          → ... [rooms cycle, display number jumps by ~5000 per loop]

          exit (Stage 3 rooms only): type LEVEL0 → "Export complete. 1 file downloaded." → dashboard

cross-path: survey Q19 ("Are you currently being observed?") gains hidden option
            "Yes. Something is in the walls. The code is LEVEL0."
            — only shown if S.brVisited === true (user has entered the backrooms)
```

**Entry:** Discoverable only by waiting 45 seconds on the Export Data page. No hint anywhere in the site.

**The exit code** is redacted in the page source of Room 15 (text colored to match background). It is only clearly revealed via the survey cross-path, which itself requires having visited the backrooms first.

**Narrative structure:** false maintenance task → disorientation → liminality → endless void → conditional escape.

---

## Dead Ends

Locations the site routes to but from which there is no further progress:

| Scene | What happens |
|---|---|
| `footer_dead` | Toast: "This page is currently unavailable. Try again later." |
| `demo_play` | Requires signup to watch the demo |
| `blog` | Coming soon. Newsletter capture. |
| `mobile_download` | QR code "currently unavailable." Closed beta. |
| `data_export` | Export at 0%. Always. 3–5 business days. |
| `unsub_done` | Technically complete. Practically meaningless. |
| `contact_sales_sent` | "We'll be in touch." Pro plan upsell. |
| `del_done` | Email confirm required → link always expired. |
| `del_committee` [check 7] | Request auto-cancelled for "excessive activity." |
| `survey_done` | Promo code not redeemable on current plan. |
| `ticket_appeal_denied` | "Decision is final." Open new ticket to restart. |
| `checkout_alt` | Wire: 10-15 days. PayPal: 404. Invoice: enterprise only. Credits: $0. |
| `changelog` | All 2,847 entries: "Minor bug fixes and performance improvements." |
| `roadmap` | "Done" column empty. Features in progress since 2019. |
| `legal_doc` | "Currently being updated. Check back later." |
| `docs` | Modal: sign in required. Sign-in → sign-up. |
| `api_ref` | All v1 endpoints deprecated. v2 migration guide "coming soon." |
| `webinars` | All recordings "processing. Check back in 3–5 business days." |
| `community` | 1 post (2021), 0 replies, 847 views. Reply → sign in. |
| `templates` | All 9 templates locked: Pro only. |
| `careers_apply` step 4 | "Assessment server currently unavailable." Can skip step. |
| `cool_links` | Links to websites from 1998. Page dated June 14, 1998. |

## Loops

Routes that return the user to where they started:

| Loop | Mechanism |
|---|---|
| `cookie_prefs` → `cookies` | "Save Preferences" returns to the banner |
| `nav_home` → `main` | 301 redirect auto-fires after 3 seconds |
| `help` → `help` | "See also" links cycle between articles |
| `ticket_submitted` → `support_ticket` | Auto-close fires after 6 seconds |
| `session_extend` → `dashboard` | Timer restarts after identity verify |
| `del_committee` check 7 → `delete_account` | Deletion cancelled; user starts over |
| `del_cancel_request` → `dashboard` | Deletion cancelled; enrolled in Winback Program |
| `survey_done` (newsletter decline) → `main` | Newsletter about newsletters |
| `onboard_workspace` → `onboard_workspace` | Every URL already taken |
| `onboard_avatar` → `onboard_avatar` | Every photo rejected by compliance AI |
| `onboard_calendar` → `onboard_calendar` | Every OAuth attempt fails |
| `onboard_teammates` → `onboard_teammates` | Every invite bounces |
| `billing_card_added` → `billing` | Enrolled in auto-renewal; back to billing page |
| `export_request` → `data_export` | Export stuck at 0% |
| `settings_save` → `account_settings` | Success toast → immediate error toast |
| `del_email_confirm` → `del_email_confirm` | Link always expired; new link, same result |
