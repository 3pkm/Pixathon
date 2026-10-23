# ESCAPE PROTOCOL: HAUNTED 1990s COLLEGE - MASTER HORROR NARRATIVE & PUZZLE DESIGN SPECIFICATION
**Setting:** Blackwood Hall & Subterranean Project Zero Complex, October 28, 1994 Lockdown  
**Version:** 1.0.0 | **Role:** Horror Narrative & Puzzle Design Specialist

---
## Executive Summary & Narrative Overview

Set in the dead hours of October 28, 1994, **Escape Protocol: Haunted College** plunges players into the night an unspeakable bio-metaphysical containment failure sealed Blackwood Hall. The faculty, researchers, and students were given no evacuation warning; automatic blast dampers slammed shut, neurotoxic suppressants flooded the vents, and whatever entity was being bred in the subterranean Project Zero laboratory began hunting through the walls.

This master document specifies the complete puzzle architecture, atmospheric lore, interactive hotspots, mandatory hidden clue mechanics from the operational PDF log, progressive 3-tier hints, and logical solutions across all **16 playable rooms** spanning **Mission A (The Forgotten Wing)** and **Mission B (Project Zero)**.

---
# THE FORGOTTEN WING — LANGUAGE & VISUAL DEDUCTION
**Wing Theme & Aesthetics:** 1990s Humanities & Administrative Wing (Blackwood Hall). Decrepit mahogany, peeling floral wallpaper, flickering amber lights, blood-stained registers, dry chalk dust, and whispering echoes.

## Room 01: Reception — *"The Gatekeeper's Rot"*
**Atmospheric Lore:** On October 28, 1994, at 11:15 PM, night receptionist Clara Vance locked the heavy iron corridor gates as panicked shrieks echoed from the auditorium. Her dried blood still stains the visitor ledger where she frantically crossed off names of students who never returned from the dark.

**Visual Aesthetics:** Noir shadow blinds cast slanted cage-like shadows across a water-damaged mahogany desk. A shattered fluorescent tube hums overhead in erratic yellow spasms. Rain lashes against cracked bay windows while mold crawls up peeling collegiate wallpaper.

### Interactive Hotspots & Clue Placements
- **`noticeboard` — Staff Bulletin Board**:
  - *Visual Description:* A corkboard with yellowed eviction memos and a stained staff memorandum dated Oct 28, 1994, bearing the initials C.V. and emergency instructions.
  - *Clue Content / Text:* MEMORANDUM (28-OCT-1994): In event of Level-3 lockdown, only visitors whose clearance matches active registrar initials [C.V.] remain validated. All other entries must be struck from the manifest.
- **`register` — Dusty Visitor Register**:
  - *Visual Description:* A leather-bound registry on the counter with names crossed out in violent fountain pen strokes.
  - *Clue Content / Text:* 10:15 PM - J. Miller (Student) [STRIKE]
10:40 PM - K. Harris (Lecturer) [STRIKE]
11:05 PM - D. Aris (Janitor) [STRIKE]
11:12 PM - C. Vance (Registrar) — Gate PIN: 492 [UNCROSSED]
11:20 PM - M. Thorne (Guard) [STRIKE]
- **`reception_drawer_base` — Hollow Desk Drawer Base** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* A loose false bottom inside the lower receptionist desk drawer.
  - *PDF Log Mapping:* `Inside the hollow base of the reception desk drawer`
  - *Discovery Text:* You pry loose the splintered false bottom of the desk drawer. Hidden inside lies a tarnished Brass Skeleton Key and a trembling note dated midnight: "C.V. - The iron gates will hold them for only a few minutes. Take the key... and never turn back."
  - *Item Yielded:* `Brass Skeleton Key`
  - *Clue Yielded:* Confirms C.V. is Clara Vance and warns that gates require PIN 492.
- **`gate_keypad` — Barred Security Gate & Digital Keypad**:
  - *Visual Description:* Heavy iron security gates blocking access to the corridor. Beside it hangs a worn 1990s push-button digital keypad with a flashing crimson LED.
  - *Clue Content / Text:* KEYPAD STATUS: LOCKED. ENTER 3-DIGIT CLEARANCE PIN.

### Primary Puzzle Mechanics
- **Puzzle Type:** Simple Clue Matching / Numeric PIN
- **Input Mechanism:** `3-Digit Push-Button Keypad`
- **Exact Correct Answer:** `492`
- **Deduction Path:** Cross-reference the initials "C.V." from the noticeboard memo with the visitor register entries. Only Clara Vance (C.V.) at 11:12 PM remains uncrossed, which records gate clearance PIN 492.
- **Hidden Clue Function:** The hidden drawer base proves C.V. is Clara Vance and provides the Brass Skeleton Key needed for later rooms.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Check the staff memorandum pinned to the bulletin board. Whose initials authorised the lockdown clearance?
2. **Tier 2 (Deductive Correlation):** Find the name in the visitor logbook whose initials match 'C.V.'. Only one entry is not struck through with ink.
3. **Tier 3 (Direct Solution):** Clara Vance's entry at 11:12 PM is the uncrossed entry. Enter her 3-digit clearance PIN '492' into the gate keypad.

**Level Completion Award:** `Brass Skeleton Key & Unlocked Corridor Gate`

<br>

## Room 02: Locker Row — *"The Whispering Lockers"*
**Atmospheric Lore:** Metal lockers lining Hallway B rattle violently whenever the wind howls through shattered skylights, as if someone is trapped inside banging to be let out. In 1994, star student Samuel Ward crawled into locker #204 during the frenzy and suffocated in complete silence.

**Visual Aesthetics:** Sallow green rust coats rows of battered school lockers. Long dried trails of crimson drag marks streak across the checkered linoleum floor toward Locker #204. Flickering emergency floodlights cast elongated, jittering silhouettes down the hallway.

### Interactive Hotspots & Clue Placements
- **`torn_timetable` — Torn Class Timetable**:
  - *Visual Description:* A water-damaged timetable pinned to the wall showing period numbers for the Fall 1994 semester.
  - *Clue Content / Text:* TIMETABLE (FALL 1994):
Period 1: English Lit
Period 3: Advanced Calculus (Math)
Period 5: Modern History
Period 7: Organic Chemistry (Chem Lab)
Period 8: Experimental Physics (Physics Lab)
- **`locker_stickers` — Locker #204 Subject Decals**:
  - *Visual Description:* Locker #204 has yellow chalk outlines and three distinct stickers pasted over the vents.
  - *Clue Content / Text:* Sticker 1: Erlenmeyer chemical flask (Chemistry)
Sticker 2: Square root & protractor (Math)
Sticker 3: Atom with electron orbits (Physics)
- **`middle_bench_underside` — Underside of Middle Hallway Bench** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* Kneeling on the blood-stained checkered floor reveals frantic gouges carved into the wooden bench slat.
  - *PDF Log Mapping:* `Scratched onto the underside of the middle bench near the lockers`
  - *Discovery Text:* Carved with a pocketknife into the underside of the middle bench are desperate jagged words: "ORDER IS SACRED: Chem -> Math -> Phys. Don't let them hear the tumblers turn."
  - *Item Yielded:* `None`
  - *Clue Yielded:* Establishes the exact sequence order: Chemistry (Period 7), Math (Period 3), Physics (Period 8).
- **`locker_204_dial` — Locker #204 Rotary Dial Lock**:
  - *Visual Description:* A heavy three-tumbler rotary dial lock securing the battered door of Locker #204.
  - *Clue Content / Text:* DIAL TUMBLERS: [ 0 ] - [ 0 ] - [ 0 ]

### Primary Puzzle Mechanics
- **Puzzle Type:** Number / Order Puzzle
- **Input Mechanism:** `3-Tumbler Rotary Combination Dial (0-9, 0-9, 0-9)`
- **Exact Correct Answer:** `738`
- **Deduction Path:** Identify the three subjects represented by the locker stickers (Chemistry, Math, Physics). Look up their respective period numbers on the torn timetable (Chem = 7, Math = 3, Physics = 8). The hidden bench inscription confirms the order Chem -> Math -> Physics, yielding 7-3-8.
- **Hidden Clue Function:** Removes ambiguity on subject ordering, verifying that Chem is first, Math second, and Physics third.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Locker #204 is marked with stickers for three academic subjects. Check the torn timetable on the wall for their class periods.
2. **Tier 2 (Deductive Correlation):** Look under the wooden bench opposite the lockers for the correct subject order: Chemistry first, Math second, Physics third.
3. **Tier 3 (Direct Solution):** Chemistry is Period 7, Math is Period 3, and Physics is Period 8. Turn the three rotary dials to 7 - 3 - 8.

**Level Completion Award:** `Magnetic Security Keycard (Bulkhead Access)`

<br>

## Room 03: Lecture Hall — *"Amphitheater of Shadows"*
**Atmospheric Lore:** Steep wooden stadium seating descends into pitch-black gloom where Professor Aldus Crowley delivered his final lecture on occult philology before vanishing mid-sentence. Chalk dust still hangs suspended in the stagnant chill, smelling of brimstone and wet copper.

**Visual Aesthetics:** Towering tiered rows of empty wooden desks face an expansive slate blackboard cracked down the center. A single spotlight creaks overhead, swaying slightly on a frayed cord. Shadows dance between the folding theater seats like watchful spectators.

### Interactive Hotspots & Clue Placements
- **`blackboard` — Cracked Slate Blackboard**:
  - *Visual Description:* A massive blackboard covered in Crowley's unfinished lecture thesis with three underlined missing words.
  - *Clue Content / Text:* THESIS: "WHEN THE [ ___ ] FALLS SILENT, THE [ ___ ] AWAKENS IN THE [ ___ ]."
- **`professor_notes` — Lectern Portfolio & Margin Notes**:
  - *Visual Description:* Professor Crowley's personal lecture notes with manic handwritten vocabulary scribbles in the margins.
  - *Clue Content / Text:* Margin p.14: "The bell tower chimes cease at midnight; the BELL falls silent..."
Margin p.22: "Beneath our feet, the BEAST awakens from ancient slumber..."
Margin p.39: "All light is consumed in the ABYSS between worlds..."
- **`chalkboard_frame_hinge` — Swinging Chalkboard Frame Hinge** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* A narrow gap behind the cast-iron swinging hinge on the left side of the blackboard.
  - *PDF Log Mapping:* `Tucked behind the swinging hinge of the chalkboard frame`
  - *Discovery Text:* Behind the iron frame hinge, you find a folded slip of parchment sealed with red wax: "Look closely at the handwriting: 1. BELL (silence), 2. BEAST (awakens), 3. ABYSS (depths). The trinity of words disengages the lectern lock."
  - *Item Yielded:* `Antique Iron Cog`
  - *Clue Yielded:* Direct verification of the three missing words: BELL, BEAST, ABYSS.
- **`lectern_cylinder_lock` — Lectern Cylinder Letter Mechanism**:
  - *Visual Description:* A brass cylinder lock on the professor's podium that controls the exit door solenoid.
  - *Clue Content / Text:* ENTER WORDS: [ WORD 1 ] - [ WORD 2 ] - [ WORD 3 ]

### Primary Puzzle Mechanics
- **Puzzle Type:** Language Deduction / Sentence Completion
- **Input Mechanism:** `3-Word Text Input (or 3 rotating cylinder word dials)`
- **Exact Correct Answer:** `BELL BEAST ABYSS`
- **Deduction Path:** Match each contextual phrase in the incomplete blackboard thesis to Crowley's margin notes: "falls silent" corresponds to BELL; "awakens" corresponds to BEAST; "in the" corresponds to ABYSS. The completed sentence is: "WHEN THE BELL FALLS SILENT, THE BEAST AWAKENS IN THE ABYSS."
- **Hidden Clue Function:** Provides the exact word order and rewards the Antique Iron Cog.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Read the unfinished sentence on the blackboard and compare each blank with Professor Crowley's margin notes on the podium.
2. **Tier 2 (Deductive Correlation):** Look closely at the handwriting in the margins: find which specific words accompany "falls silent", "awakens", and "in the".
3. **Tier 3 (Direct Solution):** The missing words in order are BELL, BEAST, ABYSS. Input them into the lectern mechanism.

**Level Completion Award:** `Antique Iron Cog & Amphitheater Exit Unlock`

<br>

## Room 04: Library — *"The Stacks of Silence"*
**Atmospheric Lore:** Two stories of towering mahogany bookcases reek of decay and decomposing bookbindings. The chief librarian was found crushed beneath the collapsed Folklore section in 1994, clutching an index card bearing a warning about an entity veiled behind the stacks.

**Visual Aesthetics:** Dusty emerald banker's lamps flicker erratically atop green felt reading tables. Tall wrought-iron spiral staircases lead to shadowy catwalks shrouded in spiderwebs. Torn book pages flutter across the parquet floor in an unnatural sub-zero draft.

### Interactive Hotspots & Clue Placements
- **`librarian_note` — Librarian's Cataloging Mandate**:
  - *Visual Description:* A blood-spotted index card on the central cataloging table.
  - *Clue Content / Text:* MANDATE (OCT 1994): "Order the four displaced grimoires chronologically by Roman publication year. Their gilded spine letters will reveal the secret word that blinds the watchers."
- **`displaced_books` — Four Scattered Ancient Tomes**:
  - *Visual Description:* Four heavy leather-bound tomes on the reading desk, each with an embossed spine letter and a title page date.
  - *Clue Content / Text:* Tome 1: Spine [E] - "Echoes of the Void" (Pub. MDCCCLXXXIX = 1889)
Tome 2: Spine [L] - "Lamentations of Blackwood" (Pub. MCMXXXIX = 1939)
Tome 3: Spine [V] - "Voyage of the Damned" (Pub. MDCCCXLII = 1842)
Tome 4: Spine [I] - "Incantations of Shadows" (Pub. MCMXIV = 1914)
- **`desk_leg_carving` — Librarian's Desk Wooden Leg** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* The carved claw-foot leg of the oak desk has deep incisions hidden on its inner face.
  - *PDF Log Mapping:* `Carved into the wooden leg of the librarian's main reading desk`
  - *Discovery Text:* Carved into the rear of the librarian's desk leg is a jagged inscription: "Pay attention to the roman numerals. Earliest to latest: 1842 (V), 1889 (E), 1914 (I), 1939 (L). The word is VEIL." Tucked inside a wood split is an Etched Brass Bookmark.
  - *Item Yielded:* `Etched Brass Bookmark`
  - *Clue Yielded:* Confirms the chronological order and spells the secret word VEIL.
- **`bookcase_vault_box` — Bookcase Lockbox**:
  - *Visual Description:* A 4-letter rotating letter padlock securing a recessed wall safe within the bookshelf arch.
  - *Clue Content / Text:* COMBINATION LOCK: [ _ ] [ _ ] [ _ ] [ _ ]

### Primary Puzzle Mechanics
- **Puzzle Type:** Ordering / Hidden Word
- **Input Mechanism:** `4-Letter Word Padlock`
- **Exact Correct Answer:** `VEIL`
- **Deduction Path:** Convert Roman publication dates or read publication years on the four displaced books: 1842 (MDCCCXLII) = V, 1889 (MDCCCLXXXIX) = E, 1914 (MCMXIV) = I, 1939 (MCMXXXIX) = L. Arranging them chronologically spells V-E-I-L.
- **Hidden Clue Function:** Explains Roman numeral translation and awards the Etched Brass Bookmark.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Check the librarian's mandate note. The four books must be arranged in chronological order by their publication dates.
2. **Tier 2 (Deductive Correlation):** Pay attention to the Roman numerals and years: 1842 comes first, followed by 1889, 1914, and 1939. Note the letter embossed on each book spine.
3. **Tier 3 (Direct Solution):** Arranging the books in chronological order gives the spine letters V, E, I, L. Enter 'VEIL' into the lockbox padlock.

**Level Completion Award:** `Etched Brass Bookmark & Library Vault Key`

<br>

## Room 05: Art Room — *"Gallery of the Grotesque"*
**Atmospheric Lore:** During the 1994 lockdown, third-year art students began carving terrifying cosmic geometries and blindfolded faces into wet clay until their hands bled. The room still reeks of linseed oil, turpentine, and old copper.

**Visual Aesthetics:** Eerie plaster busts with gouged-out eyes stare from splintered easels. A single directional lamp casts harsh, jagged noir shadows across a gallery wall covered in bizarre charcoal sketches. Smashed ceramic limbs litter the floor.

### Interactive Hotspots & Clue Placements
- **`wall_sketches` — Charcoal Wall Sketches & Symbols**:
  - *Visual Description:* Four distinct occult sketches on the north wall labeled with collegiate glyphs.
  - *Clue Content / Text:* Sketch 1: Dripping crescent moon [MOON / ☾]
Sketch 2: Weeping punctured eye [EYE / ◉]
Sketch 3: Coiled double-headed serpent [SERPENT / 🐍]
Sketch 4: Hourglass with bone dust [HOURGLASS / ⧖]
- **`shadow_pedestals` — Spotlight & Cast Shadows**:
  - *Visual Description:* A directional spotlight illuminates four rotated plaster figures on stands, casting four distinct silhouette outlines across the back gallery wall in left-to-right order.
  - *Clue Content / Text:* SHADOW PROJECTION (LEFT TO RIGHT):
Position 1: Coiled serpent silhouette
Position 2: Crescent moon silhouette
Position 3: Hourglass silhouette
Position 4: Weeping eye silhouette
- **`plaster_bust_hollow` — Hollow Plaster Sculpture Bust** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* An agonized, screaming plaster bust sitting on the back studio bench with a cracked neck joint.
  - *PDF Log Mapping:* `Hidden inside an old hollowed-out plaster sculpture bust`
  - *Discovery Text:* Reaching inside the hollowed-out neck cavity of the screaming bust, your fingers retrieve a rolled sketch: "The shadow sequence on the back wall reveals the path: 1: Serpent, 2: Moon, 3: Hourglass, 4: Eye (S-M-H-E)." You also pull out an Ivory Palette Knife.
  - *Item Yielded:* `Ivory Palette Knife`
  - *Clue Yielded:* Confirms the shadow symbol sequence: SERPENT, MOON, HOURGLASS, EYE.
- **`gallery_glyph_door` — Stone Door Glyph Receptors**:
  - *Visual Description:* A heavy stone door flanked by four rotating circular dials depicting the four collegiate symbols.
  - *Clue Content / Text:* GLYPH SLOTS: [ GLYPH 1 ] - [ GLYPH 2 ] - [ GLYPH 3 ] - [ GLYPH 4 ]

### Primary Puzzle Mechanics
- **Puzzle Type:** Visual Recognition / Symbol Matching
- **Input Mechanism:** `4-Symbol Rotating Dial Panel (or Sequence SERPENT-MOON-HOURGLASS-EYE)`
- **Exact Correct Answer:** `SERPENT - MOON - HOURGLASS - EYE`
- **Deduction Path:** Match each cast shadow silhouette from left to right against the charcoal sketches on the north wall. The shadow outlines form: 1. Serpent, 2. Moon, 3. Hourglass, 4. Eye. Dialing this sequence unlocks the door.
- **Hidden Clue Function:** Inside the hollow bust, the artist confirmed the exact symbol names and awarded the Ivory Palette Knife.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Look at the four distinct silhouettes cast by the spotlight onto the rear wall. Compare each outline to the charcoal wall sketches.
2. **Tier 2 (Deductive Correlation):** Follow the shadows in order from left to right: first is the snake shape, followed by the crescent curve, the pinched glass shape, and the oval eye shape.
3. **Tier 3 (Direct Solution):** The sequence from left to right is Serpent, Moon, Hourglass, Eye. Rotate the four glyph dials to match.

**Level Completion Award:** `Ivory Palette Knife & Corridor Door Unlock`

<br>

## Room 06: Staff Office — *"The Dean's Dissection"*
**Atmospheric Lore:** Dean Sterling's private office was the inner sanctum of the administration. When the campus was evacuated in 1994, Sterling frantically shredded his field journals and locked himself inside the fireproof vault; when rescuers arrived days later, only his shredded coat remained.

**Visual Aesthetics:** Crimson Venetian blinds cast razor-thin bars of crimson moonlight across an upturned mahogany desk. Loose paper flutters in the chill air, while shattered whiskey bottles and a tipped-over coat rack form an obstacle course of debris.

### Interactive Hotspots & Clue Placements
- **`torn_paper_fragments` — Scattered Paper Fragments**:
  - *Visual Description:* Shredded document strips scattered across the leather desk blotter.
  - *Clue Content / Text:* RECONSTRUCTED NOTE: "URGENT SECURITY NOTICE: Subject 73 has infiltrated faculty ranks under academic cover. The compromised personnel photograph on the faculty board is marked with a RED WAX SEAL. Do not allow him near the vaults."
- **`faculty_directory_board` — Faculty Portrait Directory Board**:
  - *Visual Description:* A framed corkboard displaying six faculty headshots with nameplates and pushpins.
  - *Clue Content / Text:* Portraits:
- Dr. Aris (Botany) [Blue pin]
- Prof. Crowley (Philology) [Green pin]
- Dean Sterling (Administration) [Black pin]
- Dr. Julian Mercer (Quantum Biology) [STAMPED WITH RED WAX SEAL]
- Nurse Ratcliffe (Infirmary) [Yellow pin]
- Officer Thorne (Campus Police) [White pin]
- **`filing_cabinet_back` — Vertical Filing Cabinet Back Panel** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* The heavy steel filing cabinet has been shoved against the corner wall.
  - *PDF Log Mapping:* `Stuck to the back panel of the vertical filing cabinet`
  - *Discovery Text:* Squeezing behind the filing cabinet, you find a manila envelope taped to the back panel: "Group the fragments with care. Target is Dr. Mercer, Employee ID: #615. Red wax seal confirms contamination." Inside is Dr. Mercer's dossier and a Small Steel Key.
  - *Item Yielded:* `Small Steel Key`
  - *Clue Yielded:* Identifies target as Dr. Mercer and reveals his clearance ID: 615.
- **`dean_wall_safe` — Fireproof Wall Safe**:
  - *Visual Description:* A digital steel safe built into the wall behind the Dean's portrait requiring the target subject's Clearance ID.
  - *Clue Content / Text:* SAFE INPUT: ENTER TARGET CLEARANCE ID [ _ _ _ ]

### Primary Puzzle Mechanics
- **Puzzle Type:** Fragment Assembly & Visual Identification
- **Input Mechanism:** `3-Digit Clearance PIN (or Target Name MERCER)`
- **Exact Correct Answer:** `615`
- **Deduction Path:** Assemble the torn memo strips to read the directive: the compromised individual's photo has a RED WAX SEAL. Inspect the directory board: Dr. Julian Mercer's portrait bears the seal. The hidden file behind the cabinet provides his Clearance ID: 615.
- **Hidden Clue Function:** Directly provides Dr. Mercer's 3-digit clearance code (615) and the Small Steel Key.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Piece together the torn paper fragments on the desk blotter to learn how the compromised faculty member was marked.
2. **Tier 2 (Deductive Correlation):** Group the fragments with matching edges. The note warns to look for a 'RED WAX SEAL' on the faculty directory board.
3. **Tier 3 (Direct Solution):** Dr. Julian Mercer has the red wax seal on his photograph. His clearance ID from the personnel file behind the cabinet is 615. Enter '615'.

**Level Completion Award:** `Small Steel Key & Personnel File #615`

<br>

## Room 07: Examination Room — *"The Silent Trial"*
**Atmospheric Lore:** In this windowless concrete bunker, dozens of empty examination desks sit arranged in perfect, unnerving geometric symmetry. On October 28, 1994, students were midway through their finals when the lockdown sirens wailed and neurotoxic suppressant gas seeped into the vents.

**Visual Aesthetics:** Cold industrial fluorescent lights flicker with an agonizing high-pitched buzz. Desks bear yellowed exam booklets covered in frantic calculations that devolve into manic repetitive scratches. A solitary wooden teacher's podium looms at the front of the hall like a gallows.

### Interactive Hotspots & Clue Placements
- **`exam_sheet` — Comprehensive Logic Exam Sheet**:
  - *Visual Description:* A printed Fall 1994 exam sheet with red instructor annotations.
  - *Clue Content / Text:* EXAM QUESTION 12: "Emergency ventilation override password encoded below. Apply the Proctor's Rule: 'Retreat three steps into the past (Caesar Shift: -3)'.
CIPHERTEXT: SXUJH"
- **`student_desks` — Carved Alphabetic Reference Desks**:
  - *Visual Description:* The front desks have alphabet strips carved into the varnish for student reference.
  - *Clue Content / Text:* A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
- **`podium_underside` — Underside of Examination Podium** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* Peering beneath the raised wooden lectern podium reveals a taped card.
  - *PDF Log Mapping:* `Flipped over and taped to the underside of the examination podium`
  - *Discovery Text:* Taped to the underside of the podium is a laminated cheat card: "Shift each letter backward by 3: S->P, X->U, U->R, J->G, H->E. Override word is PURGE." Taped beside it is a working UV Penlight.
  - *Item Yielded:* `UV Penlight`
  - *Clue Yielded:* Explicit shift table and decoded override word PURGE.
- **`ventilation_override_panel` — Blast Hatch Ventilation Override**:
  - *Visual Description:* An airtight emergency hatch console requiring the 5-letter override word.
  - *Clue Content / Text:* OVERRIDE CODE: [ _ ] [ _ ] [ _ ] [ _ ] [ _ ]

### Primary Puzzle Mechanics
- **Puzzle Type:** Simple Cipher (Caesar Shift -3)
- **Input Mechanism:** `5-Letter Word Entry`
- **Exact Correct Answer:** `PURGE`
- **Deduction Path:** Apply the Caesar shift of -3 to each letter of ciphertext SXUJH: S(-3)=P, X(-3)=U, U(-3)=R, J(-3)=G, H(-3)=E. The resulting word is PURGE.
- **Hidden Clue Function:** Confirms the -3 backward shift calculation, gives the UV Penlight essential for Room 08.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Read the instruction on the exam sheet: you must shift each letter of the ciphertext backward by 3 alphabet positions.
2. **Tier 2 (Deductive Correlation):** Shift each letter backward by 3: S becomes P, X becomes U, and so on.
3. **Tier 3 (Direct Solution):** SXUJH shifted backward by 3 positions gives P-U-R-G-E. Enter 'PURGE' into the hatch override console.

**Level Completion Award:** `UV Penlight & Ventilation Hatch Access`

<br>

## Room 08: Sealed Corridor — *"The Final Threshold"*
**Atmospheric Lore:** The nexus between the old humanities wing and the classified subterranean laboratory. Heavy blast doors slammed shut 32 years ago, sealing whatever entity took over Blackwood Hall behind feet of reinforced lead and hydraulic deadbolts.

**Visual Aesthetics:** Darkroom crimson emergency beacons flash in slow, hypnotic rotations. Exposed conduit sparks violently from the ceiling, hissing steam into the damp air. Warning stencils in flaking hazard-yellow read: "QUARANTINE LEVEL 4 - AUTHORIZED FACULTY ONLY".

### Interactive Hotspots & Clue Placements
- **`quarantine_console` — Master Bulkhead Console**:
  - *Visual Description:* A dual-terminal console guarding the reinforced subterranean blast doors.
  - *Clue Content / Text:* MISSION A BREACH CONSOLE:
FIELD 1: LOCKER COMBINATION (Room 02)
FIELD 2: EXAM CIPHER OVERRIDE (Room 07)
FIELD 3: REDACTED SUBJECT CLEARANCE ID (Room 06)
- **`emergency_electrical_box` — Emergency Electrical Box Panel** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* A rusted high-voltage breaker box beside the hydraulic door pistons.
  - *PDF Log Mapping:* `Scrawled in invisible UV ink inside the emergency electrical box panel`
  - *Discovery Text:* Switching on your UV Penlight inside the electrical box panel illuminates glowing green text: "Combine the sequence from across the wing: Locker [738] + Cipher [PURGE] + Subject [615]. Master Breach Key: 738-PURGE-615." Inside rests the Master Wing A Key.
  - *Item Yielded:* `Master Wing A Clearance Key`
  - *Clue Yielded:* Synthesizes all three components into the exact required format 738-PURGE-615.
- **`hydraulic_blast_door` — Heavy Subterranean Blast Door**:
  - *Visual Description:* A massive lead-lined blast door with three magnetic locking clamps.
  - *Clue Content / Text:* STATUS: 3 LOCKS ENGAGED. AWAITING CREDENTIAL SYNTHESIS.
- **`terminal_keyhole` — Brass & Steel Dual Keyhole**:
  - *Visual Description:* Two mechanical key slots requiring the Brass Skeleton Key (Room 01) and Small Steel Key (Room 06).
  - *Clue Content / Text:* DUAL MECHANICAL INTERLOCK: READY FOR KEYS.

### Primary Puzzle Mechanics
- **Puzzle Type:** Multi-Clue Deduction / Credential Synthesis
- **Input Mechanism:** `Synthesized Code Entry & Keycard Authentication`
- **Exact Correct Answer:** `738-PURGE-615`
- **Deduction Path:** Combine the locker combination from Room 02 (738), the decoded cipher from Room 07 (PURGE), and Dr. Mercer's clearance ID from Room 06 (615). Formatted as 738-PURGE-615, verified by the hidden UV ink inscription.
- **Hidden Clue Function:** The UV ink inscription reveals the exact master synthesis format (738-PURGE-615) and awards the Master Wing A Clearance Key.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** The final console requires three core deductions made during your journey through the Forgotten Wing.
2. **Tier 2 (Deductive Correlation):** Combine the sequence from your notebook: Locker 204 combination (Room 02), the exam room cipher (Room 07), and Dr. Mercer's ID (Room 06).
3. **Tier 3 (Direct Solution):** Enter the synthesized code '738-PURGE-615' into the console to release all hydraulic deadbolts.

**Level Completion Award:** `Mission A Complete! Access to Mission B: Project Zero`

<br>

---
# PROJECT ZERO — SCIENCE & INTELLIGENCE
**Wing Theme & Aesthetics:** Subterranean 1990s Government/Collegiate Bio-Physics Research Facility. Sterile chrome stained with toxic fluorescent bioluminescence, cracked glass cryo-chambers, buzzing cathode-ray tubes, Geiger counters, heavy high-voltage cables, amber monochrome terminals, containment vaults.

## Room 01: Science Block — *"The Specimen Quarantine"*
**Atmospheric Lore:** In the prep wing of the advanced sciences building, autopsies and mutagenic tissue tests were carried out behind thick lead-glass partitions. When containment failed, living tissue samples fused with the ventilation systems, leaving dried ichor dripping from the ceiling.

**Visual Aesthetics:** Smashed glass and shattered petri dishes cover stainless steel autopsy tables. A broken amber emergency lantern casts long shadows over cracked tile walls. The pungent stench of formaldehyde and ozone suffocates the room.

### Interactive Hotspots & Clue Placements
- **`lab_safety_poster` — Stained Lab Safety Poster**:
  - *Visual Description:* A blood-spattered wall chart showing silhouettes of standard laboratory equipment paired with index digits.
  - *Clue Content / Text:* LAB EQUIPMENT IDENTIFIER:
[ Silhouette 1: Bunsen Burner ] = 1
[ Silhouette 2: 500ml Graduated Beaker ] = 4
[ Silhouette 3: Ceramic Crucible & Pestle ] = 2
[ Silhouette 4: Erlenmeyer Flask ] = 9
- **`prep_shelf_beaker` — Sealed Glass Beaker on Prep Shelf** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* A murky sealed 1000ml glass beaker sitting behind dusty chemical jars.
  - *PDF Log Mapping:* `Inside a sealed glass beaker on the back preparation shelf`
  - *Discovery Text:* Prying the rubber stopper off the sealed glass beaker on the back shelf, you retrieve a preserved tag: "EQUIPMENT CALIBRATION ORDER: Thermal tolerance sequence: 1. Bunsen Burner, 2. Beaker, 3. Crucible, 4. Flask. Code is 1-4-2-9." You also find Insulated Lab Tongs.
  - *Item Yielded:* `Insulated Lab Tongs`
  - *Clue Yielded:* Gives the exact sequence order: Burner -> Beaker -> Crucible -> Flask (1-4-2-9).
- **`equipment_sorting_bench` — Apparatus Silhouette Tray**:
  - *Visual Description:* A stainless steel tray on the counter with 4 indented silhouette slots corresponding to Burner, Beaker, Crucible, and Flask.
  - *Clue Content / Text:* TRAY INDENTS: [ Burner ] - [ Beaker ] - [ Crucible ] - [ Flask ]
- **`reagent_cabinet_keypad` — Locked Reagent Cabinet**:
  - *Visual Description:* A heavy glass-fronted reagent cabinet guarded by a 4-digit numeric keypad.
  - *Clue Content / Text:* CABINET LOCK: ENTER 4-DIGIT CALIBRATION CODE

### Primary Puzzle Mechanics
- **Puzzle Type:** Object Matching / Silhouette Decoding
- **Input Mechanism:** `4-Digit Digital Keypad Code`
- **Exact Correct Answer:** `1429`
- **Deduction Path:** Match each piece of physical apparatus to its silhouette on the safety poster: Bunsen Burner = 1, Beaker = 4, Crucible = 2, Flask = 9. The prep shelf note confirms the order Burner -> Beaker -> Crucible -> Flask, yielding 1429.
- **Hidden Clue Function:** Establishes the sequence order and provides the Insulated Lab Tongs.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Match each piece of lab equipment to its corresponding silhouette on the stained safety poster to find its digit.
2. **Tier 2 (Deductive Correlation):** Check the preparation guide found on the back shelf: the required equipment order is Bunsen Burner, Beaker, Crucible, and Flask.
3. **Tier 3 (Direct Solution):** Burner is 1, Beaker is 4, Crucible is 2, and Flask is 9. Enter '1429' into the reagent cabinet keypad.

**Level Completion Award:** `Insulated Lab Tongs & Reagent Cabinet Access`

<br>

## Room 02: Mathematics Room — *"The Fractal Asylum"*
**Atmospheric Lore:** Lead theoretical physicist Dr. Ronald Sterling spent three sleepless weeks before the incident covering every surface of this classroom with chaotic recursive equations, claiming the Fibonacci series held the heartbeat of a trans-dimensional entity.

**Visual Aesthetics:** Floor-to-ceiling green slate blackboards are filled with dizzying, frantic geometric spirals and blood-smeared numbers. Desks have been overturned and pushed against the walls in a defensive barricade. A broken ceiling fan rotates sluggishly with a sickening squeak.

### Interactive Hotspots & Clue Placements
- **`wall_whiteboard` — Sliding Whiteboard Sequence**:
  - *Visual Description:* A wall-mounted whiteboard with a prominent recursive series written in bold green dry-erase marker.
  - *Clue Content / Text:* SERIES: 2,  3,  5,  8,  13,  21,  34,  [ ? ]
NOTE: "Each generation consumes the sum of the two before it..."
- **`teacher_notes` — Teacher's Handwritten Calculations**:
  - *Visual Description:* Scattered calculation sheets on the front desk demonstrating recursive summation.
  - *Clue Content / Text:* Calculations:
2 + 3 = 5
3 + 5 = 8
5 + 8 = 13
8 + 13 = 21
13 + 21 = 34
21 + 34 = [ VALUE ]
- **`sliding_whiteboard_rear` — Behind Sliding Wall-Mounted Whiteboard** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* Sliding the central whiteboard to the far left reveals the hidden brick recess behind it.
  - *PDF Log Mapping:* `Taped behind the sliding wall-mounted whiteboard`
  - *Discovery Text:* Taped behind the sliding whiteboard is a frantic note: "The convergence term is 55 (21 + 34 = 55). Enter 55 into the security box to recover the magnet." Stuck to the note with electrical tape is a Heavy Neodymium Magnet.
  - *Item Yielded:* `Heavy Neodymium Magnet`
  - *Clue Yielded:* Solves the sequence calculation: 21 + 34 = 55.
- **`math_security_box` — Podium Security Box**:
  - *Visual Description:* A 2-digit digital push-button lock securing the teacher's podium compartment.
  - *Clue Content / Text:* NEXT TERM: [ _ _ ]

### Primary Puzzle Mechanics
- **Puzzle Type:** Number Sequence / Recursive Progression
- **Input Mechanism:** `2-Digit Digital Lock`
- **Exact Correct Answer:** `55`
- **Deduction Path:** Observe that each term in the sequence is the sum of the preceding two terms (Fibonacci rule: 2+3=5, 3+5=8, ..., 13+21=34). The next term is 21 + 34 = 55.
- **Hidden Clue Function:** Directly confirms the answer 55 and awards the Heavy Neodymium Magnet.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Look at how each number in the sequence relates to the two numbers immediately preceding it.
2. **Tier 2 (Deductive Correlation):** Add the two consecutive numbers: 8+13=21, 13+21=34. What is 21 + 34?
3. **Tier 3 (Direct Solution):** 21 + 34 = 55. Enter '55' into the podium security box.

**Level Completion Award:** `Heavy Neodymium Magnet & Podium Drawer Access`

<br>

## Room 03: Chemistry Lab — *"The Elemental Tomb"*
**Atmospheric Lore:** In 1994, researchers here attempted to synthesize an artificial organic compound to stabilize the anomaly. An unexpected catalytic reaction melted the safety glass, boiling the flesh off three research assistants before the airtight containment doors slammed shut.

**Visual Aesthetics:** Sallow toxic yellow fumes still swirl slowly inside sealed glass containment chambers. Acid burns eat deep craters into the black granite benchtops. A vintage illuminated Periodic Table of Elements hangs on the far wall, buzzing with an eerie cyan glow.

### Interactive Hotspots & Clue Placements
- **`periodic_table_wall` — Illuminated Periodic Table Chart**:
  - *Visual Description:* A large backlit wall chart listing element names, symbols, and atomic numbers.
  - *Clue Content / Text:* ELEMENT LOOKUP:
Carbon (C) -> Atomic Number: 6
Nitrogen (N) -> Atomic Number: 7
Oxygen (O) -> Atomic Number: 8
Fluorine (F) -> Atomic Number: 9
- **`specimen_cabinet_label` — Specimen Cabinet Elemental Formula**:
  - *Visual Description:* A locked reinforced steel cabinet containing a biohazard specimen jar. A brass plaque lists the unlock formula.
  - *Clue Content / Text:* CABINET ACCESS: Enter the 4-digit atomic number sequence for the organic synthesis chain: [ C ] - [ N ] - [ O ] - [ F ]
- **`fume_hood_drain` — Fume Hood Sink Drain Underside** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* Crouching beneath the chemical fume hood reveals acid-etched lettering on the lead trap pipe.
  - *PDF Log Mapping:* `Engraved on the metal underside of the fume hood sink drain`
  - *Discovery Text:* Engraved into the metal curve of the drainpipe is: "Cross-reference atomic numbers: C=6, N=7, O=8, F=9 -> Cabinet Code: 6789." Behind the pipe sits a sealed Glass Vial of Stabilizing Enzyme.
  - *Item Yielded:* `Stabilizing Enzyme Vial`
  - *Clue Yielded:* Explicit atomic number mapping: 6-7-8-9.
- **`specimen_keypad` — Specimen Cabinet Digital Keypad**:
  - *Visual Description:* A 4-digit keypad securing the magnetic lock on the cryo-specimen cabinet.
  - *Clue Content / Text:* INPUT: [ _ _ _ _ ]

### Primary Puzzle Mechanics
- **Puzzle Type:** Reference-Based Science / Periodic Table Cross-Referencing
- **Input Mechanism:** `4-Digit Digital Keypad Code`
- **Exact Correct Answer:** `6789`
- **Deduction Path:** Locate the elements from the cabinet plaque (C, N, O, F) on the illuminated Periodic Table. Record their atomic numbers in order: Carbon (6), Nitrogen (7), Oxygen (8), Fluorine (9). The PIN is 6789.
- **Hidden Clue Function:** Explains atomic number lookup, confirms 6789, and awards the Stabilizing Enzyme Vial.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Look at the four chemical element symbols on the specimen cabinet plaque: C, N, O, and F.
2. **Tier 2 (Deductive Correlation):** Cross-reference the atomic numbers for Carbon (C), Nitrogen (N), Oxygen (O), and Fluorine (F) on the periodic table chart.
3. **Tier 3 (Direct Solution):** Carbon is 6, Nitrogen is 7, Oxygen is 8, and Fluorine is 9. Enter '6789' into the cabinet keypad.

**Level Completion Award:** `Stabilizing Enzyme Vial & Unlocked Cryo-Specimen Cabinet`

<br>

## Room 04: Computer Lab — *"The Silicon Crypt"*
**Atmospheric Lore:** Row after row of bulky 1990s IBM-style CRT monitors hum with static electricity, displaying garbled green code. During the final moments of the blackout, the mainframe operator tried to send an SOS via punch-card binary before the power cables melted around his chair.

**Visual Aesthetics:** Eerie green phosphor glow from monochrome monitors bathes dust motes in sickly light. Ribbons of perforated paper tape and open computer chassis with tangled ribbon cables cover beige formica tables. A cold breeze whispers from the raised floor server plenum.

### Interactive Hotspots & Clue Placements
- **`terminal_crt` — Mainframe CRT Terminal Screen**:
  - *Visual Description:* A green phosphor monitor displaying an active password override prompt.
  - *Clue Content / Text:* PROJECT ZERO MAINFRAME OS v3.2
ENCRYPTED PASSWORD PACKET:
01011010   01000101   01010010   01001111
ENTER 4-LETTER DECODED PASSWORD: > _
- **`binary_reference_card` — Laminated Binary Reference Card**:
  - *Visual Description:* A yellowed 8-bit ASCII lookup chart taped next to the keyboard.
  - *Clue Content / Text:* ASCII 8-BIT BINARY TABLE:
01000001 = A
01000101 = E
01001111 = O
01010010 = R
01010100 = T
01011010 = Z
- **`computer_tower_interior` — Inside Computer Tower Casing** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* The side panel of the central desktop PC tower has been removed, exposing the motherboards.
  - *PDF Log Mapping:* `Written on a sticky note stuck inside the computer tower casing`
  - *Discovery Text:* Stuck inside the computer tower chassis is a faded yellow sticky note: "Group the binary digits into 8-bit bytes: 01011010(Z) 01000101(E) 01010010(R) 01001111(O). Password is ZERO." An Encrypted Magnetic Tape Drive is plugged into the drive bay.
  - *Item Yielded:* `Encrypted Magnetic Tape Drive`
  - *Clue Yielded:* Solves the binary translation directly: ZERO.
- **`terminal_keyboard` — Mechanical Terminal Keyboard**:
  - *Visual Description:* A chunky clicky mechanical keyboard awaiting the 4-letter override password.
  - *Clue Content / Text:* READY FOR INPUT

### Primary Puzzle Mechanics
- **Puzzle Type:** Binary Decoding / ASCII Conversion
- **Input Mechanism:** `4-Letter Terminal Command Entry`
- **Exact Correct Answer:** `ZERO`
- **Deduction Path:** Group the binary message into four 8-bit bytes: 01011010, 01000101, 01010010, 01001111. Cross-reference each with the ASCII lookup card: 01011010=Z, 01000101=E, 01010010=R, 01001111=O. The terminal password is ZERO.
- **Hidden Clue Function:** Explains grouping binary into 8-bit bytes, confirms the password ZERO, and yields the Encrypted Magnetic Tape Drive.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** The binary message on the terminal is separated into four distinct 8-digit bytes.
2. **Tier 2 (Deductive Correlation):** Group the binary digits into bytes of 8 and look up each byte on the laminated ASCII reference card.
3. **Tier 3 (Direct Solution):** 01011010 is Z, 01000101 is E, 01010010 is R, and 01001111 is O. Type 'ZERO' into the terminal prompt.

**Level Completion Award:** `Encrypted Magnetic Tape Drive & Mainframe Access`

<br>

## Room 05: Optics Room — *"The Prismatic Void"*
**Atmospheric Lore:** Laser spectroscopy was used here to scan the microscopic structure of the extradimensional matter. In the dark, refracted crimson beams cast phantom geometries across the ceiling that observers swore whispered to them.

**Visual Aesthetics:** Pitch-black laboratory illuminated only by a piercing, razor-thin crimson laser beam reflecting off mirrors. Heavy blackout curtains seal all windows. Dust particles float in the beam like suspended fireflies.

### Interactive Hotspots & Clue Placements
- **`laser_emitter` — Continuous Ruby Laser Emitter**:
  - *Visual Description:* A heavy brass emitter firing a straight ruby red beam East across the optical table.
  - *Clue Content / Text:* LASER BENCH: ALIGN ROTATABLE PRISM MIRRORS TO STRIKE TARGET SENSOR.
- **`mirrors_pedestal` — Three Rotatable Mirrors (A, B, C)**:
  - *Visual Description:* Three mirrors on rotary vernier dials marked in standard deflection degrees (0°, 45°, 90°, 135°, 180°).
  - *Clue Content / Text:* Mirror A: Receives East beam, deflects South
Mirror B: Receives South beam, deflects East
Mirror C: Receives East beam, deflects North to Sensor
- **`sliding_lens_cover` — Optical Bench Sliding Lens Cover** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* A brass protective shield sliding over the collimator lens array.
  - *PDF Log Mapping:* `Concealed behind the sliding lens cover of the optical bench`
  - *Discovery Text:* Sliding back the metal lens cover reveals an engineer's engraved schematic: "Trace the beam backwards from the door sensor. Mirror A = 45°, Mirror B = 135°, Mirror C = 45°. Deflection brings the light home." An Optical Ruby Prism sits inside the housing.
  - *Item Yielded:* `Optical Ruby Prism`
  - *Clue Yielded:* Gives the exact angles for all three mirrors: 45° - 135° - 45°.
- **`photocell_sensor` — Photodiode Door Sensor**:
  - *Visual Description:* A photosensitive receptor mounted beside the magnetic door lock. When struck by the red beam, the circuit energizes.
  - *Clue Content / Text:* SENSOR STATUS: AWAITING PHOTON BEAM

### Primary Puzzle Mechanics
- **Puzzle Type:** Spatial / Light Deflection Puzzle
- **Input Mechanism:** `3-Mirror Angle Dial Settings (45° - 135° - 45°)`
- **Exact Correct Answer:** `45-135-45`
- **Deduction Path:** Trace the required beam path from Emitter -> Mirror A -> Mirror B -> Mirror C -> Sensor. Mirror A must deflect an East beam South (45°). Mirror B must deflect a South beam East (135°). Mirror C must deflect an East beam North into the photodiode (45°).
- **Hidden Clue Function:** Advises tracing the beam backwards from the sensor, confirms angles 45°-135°-45°, and yields the Optical Ruby Prism.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Rotate the three mirrors so the laser beam travels around the obstacles and hits the round photodiode sensor on the exit door.
2. **Tier 2 (Deductive Correlation):** Trace the beam backwards from the door sensor to see which 90-degree turn each mirror needs to produce.
3. **Tier 3 (Direct Solution):** Set Mirror A to 45°, Mirror B to 135°, and Mirror C to 45°. The beam will strike the sensor and trigger the magnetic lock.

**Level Completion Award:** `Optical Ruby Prism & Unlocked Optics Lab Exit`

<br>

## Room 06: Electrical Lab — *"The High-Voltage Chasm"*
**Atmospheric Lore:** When the substation exploded, 10,000 volts surged through the grounding grid, electrocuting the maintenance crew instantly. Their scorched outlines are permanently burned into the cinderblock wall behind the main breaker.

**Visual Aesthetics:** Thick rubber cables snake across flooded concrete floors. Giant step-down transformers hum with an ominous low B-flat buzz. Blue electrical arcs intermittently crackle across broken ceramic insulators overhead.

### Interactive Hotspots & Clue Placements
- **`circuit_schematic` — Substation Emergency Blueprint**:
  - *Visual Description:* A faded technical drawing illustrating the 5-bus breaker architecture.
  - *Clue Content / Text:* EMERGENCY BUS LOGIC:
Bus 1: Main Generator Feed (Required: ON)
Bus 2: Secondary Capacitor (DAMAGED COIL: MUST REMAIN OFF)
Bus 3: Isolation Relay (Required: ON)
Bus 4: Ground Fault Bypass (FAULT ACTIVE: MUST REMAIN OFF)
Bus 5: Cryo-Turbine Circuit (Required: ON)
- **`warning_hatch_breaker` — Warning Hatch of Breaker Panel Box** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* A hinged yellow hazard warning hatch on the side of the 480V breaker box.
  - *PDF Log Mapping:* `Sealed behind the warning hatch of the breaker panel box`
  - *Discovery Text:* Prying open the sealed warning hatch reveals an electrician's emergency tag: "Ensure the ground wire bypasses lines 2 & 4! Toggle: 1=ON, 2=OFF, 3=ON, 4=OFF, 5=ON (10101). Restores power without fatal arc flash." Hanging inside is a Heavy Ceramic Fuse.
  - *Item Yielded:* `Heavy Ceramic Fuse`
  - *Clue Yielded:* Explicit switch positions: ON, OFF, ON, OFF, ON (10101).
- **`knife_switch_bank` — Bank of 5 Heavy Knife Switches**:
  - *Visual Description:* Five large industrial copper knife switches numbered 1 through 5 with UP (ON) and DOWN (OFF) states.
  - *Clue Content / Text:* SWITCH STATUS: [ 1: DOWN ] [ 2: DOWN ] [ 3: DOWN ] [ 4: DOWN ] [ 5: DOWN ]
- **`voltmeter_gauge` — Substation Voltmeter Gauge**:
  - *Visual Description:* An analog needle gauge monitoring main bus voltage. Rises into the green zone when correct switches are thrown.
  - *Clue Content / Text:* VOLTAGE: 0 V (DEAD)

### Primary Puzzle Mechanics
- **Puzzle Type:** Circuit Logic / Binary Switch Configuration
- **Input Mechanism:** `5-Switch Toggle Bank (ON/OFF)`
- **Exact Correct Answer:** `ON - OFF - ON - OFF - ON`
- **Deduction Path:** Examine the substation schematic to avoid short circuits. Bus 2 (damaged capacitor) and Bus 4 (ground fault) must stay OFF. Bus 1, 3, and 5 must be turned ON. Setting switches to ON-OFF-ON-OFF-ON (10101) restores power safely.
- **Hidden Clue Function:** Explains grounding wire bypass, confirms sequence 1-0-1-0-1, and awards the Heavy Ceramic Fuse.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Consult the blueprint to see which switches feed power and which are connected to damaged lines.
2. **Tier 2 (Deductive Correlation):** Ensure the ground wire bypasses circuits 2 and 4. Only switches 1, 3, and 5 should be engaged.
3. **Tier 3 (Direct Solution):** Flip Switch 1 to ON, Switch 2 to OFF, Switch 3 to ON, Switch 4 to OFF, and Switch 5 to ON (ON-OFF-ON-OFF-ON).

**Level Completion Award:** `Heavy Ceramic Fuse & Facility Power Restoration`

<br>

## Room 07: Storage Room — *"The Weight of the Dead"*
**Atmospheric Lore:** Radioactive isotopes and anomalous chemical waste were secretly stashed here in lead-lined drums. During the frantic evacuation, a technician hid the master cryogenic release fuse inside one of four identical lead containers before dying of acute radiation poisoning.

**Visual Aesthetics:** Rows of rusted industrial shelving sag under the weight of decaying wooden crates and dented barrels labeled with flaking trefoil radiation warnings. A vintage dual-pan mechanical balance scale sits atop an iron workbench.

### Interactive Hotspots & Clue Placements
- **`balance_scale` — Mechanical Dual-Pan Balance Scale**:
  - *Visual Description:* A calibrated brass mechanical balance scale with left and right pans for comparing container weights.
  - *Clue Content / Text:* SCALE READINGS:
Canister A vs Canister B -> PERFECT BALANCE (Both 100g)
Canister A + B vs Canister C + D -> TIPS HEAVILY TO RIGHT
Canister C vs Canister D -> TIPS HEAVILY DOWN ON C (C is 150g, D is 100g)
- **`four_lead_canisters` — Four Identical Lead Canisters (A, B, C, D)**:
  - *Visual Description:* Four heavy cylindrical lead containers with twist-off sealing caps.
  - *Clue Content / Text:* CANISTERS: Canister A, Canister B, Canister C, Canister D
- **`textbook_dummy_shelf` — Hollowed-Out Textbook Dummy on Bottom Shelf** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* A thick volume of "Advanced Nuclear Geometries (1989)" resting on the lowest metal shelf.
  - *PDF Log Mapping:* `Hidden inside a hollowed-out textbook dummy on the bottom shelf`
  - *Discovery Text:* Opening the hollowed-out textbook dummy on the bottom shelf reveals a radiation tech's note: "Balance the known weights. Three containers are empty lead decoys (100g each). Canister C holds the dense master fuse (150g). Select C." A Lead-Lined Handling Glove is inside.
  - *Item Yielded:* `Lead-Lined Handling Glove`
  - *Clue Yielded:* Directly confirms Canister C as the heavy anomalous container holding the fuse.
- **`canister_decoupler` — Canister Decoupler Press**:
  - *Visual Description:* A hydraulic press on the counter designed to crack open the chosen canister.
  - *Clue Content / Text:* SELECTION: INSERT TARGET CANISTER (A, B, C, or D)

### Primary Puzzle Mechanics
- **Puzzle Type:** Measurement / Deductive Weight Balance
- **Input Mechanism:** `Canister Selection (A, B, C, or D)`
- **Exact Correct Answer:** `Canister C`
- **Deduction Path:** Use the balance scale to isolate the anomalous heavy container. Weighing A vs B shows equal weight. Weighing C vs D reveals C is significantly heavier. Canister C contains the cryogenic release fuse.
- **Hidden Clue Function:** Explains balancing known weights, confirms Canister C, and yields the Lead-Lined Handling Glove and Cryogenic Master Fuse.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** Use the dual-pan balance scale to compare the weights of the four lead canisters (A, B, C, and D).
2. **Tier 2 (Deductive Correlation):** Balance the known weights against each other: three canisters weigh the same, but one is heavier because it contains the master fuse.
3. **Tier 3 (Direct Solution):** Canister C tips the scale down against all other canisters. Select Canister C to extract the fuse.

**Level Completion Award:** `Cryogenic Master Fuse & Lead-Lined Handling Glove`

<br>

## Room 08: Research Office — *"The Project Zero Vault"*
**Atmospheric Lore:** The subterranean nerve center where Project Zero reached its catastrophic culmination. In the center of the room stands a massive reinforced titanium cryogenic vault, inside which the anomalous specimen remains suspended at -200°C. If the stabilization protocol isn't engaged, the failsafe detonates the entire campus.

**Visual Aesthetics:** Frost and icicles coat the walls, pipes, and control panels. Pale blue cryogenic vapor cascades like a waterfall from the seams of the massive vault door. A bank of amber CRT mainframe screens flickers with urgent containment alerts: "CRITICAL SYSTEM FAULT — ENTER MISSION METRICS".

### Interactive Hotspots & Clue Placements
- **`master_control_console` — Project Zero Master Control Terminal**:
  - *Visual Description:* A curved steel control panel with amber monitors requiring the 4 primary operational parameters from Mission B.
  - *Clue Content / Text:* PROJECT ZERO CONTAINMENT INTERFACE:
METRIC 1: Science Prep Calibration Code (Room 01)
METRIC 2: Fractal Sequence Term (Room 02)
METRIC 3: Elemental Synthesis PIN (Room 03)
METRIC 4: Mainframe Password (Room 04)
HARDWARE: Cryogenic Master Fuse Insertion
- **`double_bottom_drawer` — Lead Researcher's Double-Bottom Desk Drawer** **[MANDATORY HIDDEN CLUE LOCATION]**:
  - *Visual Description:* Dr. Finch's steel executive desk. The right drawer has a spring-loaded false bottom.
  - *PDF Log Mapping:* `Locked inside the double-bottom drawer of the lead researcher's desk`
  - *Discovery Text:* Prying open the double-bottom drawer reveals Dr. Finch's final cassette and log: "Align the variables from the mission log: Prep Code [1429] - Math Term [55] - Chemistry PIN [6789] - Terminal Password [ZERO]. Insert the Cryogenic Master Fuse into the terminal cradle. God forgive what we built." You claim Dr. Finch's Golden Master Keycard.
  - *Item Yielded:* `Dr. Finch's Golden Master Keycard`
  - *Clue Yielded:* Synthesizes all four Mission B parameters: 1429-55-6789-ZERO.
- **`fuse_receptacle_cradle` — Cryogenic Fuse Insertion Receptacle**:
  - *Visual Description:* A high-voltage ceramic socket on the control console for inserting the master fuse.
  - *Clue Content / Text:* SOCKET STATUS: FUSE DISENGAGED (INSERT MASTER FUSE)
- **`cryogenic_vault_door` — Titanium Cryogenic Vault Door**:
  - *Visual Description:* The colossal circular blast vault locking the Project Zero specimen behind liquid nitrogen jets.
  - *Clue Content / Text:* CONTAINMENT VAULT: 6 HYDRAULIC DOGS ARMED

### Primary Puzzle Mechanics
- **Puzzle Type:** Multi-Step Deduction / Control Room Synthesis
- **Input Mechanism:** `Four-Parameter Terminal Input + Fuse Insertion`
- **Exact Correct Answer:** `1429-55-6789-ZERO`
- **Deduction Path:** Align the variables gathered across Mission B: Room 01 prep code (1429), Room 02 math sequence term (55), Room 03 periodic table PIN (6789), and Room 04 computer lab password (ZERO). Input 1429-55-6789-ZERO and insert the Cryogenic Master Fuse.
- **Hidden Clue Function:** Explains variable alignment, confirms 1429-55-6789-ZERO, and awards the Golden Master Keycard.

### Progressive 3-Tier Hint Structure
1. **Tier 1 (Subtle Nudge):** The master terminal requires you to enter the four primary solutions you discovered across the science wing in sequential order.
2. **Tier 2 (Deductive Correlation):** Align the variables from the mission log: Science Block code (Room 01), Math Room sequence (Room 02), Chemistry Lab PIN (Room 03), and Computer Lab password (Room 04).
3. **Tier 3 (Direct Solution):** Enter '1429-55-6789-ZERO' into the console and insert the Cryogenic Master Fuse into the cradle to open the vault and escape.

**Level Completion Award:** `Project Zero Anomaly Dossier & Complete Game Escape Victory!`

<br>
