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
  ├─ nav: Features    → features [loads for 5s, returns ERR_FEATURE_UNAVAILABLE]
  ├─ nav: Pricing     → pricing
  ├─ nav: Blog        → blog [coming soon, newsletter capture]
  ├─ nav: Sign In     → signin [renders signup form]
  ├─ nav: Get Started → pricing
  ├─ CTA: Start Free  → pricing
  ├─ footer: About    → about [pricing page]
  ├─ footer: Pricing  → pricing
  ├─ footer: Help     → help
  ├─ footer: Survey   → survey
  ├─ footer: Unsubscribe → unsubscribe
  ├─ footer: [most links] → footer_dead [toast: "unavailable"]
  └─ 12s timer        → mobile_prompt [modal; dismisses but returns]

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
  └─ Resend code      → toast, S.verifyAttempts resets → retry

dashboard (reached after verify)
  ├─ Create Project   → dash_new_project → project modal (4 steps)
  │                     └─ "Project created!" toast → dashboard [project not saved]
  ├─ Finish setup     → signup_3 [back to form step 3]
  ├─ Upgrade          → pricing
  ├─ sidebar: Billing → billing
  ├─ sidebar: Settings → account_settings
  ├─ sidebar: Export  → data_export
  ├─ sidebar: Help    → help
  ├─ sidebar: Support → support_ticket
  ├─ sidebar: Delete  → delete_account
  ├─ chat button      → chat [floating panel, bot script]
  └─ 38s timer        → session_expire → [verify identity → timer restarts]

billing
  └─ Add Payment → free_checkout → billing_card_added → billing
                   [checkout for "free" plan includes $8.96/mo in mandatory fees]

account_settings (tabs: Profile | Notifications | Security | Privacy | Danger Zone)
  ├─ Profile: Save         → settings_save → [success toast → immediate error toast]
  ├─ Notifications: Save   → [toast: subscribed to Preferences Newsletter]
  ├─ Security: Update Pw   → [toast: current password incorrect]
  ├─ Privacy               → cookie_prefs [loop]
  └─ Danger Zone           → delete_account

delete_account (step 1 of 4)
  ├─ step 1: type DELETE  → del_1 (step 2: Jordan the CSM)
  ├─ step 2: Schedule     → del_schedule [no available slots] → close_overlay
  │           Decline      → [requires 50-word essay]         → del_2
  ├─ step 3: Retention offer                                   → del_3
  │           Accept       → del_offer_accept → dashboard [deletion cancelled]
  ├─ step 4: Type full name                                    → del_done
  └─ del_done: "90 business days. Account remains active. Continue Using Nexus." → dashboard

help
  └─ any search → same 5 articles [search index "rebuilding"]
  └─ article_X  → article body → "See also: article_Y" → article_Y → "See also: article_X"
  └─ Contact Support → support_ticket

support_ticket
  └─ Submit → ticket_submitted → [auto-closed after 6s] → support_ticket [same page, resolved banner]

survey (22 questions)
  ├─ Q1–Q7:   Standard UX questions
  ├─ Q8–Q14:  Personal (vacation dates, happiness scale, work-life balance)
  ├─ Q15–Q21: Surreal (software loneliness, "are you being observed", optional blank question)
  └─ Q22:     "Are you doing okay? Really." → survey_done
              └─ Promo code (expires in 29 min, not applicable to free plan)
              └─ Newsletter upsell → if declined: newsletter about opting out of newsletters

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
```

---

## Depth Escalation (Cross-Cutting)

`S.depth` increments on each navigation call. It alters the site globally regardless of path taken.

| Depth | Effect |
|-------|--------|
| 6     | Depth pill appears in top-right corner: "Getting warmer…" |
| 7     | Cookie banner reappears ("same cookies, new legal basis") |
| 10    | Dashboard shows "Unusual activity detected" alert |
| 12    | Dashboard notes prior failed project attempt |
| 14    | Awareness modal: "We've noticed you. 94th percentile of users." |
| 15    | Dashboard message changes to "Hello. Are you still there?" |
| 16    | Empty state copy changes: "Still no projects." |
| 18    | Nav CTA becomes "Upgrade (Please)" |
| 20    | Security alert toast: unusual navigation patterns |
| 22    | Logo gains "™ ERROR" label |

Trial days remaining in the dashboard nav also counts down as depth increases (`14 - floor(depth/3)`).

---

## Narrative Paths

Six primary journeys through the site. Each is walkable from beginning to end. Each has a distinct dramatic structure.

---

### Path 1 — The Onboarding
*A Bildungsroman where the protagonist never arrives.*

```
home → cookies → loading → newsletter → main → pricing → signup
     → signup_2 → signup_3 → signup_4 → signup_5 → signup_6
     → signup_7 → [verify loop] → dashboard → dash_new_project
     → dashboard [empty]
```

**Narrative structure: rising action with false peaks.**

The user arrives at a polished, confident product. Everything about the landing page says *this is the last tool you'll ever need* — the kind of copy that implies every prior tool was a mistake and this one won't be.

The first obstacle is the cookie banner, which positions itself as a formality. "Accept All" is the path of least resistance; the alternatives go nowhere useful. The user accepts. A loading bar fills to 100% and the word "Personalizing" cycles through variations on the same action noun.

A newsletter popup appears before the page is fully visible. The decline option is a shame link: *No thanks, I prefer to remain professionally stagnant.* The user is invited to feel bad about their reluctance.

The marketing site presents six features, five testimonials, and three pricing tiers. The cheapest is labeled "Free" with an asterisk. The asterisk leads to more asterisks.

Signup begins at Step 1 of 3. By Step 2, it is Step 2 of 5. By Step 3, it is Step 3 of 8. The form does not explain the discrepancy. The step counter is stated with full confidence each time.

Step 4 asks for a phone number. The Skip button exists but is disabled. Its tooltip says *required for account security.* Step 5 offers integrations; skipping produces a guilt modal with a statistic ("40% less value"). Step 6 asks for team invites; skipping produces another guilt modal ("churn 3× faster"). These are not blocked — the user can click through — but each exit is labeled as the wrong choice.

Step 7 is email verification. The code is wrong the first time. The second failure warns of one attempt remaining. The third locks the account for thirty minutes. The countdown runs in real time.

The dashboard is empty. The project creation modal runs four steps and reports success. The toast reads: *Project created successfully!* The dashboard is still empty. A note appears below the empty state: "Previously attempted: 1 time. Data not saved."

The onboarding checklist in the sidebar shows 20% completion. Completing any item adds a new item. The trial countdown in the nav is already shorter than it was.

**Dramatic shape:** ascent → false summit → ascent → false summit → arrival at an empty room that calls itself a destination.

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

"About" loads a page titled "Our Story" in the breadcrumb and "About Nexus" in the section label. It contains three pricing tiers. A small note at the bottom says: *You appear to have navigated to the "About" page. This is our pricing page. The About page is currently being redesigned.*

"Features" begins loading. Status messages cycle: *Loading features overview… Fetching feature list… Rendering interactive demos… Still loading… Hmm, this is taking longer than expected… Attempting to reconnect…* After seven messages, an error page appears with an error code and a "Try Again" button that repeats the sequence.

"Sign In" displays a form titled "Create your account." The form asks for a name and email and has a "Create Account" button. There is a link at the bottom that reads *Already have an account? Sign in* — clicking it goes to the actual sign-in form, which routes through an SSO error before arriving at a password form.

"Blog" says "Coming Soon" with an email field.

The Enterprise CTA on pricing goes to a contact sales form. The form notes an expected response time of 7–10 business days. The "Submit Request" button leads to a thank-you page that immediately suggests the Pro plan.

Clicking the logo goes to the home page, which appears identical to the last visit.

**Dramatic shape:** confident exploration → minor confusion → growing suspicion → acceptance that the map is not the territory and the territory is also wrong.

---

### Path 4 — The Support Request
*Kafka in product form.*

```
dashboard → help → [search: any query] → same 5 articles
          → article_A → "See also: article_B"
          → article_B → "See also: article_A"
          → Contact Support → support_ticket → ticket_submitted
          → [6 seconds] → auto-closed → support_ticket [resolved banner]
          → [submit again] → [auto-close again] → …
```

**Narrative structure: the bureaucratic loop.**

The user has a problem. The Help Center exists for exactly this reason.

The search bar accepts any input and returns five articles. The results are the same regardless of query. A note below the results explains that the search index is currently rebuilding.

Each article is roughly 200 words and ends with a "See also" link to a different article. The different article ends with a "See also" link back to the first. Both articles begin: *First, make sure you have a Nexus account. If you don't have one, sign up here.*

The "Was this article helpful?" section has two options: thumbs up and thumbs down. Thumbs up thanks you and subscribes you to the Help Center Feedback Newsletter. Thumbs down opens a support ticket form.

The support ticket form asks for issue type, subject, description (with guidance to include error messages, reproduction steps, and things already tried), and priority. The priority field notes that "Critical" is available on Enterprise plans only. Submitting the form generates a ticket number and a toast: *Confirmation email sent.*

Six seconds later, another toast: the ticket has been automatically resolved by the system. The page refreshes to show the ticket in "Resolved" status. A banner reads: *Ticket #XXXXX was automatically resolved. If your issue persists, please open a new ticket.*

The new ticket form is identical. The cycle has no exit that the system acknowledges as an exit.

The chat widget is available throughout. The bot connects you with a specialist. The specialist queue grows from 1 to 4 agents. The team will respond in 3–5 business days.

**Dramatic shape:** problem → referral to documents → circular documents → submission to authority → authority resolves without engaging → resubmission → identical result.

---

### Path 5 — The Nuclear Option
*An exit interview from a company that employs the concept of leaving as a retention tool.*

```
dashboard → account_settings → [Danger Zone tab] → delete_account
          → del_1 [Jordan the CSM]
          → del_schedule [no slots available]
          → del_2 [50-word decline essay]
          → del_3 [retention offer]
          → del_done ["90 business days; account remains active; still being billed"]
          → dashboard [unchanged]
```

**Narrative structure: five-act negotiation you cannot win.**

The user has decided to delete their account. This is the most final available action.

The delete option is in Settings → Danger Zone. Clicking it begins a four-step modal process with a progress bar in red.

Step 1 requires the user to type DELETE in a text field to confirm they understand the action. The word is case-sensitive. This is standard. Step 1 is the last standard thing.

Step 2 introduces Jordan. Jordan is the user's "dedicated Customer Success Manager," available now, with a green dot indicating presence. Jordan would like a fifteen-minute call. A calendar appears for scheduling. Every visible date reads "No slots available." The alternative to scheduling is a textarea labeled *Declining? Please explain why. (Required, minimum 50 words).* The word count is tracked live.

Step 3 is the retention offer: three months of Pro for free, $147 value, offer expiring in real time on a countdown clock. The accept button is large and blue. The decline option is a ghost button labeled *No thank you, continue deleting* — once again requiring the user to perform their own intention as a speech act.

Step 4 asks for the user's full name. Below the input is a long scrollable disclaimer that covers data retention (7 years), username permanence, ongoing transactional emails, and a note about the phase of the moon.

The confirmation screen reads: *Deletion Request Received.* The account will be deleted in 90 business days. The account remains fully active until then. The user will continue to be billed during the deletion window (please cancel subscription separately). A confirmation email must be clicked within 24 hours or the request is cancelled.

Two buttons: *Continue Using Nexus* (primary, blue) and *Cancel Deletion* (ghost). Cancelling deletion produces a toast: *We've enrolled you in our Winback Program. Expect an email.*

**Dramatic shape:** decision → obstacle → negotiation → final offer → bureaucratic non-resolution that looks like resolution.

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

Questions 1–7 are normal. Star rating, feature checklist, NPS, onboarding feedback. The kind of survey one fills out to feel like a conscientious user. The progress bar moves correctly.

Questions 8–14 expand in scope. "How would you describe your current work-life balance?" "When did you last take a vacation?" "On a scale of general happiness (1–5)." These questions are formatted identically to the product questions. The same radio button style, the same spacing. The survey gives no signal that anything has changed.

Questions 15–21 complete the tonal shift. "Do you feel your work has meaning?" "How often do you feel overwhelmed?" with the option *I'm overwhelmed right now, filling out this survey.* "Is software capable of experiencing loneliness?" "Are you currently being observed?" with the option *This question is making me paranoid.* One question announces that the next question will be optional. The "optional" question is blank — just a Continue button.

Question 22 reads: *Are you doing okay? Really.* The placeholder text in the textarea says: *You can be honest.*

The completion screen awards a promo code. The promo code expires in twenty-nine minutes. It is not applicable to the free plan, cannot be stacked, and excludes annual billing.

A final prompt asks whether the user would like to subscribe to the Survey Results Newsletter. Declining triggers a follow-up: "Would you like to subscribe to our newsletter about why you shouldn't subscribe to newsletters?"

**Dramatic shape:** mild civic duty → ambient discomfort → surrealism → brief sincerity → immediate commercialization of that sincerity.

---

## Dead Ends

Locations the site routes to but from which there is no further progress:

| Scene | What happens |
|---|---|
| `footer_dead` | Toast: "This page is currently unavailable. Try again later." |
| `demo_play` | Requires signup to watch the demo |
| `blog` | Coming soon. Newsletter capture. |
| `mobile_download` | QR code "currently unavailable." Closed beta. |
| `data_export` | Export at 0%. Always. |
| `unsub_done` | Technically complete. Practically meaningless. |
| `contact_sales_sent` | "We'll be in touch." Pro plan upsell. |
| `del_done` | Deletion scheduled for 18 weeks from now. Account still active. |
| `survey_done` | Promo code not redeemable on current plan. |

## Loops

Routes that return the user to where they started:

| Loop | Mechanism |
|---|---|
| cookie_prefs → cookies | "Save Preferences" returns to the banner |
| nav_home → main | 301 redirect auto-fires after 3 seconds |
| help → help | "See also" links cycle between two articles |
| ticket_submitted → support_ticket | Auto-close fires after 6 seconds |
| session_extend → dashboard | Timer restarts after identity verify |
| del_cancel_request → dashboard | Deletion cancelled; enrolled in Winback Program |
| survey_done (newsletter decline) → main | Newsletter about newsletters |
