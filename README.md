# 🩸 ESCAPE_PROTOCOL ft. ABANDONED COLLEGE
### *Escape Protocol — Master Horror Edition*

[![Genre: Noir Horror Escape Room](https://img.shields.io/badge/Genre-Noir%20Horror%20%2F%20Escape%20Room-8b0000.svg)](file:///e:/Pixathon/index.html)
[![Puzzles: 16 Rooms Solvable](https://img.shields.io/badge/Levels-16%20Interactive%20Puzzles-22c55e.svg)](file:///e:/Pixathon/horror_puzzle_design_spec.md)
[![Audio: Procedural Web Audio](https://img.shields.io/badge/Sound-Procedural%20Web%20Audio%20(Zero%20MP3s)-f59e0b.svg)](file:///e:/Pixathon/horror_visual_assets.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-3b82f6.svg)](file:///e:/Pixathon/LICENSE)

> *"October 28, 1994. The evacuation sirens wailed for three minutes before cutting out abruptly. Blackwood Hall was barricaded from the outside. They told the town it was a quarantine drill. They lied."*

**Blackwood '94: The Crimson Protocol** is a browser-based, 90s-styled point-and-click horror escape room game. Set across two 8-room wings of an abandoned collegiate facility, the game blends **film noir detective aesthetics**, **eerie darkroom crimson safe-lighting**, **graphic-novel comic linework**, and **tactile cyber-terminal deduction puzzles**.

---

## 📸 Visual Aesthetic & Influences

The visual identity and atmosphere directly synthesize three primary reference aesthetics:

| Reference Inspiration | In-Game Implementation |
| :--- | :--- |
| **Dusty Photo Darkroom Crimson Glow** | **Darkroom Crimson Mode**: Deep safe-light glow (`--crimson-glow: #ff2a2a;`), neon fluorescent ceiling fixtures with electrical ballast hum, drying twine lines with sway-animated polaroids, and an interactive **Chemical Developing Station** (Developer ➔ Stop Bath ➔ Fixer trays). |
| **Noir Confession (Graphic Novel GIF)** | **Noir Venetian Blinds Mode**: 38° angled window blind slatted light bars with atmospheric breathing animation, glowing emerald banker's desk lamp, smoking ashtray wisp animations, and 90s graphic novel black ink cel-shaded panels. |
| **Abandoned College Classroom** | **Classroom Crime Scene**: Overturned wooden and metal desks, peeling wallpaper revealing red brick, rain-streaked gothic windows, blood scrawls on blackboards, plus an interactive **Forensic Loupe Magnifier (2.5x)** for examining photographic evidence. |

---

## 🎮 Key Features

- **16 Fully Interactive Levels**: Implemented directly from the official `Escape Room - Questionaaire.pdf` across two distinct 8-stage campaigns.
- **16 Mandatory Hidden Clue Locations**: Every single hidden clue location specified in the master questionnaire is integrated with custom inspection narratives, evidence logs, and inventory rewards.
- **Atmospheric Visual Toggles (Top HUD)**:
  - 🔴 **Darkroom Crimson Mode**: Switches the global color palette to deep darkroom red safe-lighting.
  - ⬛ **Noir Venetian Blinds**: Casts animated diagonal blind shadows and drifting cigarette smoke.
  - 🔦 **Dynamic Flashlight Mode**: Generates a darkness vignette with a real-time cursor-following halogen beam.
  - 📺 **CRT Scanlines**: Emulates classic 90s cathode-ray tube television monitors.
  - 🔊 **Procedural Web Audio**: Zero external audio downloads. Generates sub-bass heartbeats (55Hz/42Hz), Geiger radiation clicks, camera shutter slaps, and typewriter clacks using the native HTML5 Web Audio API.
- **Forensic Mini-Games**:
  - **Darkroom Developing Station**: Dip undeveloped photographic film into Developer, Stop Bath, and Fixer baths to reveal hidden cipher codes.
  - **Forensic Loupe Magnifier**: Inspect evidence photos with a 2.5x cursor-following magnifying loupe.
- **Detective Notebook**: Automatically records discovered notes, ciphers, and lore entries.
- **3-Tier Hint Terminal**: Progressive hint system (Observation Nudge ➔ Deductive Correlation ➔ Direct Solution) with score tracking.
- **Campus Blueprint Navigator**: Interactive 16-room map featuring a *"Story Mode / Free Play"* toggle to jump to any room instantly for evaluation or testing.
- **Auto-Save & State Persistence**: Game progress, unlocked rooms, inventory items, and times automatically persist via `localStorage`.

---

## 🗺️ Campaign & Level Matrix

### 🏛️ Mission A: The Forgotten Wing *(Language & Visual Deduction)*
*Explore the sealed surface halls of Blackwood Academy to breach the lower perimeter.*

| Stg | Room | Theme / Lore | Hidden Clue Location *(from PDF)* | Puzzle Mechanic | Solution |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **01** | **Reception** | *The Gatekeeper's Rot* | Inside hollow base of reception desk drawer | Cross-reference notice initials [C.V.] with register log | `492` |
| **02** | **Locker Row** | *The Whispering Lockers* | Scratched onto underside of middle hallway bench | Locker #204 decals matched to torn period schedule | `738` |
| **03** | **Lecture Hall** | *Amphitheater of Shadows* | Tucked behind swinging hinge of chalkboard frame | Fill-in-the-blank deduction matched with professor notes | `BELL BEAST ABYSS` |
| **04** | **Library** | *The Stacks of Silence* | Carved into wooden leg of librarian's main desk | Arrange four tomes chronologically by Roman publication year | `VEIL` |
| **05** | **Art Room** | *Gallery of the Grotesque* | Hidden inside old hollowed plaster sculpture bust | Match wall silhouettes (Serpent, Moon, Hourglass, Eye) | `SERPENT - MOON - HOURGLASS - EYE` |
| **06** | **Staff Office** | *The Dean's Dissection* | Stuck to back panel of vertical filing cabinet | Reconstruct torn memo to find faculty photo with red seal | `615` |
| **07** | **Exam Room** | *The Silent Trial* | Flipped over & taped under examination podium | Caesar shift cipher: "Retreat 3 steps" on `SXUJH` | `PURGE` |
| **08** | **Sealed Corridor**| *The Final Threshold* | Scrawled in UV ink inside emergency electrical box | Synthesize Wing A deductions: Locker (738) + Cipher + ID | `738-PURGE-615` |

---

### 🔬 Mission B: Project Zero *(Science & Intelligence)*
*Descend into the subterranean research laboratory where classified biological and psychic experiments occurred.*

| Stg | Room | Theme / Lore | Hidden Clue Location *(from PDF)* | Puzzle Mechanic | Solution |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **01** | **Science Block** | *The Specimen Quarantine* | Inside sealed glass beaker on back prep shelf | Match equipment silhouettes: Burner (1), Beaker (4), Crucible (2), Flask (9) | `1429` |
| **02** | **Math Room** | *The Fractal Asylum* | Taped behind sliding wall-mounted whiteboard | Recursive Fibonacci sequence progression: `21 + 34` | `55` |
| **03** | **Chemistry Lab** | *The Elemental Tomb* | Engraved on metal underside of fume hood sink drain | Periodic table atomic numbers for elements `C - N - O - F` | `6789` |
| **04** | **Computer Lab** | *The Silicon Crypt* | Sticky note inside computer tower casing | Decode 8-bit binary stream into ASCII text | `ZERO` |
| **05** | **Optics Room** | *The Prismatic Void* | Concealed behind sliding lens cover of optical bench | Rotate 3 mirrors to deflect laser into photodiode sensor | `45-135-45` |
| **06** | **Electrical Lab**| *The High-Voltage Chasm* | Sealed behind warning hatch of breaker box | 5 knife switches: bypass ground-fault lines 2 and 4 | `ON - OFF - ON - OFF - ON` |
| **07** | **Storage Room** | *The Weight of the Dead* | Inside hollowed textbook dummy on bottom shelf | Dual-pan balance scale isolates heaviest container (Fuse) | `Canister C` |
| **08** | **Research Office**| *The Project Zero Vault* | Locked inside double-bottom drawer of researcher's desk | Insert Cryo Fuse + Golden Card + 4 Mission B metrics | `1429-55-6789-ZERO` |

---

## 📂 Project Structure

```plaintext
E:\Pixathon\
├── index.html                       # Master game viewport, HUD, inventory dock & modals
├── escape_game_engine.js            # Game state machine, puzzle routers, audio hooks, autosave
├── horror_puzzle_data.js            # 16-room dataset: lore, hotspot coordinates, puzzle logic, hints
├── horror_visual_assets.js          # Procedural Web Audio engine & SVG room scene generators
├── horror_noir_theme.css            # Darkroom crimson styles, venetian blind shaders, tactile UI
├── horror_puzzle_design_spec.json   # Machine-readable specification schema
├── horror_puzzle_design_spec.md     # Narrative lore and puzzle design documentation
├── test_all_puzzles.js              # Test suite: verifies all 16 puzzle solutions
├── test_hidden_clues.js             # Test suite: verifies all 16 mandatory hidden clues
├── verify_integration.js            # Test suite: verifies DOM bindings and ID mappings
├── download (17).jpeg               # Reference Image: Abandoned classroom
├── Dusty Photo Darkroom...jpeg      # Reference Image: Crimson darkroom wallpaper
├── NOIR CONFESSION...gif            # Reference Media: Noir detective animated scene
└── Escape Room - Questionaaire.pdf  # Master source questionnaire document
```

---

## ⚡ Quick Start & How to Play

### Option 1: Direct Browser Launch
Simply double-click [`index.html`](file:///e:/Pixathon/index.html) or drag it into any modern web browser (Chrome, Edge, Firefox, Brave, Safari).

### Option 2: Local HTTP Server (Recommended)
To prevent local browser file-origin restrictions:

```bash
# Navigate to the workspace directory
cd E:\Pixathon

# Start a local Python server
python -m http.server 8000
```
Open **[http://localhost:8000/index.html](http://localhost:8000/index.html)** in your browser.

---

## 🕹️ Controls & HUD Quick Guide

| Button / Control | Functionality |
| :--- | :--- |
| **🔴 DARKROOM** | Toggles deep crimson safe-lighting and overhead fluorescent hum. |
| **⬛ NOIR BLINDS** | Toggles 38° diagonal window blind shadows and animated smoke wisps. |
| **🔦 FLASHLIGHT** | Activates dynamic darkness vignette that illuminates where the cursor moves. |
| **📺 CRT** | Toggles retro cathode-ray scanline overlay. |
| **🔊 AUDIO** | Mutes / Unmutes procedural chiptune and horror audio synthesizer. |
| **🗺️ MAP** | Opens the 16-Room Campus Blueprint with instant level jumping. |
| **🔬 INSPECT** | Opens the Forensic Loupe Magnifier (2.5x) over photographic evidence. |
| **🧪 DEVELOP** | Opens the Darkroom Chemical Developing Station mini-game. |
| **📖 NOTEBOOK** | Opens the detective dossier of all collected clues and lore entries. |
| **💡 HINT** | Opens the 3-Tier progressive hint terminal. |
| **REBOOT** | Resets mission state and restarts from Room 01. |

---

## 🧪 Automated Testing & Verification

The project includes automated verification test scripts that run with Node.js:

```bash
# Verify that all 16 puzzle solutions match the specification
node test_all_puzzles.js

# Verify that all 16 mandatory hidden clues exist and award items
node test_hidden_clues.js

# Verify all 62 DOM elements, script bindings, and modal IDs
node verify_integration.js
```

All tests pass with **100% compliance** and zero missing DOM element bindings.

---

## 📜 Credits & License

- **Game Engine & Design**: Escape Protocol Team (Pixathon Master Edition).
- **Inspirations**: *Noir Confession* by Daniil "jpegman" Suponitskiy, classic PC-98 adventure games, and analog photographic darkroom techniques.
- **License**: MIT Open Source License.
