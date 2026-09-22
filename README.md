# Veinwise

Clinical decision support for vascular access nurses.
Right access. Safer care. Better outcomes.

Built for Miguel Narvaez, BSN RN — Vascular Access Nurse, Lee Health.
A product of Aeterna Atelier.

## What is in this folder

| File | Purpose |
|---|---|
| `index.html` | The whole app. HTML, CSS, JavaScript and the clinical database in one file. |
| `intro.webm`, `intro.mp4` | The Aeterna Atelier to Veinwise opening sequence, 4 seconds. Plays on the first open of the day; change it under More -> Settings -> Opening sequence. Audio is stripped because a splash autoplays muted and a phone should not make noise on a unit. |
| `policies/` | The eight source PDFs. Reference -> Policies -> any policy -> **Open the full policy**. Precached for offline. |
| `manifest.webmanifest` | Makes it installable as an app on your phone. |
| `sw.js` | Service worker: offline support and notification handling. |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Home screen icons. |

The Veinwise mark and wordmark in the top bar, and the Aeterna Atelier mark in the footer, are all
embedded in `index.html` as data URIs, so there are no extra image files to keep track of. The home
screen icons are cut from the same Veinwise mark.

## Putting it on your phone (Samsung Fold)

**Option A — GitHub Pages (recommended, gives you notifications and offline).**

1. Drop these files into your `Veinwise` repository, replacing what is there.
2. Commit and push. GitHub Pages serves them at `https://mcampi-sys.github.io/Veinwise/`.
3. Open that link in Chrome on the Fold.
4. Menu (three dots) → **Add to Home screen** → **Install**.
5. Open Veinwise from the home screen, go to **More → Settings → Alerts → Enable**, and allow notifications.

**Option B — just the file.** `index.html` works on its own if you open it from storage,
but notifications and offline caching need it served over https, so Option A is worth the five minutes.

## How it is put together

- **Everything is local.** All data lives in this device's browser storage. Nothing is uploaded,
  no account, no server. That also means: clearing Chrome's site data erases your shifts.
  Use **More → Backup & data → Export backup** regularly and keep the JSON in your own cloud drive.
- **No patient identifiers.** Room and unit only. The app never asks for a name or MRN — keep it that way.
- **The database is yours to grow.** Medications, video links and resources can be added from inside the
  app and are saved on the device. The built-in records come from your Lee Health policy documents
  and each one carries its source.
- **The illustrations are drawn in code.** Every diagram is inline SVG authored for this app — no stock
  images, nothing loaded from the network, no copyright attached. They scale cleanly on the Fold's
  outer and inner screens and follow light or dark mode. They are teaching aids, not to scale, and
  never replace ultrasound assessment or the device IFU.

## Reference tab

A card grid, not a menu. Seven destinations:

| Card | What it holds |
|---|---|
| **Vein map** | Tappable schematic of the arm — cephalic, accessory cephalic, basilic, median cubital, median antebrachial and dorsal metacarpal veins, plus a toggle for the deep brachial veins, brachial artery and median nerve. Each vessel opens depth, size, best use, gauge and hazards. Includes the gauge scale with ISO hub colors and the 45% catheter-to-vein rule. |
| **Devices** | A comparative figure showing where every device tip lands, then each device with its own diagram: tip position for PIV, midline, PICC, CVC and dialysis catheters, a cross-section comparing PowerPort 90° Huber access against PowerFlow 30° over-the-needle access, and an IO bone cross-section. |
| **Medications** | ~100 drugs with PIV, midline and central suitability, vesicant or irritant class, antidote and heat or cold. |
| **Algorithm** | Five questions, then a device with ranked policy reasoning. |
| **Policies** | Your Lee Health documents with locator numbers, plus the phlebitis and infiltration scales. |
| **Videos / Resources** | Shortcuts you can add to. |

## Policy PDFs

Every policy card opens the real document, not just the summary. The PDFs live in `policies/`
and the service worker precaches them on install, so they open on a dead unit with no signal.

When a policy gets revised, tap the **+** next to *Open the full policy*, pick the new PDF from the
phone, and Veinwise uses your copy from then on. Attached copies are kept in this device's
IndexedDB, not in the backup JSON, so re-attach them if you move to a new phone.

Because these are internal Lee Health documents, keep the repository private.

## The shift grade

Every consult is timed from **Start consult** to the moment you tick it off. Each one is measured
against a target for that kind of work, not against a single clock: a PICC gets 55 minutes, a PIV
gets 12, a dressing change gets 12 whatever device it is on. An unsuccessful attempt adds 10 minutes
to the target, a second RN assessment adds 5, tPA adds 30 per dose.

**Faster is never scored higher than on target.** A difficult access done carefully in 25 minutes is
better nursing than a rushed one in 8, and nothing here says otherwise.

The shift score is 100 points: 45 for consults against your own range, 20 for checks, 20 for pace,
15 for documentation you could still act on next week. S is 95+, then A, B, C, D and F below 55.
Under two hours worked it does not grade at all.

Anything on a clinical hold stays out of the pace score entirely — tPA dwell, waiting on an x-ray,
or anything you tick as clinically driven on the consult form. Time you did not control is not
your pace.

This is yours. No one else sees it, and it is not a reason to give a patient less time than the
work needs.

## Reminders, honestly

Android will fire the hydrate-and-break reminder while Veinwise is open or in the background.
It cannot wake a fully swiped-away app — that needs a push server, which would mean putting
your data on someone else's machine. Installing it to the home screen and leaving it running
in the background through your shift is the reliable pattern.

## Clinical sources

Built from the documents supplied with this project:

- M03 10 448 — IV Therapy, General Guidelines (rev 12/2025)
- M03 10 605 — Midline Catheter, Adult (6/2025)
- M03 10 711 — PICC / Ultrasound Guided Insertion, Adult (rev 2/2026)
- M03 10 357 — Hemodialysis Catheters for CRRT, Apheresis or Dialysis (4/2025)
- M03 10 432 — Intraosseous Needle Insertion, Care and Removal (3/2025)
- M03 10 299 — Extravasation / Infiltration of IV Drugs (rev 9/2025), including the full
  antidote and heat/cold table in Attachment 1
- M03 03 564 — Medication Safety, High Alert Medications (rev 7/2026)
- BD PowerFlow / PowerPort Technical Comparison, BD-120470 (© 2024 BD)
- INS Infusion Therapy Standards of Practice, 9th edition (2024), as cited in the above

Policies get revised. The electronic policy is the controlled document — when Veinwise and the
policy portal disagree, the portal wins, and the app needs updating.

## A note on sharing

The reference content summarizes internal Lee Health policy. Keep the repository private,
or strip the policy tab, before sharing this with anyone outside the system.
