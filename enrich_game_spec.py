import json

with open('horror_puzzle_design_spec.json', 'r', encoding='utf-8') as f:
    spec = json.load(f)

# Coordinate & icon mappings
HOTSPOT_META = {
    # Mission A
    "noticeboard": {"x": 82, "y": 34, "icon": "fa-thumbtack"},
    "register": {"x": 50, "y": 64, "icon": "fa-book"},
    "reception_drawer_base": {"x": 32, "y": 76, "icon": "fa-magnifying-glass"},
    "gate_keypad": {"x": 62, "y": 48, "icon": "fa-lock", "is_puzzle_trigger": True},

    "torn_timetable": {"x": 88, "y": 42, "icon": "fa-file-lines"},
    "locker_stickers": {"x": 18, "y": 35, "icon": "fa-note-sticky"},
    "middle_bench_underside": {"x": 48, "y": 82, "icon": "fa-magnifying-glass"},
    "locker_204_dial": {"x": 25, "y": 52, "icon": "fa-vault", "is_puzzle_trigger": True},

    "blackboard": {"x": 50, "y": 30, "icon": "fa-chalkboard"},
    "professor_notes": {"x": 68, "y": 70, "icon": "fa-folder-open"},
    "chalkboard_frame_hinge": {"x": 80, "y": 25, "icon": "fa-magnifying-glass"},
    "lectern_cylinder_lock": {"x": 48, "y": 65, "icon": "fa-lock", "is_puzzle_trigger": True},

    "librarian_note": {"x": 78, "y": 60, "icon": "fa-scroll"},
    "displaced_books": {"x": 30, "y": 42, "icon": "fa-book-skull"},
    "desk_leg_carving": {"x": 65, "y": 82, "icon": "fa-magnifying-glass"},
    "bookcase_vault_box": {"x": 22, "y": 70, "icon": "fa-box-archive", "is_puzzle_trigger": True},

    "wall_sketches": {"x": 22, "y": 35, "icon": "fa-palette"},
    "shadow_pedestals": {"x": 75, "y": 65, "icon": "fa-shapes"},
    "plaster_bust_hollow": {"x": 35, "y": 55, "icon": "fa-magnifying-glass"},
    "gallery_glyph_door": {"x": 50, "y": 50, "icon": "fa-door-closed", "is_puzzle_trigger": True},

    "torn_paper_fragments": {"x": 30, "y": 68, "icon": "fa-file-lines"},
    "faculty_directory_board": {"x": 78, "y": 32, "icon": "fa-clipboard-user"},
    "filing_cabinet_back": {"x": 85, "y": 62, "icon": "fa-magnifying-glass"},
    "dean_wall_safe": {"x": 18, "y": 42, "icon": "fa-vault", "is_puzzle_trigger": True},

    "exam_sheet": {"x": 32, "y": 65, "icon": "fa-file-signature"},
    "student_desks": {"x": 68, "y": 65, "icon": "fa-chair"},
    "podium_underside": {"x": 50, "y": 78, "icon": "fa-magnifying-glass"},
    "ventilation_override_panel": {"x": 82, "y": 30, "icon": "fa-wind", "is_puzzle_trigger": True},

    "quarantine_console": {"x": 50, "y": 52, "icon": "fa-terminal", "is_puzzle_trigger": True},
    "emergency_electrical_box": {"x": 18, "y": 48, "icon": "fa-magnifying-glass"},
    "hydraulic_blast_door": {"x": 82, "y": 50, "icon": "fa-dungeon"},
    "terminal_keyhole": {"x": 50, "y": 75, "icon": "fa-key"},

    # Mission B
    "lab_safety_poster": {"x": 22, "y": 32, "icon": "fa-triangle-exclamation"},
    "prep_shelf_beaker": {"x": 78, "y": 35, "icon": "fa-magnifying-glass"},
    "equipment_sorting_bench": {"x": 35, "y": 65, "icon": "fa-flask-vial"},
    "reagent_cabinet_keypad": {"x": 62, "y": 52, "icon": "fa-lock", "is_puzzle_trigger": True},

    "wall_whiteboard": {"x": 50, "y": 32, "icon": "fa-square-root-variable"},
    "teacher_notes": {"x": 25, "y": 68, "icon": "fa-pen-nib"},
    "sliding_whiteboard_rear": {"x": 75, "y": 28, "icon": "fa-magnifying-glass"},
    "math_security_box": {"x": 55, "y": 68, "icon": "fa-vault", "is_puzzle_trigger": True},

    "periodic_table_wall": {"x": 24, "y": 30, "icon": "fa-table-cells"},
    "specimen_cabinet_label": {"x": 75, "y": 50, "icon": "fa-biohazard"},
    "fume_hood_drain": {"x": 42, "y": 72, "icon": "fa-magnifying-glass"},
    "specimen_keypad": {"x": 78, "y": 70, "icon": "fa-lock", "is_puzzle_trigger": True},

    "terminal_crt": {"x": 50, "y": 48, "icon": "fa-desktop"},
    "binary_reference_card": {"x": 22, "y": 65, "icon": "fa-microchip"},
    "computer_tower_interior": {"x": 78, "y": 68, "icon": "fa-magnifying-glass"},
    "terminal_keyboard": {"x": 50, "y": 72, "icon": "fa-keyboard", "is_puzzle_trigger": True},

    "laser_emitter": {"x": 18, "y": 48, "icon": "fa-bolt"},
    "mirrors_pedestal": {"x": 50, "y": 55, "icon": "fa-ring"},
    "sliding_lens_cover": {"x": 34, "y": 72, "icon": "fa-magnifying-glass"},
    "photocell_sensor": {"x": 82, "y": 48, "icon": "fa-bullseye", "is_puzzle_trigger": True},

    "circuit_schematic": {"x": 22, "y": 35, "icon": "fa-diagram-project"},
    "warning_hatch_breaker": {"x": 45, "y": 25, "icon": "fa-magnifying-glass"},
    "knife_switch_bank": {"x": 50, "y": 62, "icon": "fa-toggle-on", "is_puzzle_trigger": True},
    "voltmeter_gauge": {"x": 80, "y": 45, "icon": "fa-gauge-high"},

    "balance_scale": {"x": 50, "y": 58, "icon": "fa-scale-balanced", "is_puzzle_trigger": True},
    "four_lead_canisters": {"x": 25, "y": 68, "icon": "fa-weight-hanging"},
    "textbook_dummy_shelf": {"x": 78, "y": 35, "icon": "fa-magnifying-glass"},
    "canister_decoupler": {"x": 75, "y": 68, "icon": "fa-screwdriver-wrench"},

    "master_control_console": {"x": 50, "y": 50, "icon": "fa-server", "is_puzzle_trigger": True},
    "double_bottom_drawer": {"x": 22, "y": 75, "icon": "fa-magnifying-glass"},
    "fuse_receptacle_cradle": {"x": 72, "y": 65, "icon": "fa-car-battery"},
    "cryogenic_vault_door": {"x": 82, "y": 35, "icon": "fa-snowflake"}
}

# Scene template mapping for each room
SCENE_MAPPING = {
    "room_a_01_reception": "reception",
    "room_a_02_locker_row": "lockers",
    "room_a_03_lecture_hall": "lecture_hall",
    "room_a_04_library": "library",
    "room_a_05_art_room": "art_room",
    "room_a_06_staff_office": "office",
    "room_a_07_examination_room": "exam_room",
    "room_a_08_sealed_corridor": "corridor",

    "room_b_01_science_block": "science_block",
    "room_b_02_mathematics_room": "math_room",
    "room_b_03_chemistry_lab": "chemistry_lab",
    "room_b_04_computer_lab": "computer_lab",
    "room_b_05_optics_room": "optics_room",
    "room_b_06_electrical_lab": "electrical_lab",
    "room_b_07_storage_room": "storage_room",
    "room_b_08_research_office": "research_vault"
}

# Attach coordinates and meta to hotspots
for mid in ["MISSION_A", "MISSION_B"]:
    for r in spec["missions"][mid]["rooms"]:
        r["scene_type"] = SCENE_MAPPING.get(r["room_id"], "classroom")
        for h in r["hotspots"]:
            hid = h["id"]
            if hid in HOTSPOT_META:
                meta = HOTSPOT_META[hid]
                h["x"] = meta["x"]
                h["y"] = meta["y"]
                h["icon"] = meta["icon"]
                if meta.get("is_puzzle_trigger"):
                    h["is_puzzle_trigger"] = True
            else:
                h["x"] = 50
                h["y"] = 50
                h["icon"] = "fa-circle-dot"

with open('horror_puzzle_data.js', 'w', encoding='utf-8') as f:
    f.write('// Master Horror Escape Room Game Data\nwindow.HORROR_SPEC = ' + json.dumps(spec, indent=2, ensure_ascii=False) + ';\n')

print("horror_puzzle_data.js successfully written with hotspot coordinates and scene mappings.")
