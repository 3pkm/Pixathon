import json

with open('horror_puzzle_design_spec.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for mid in ['MISSION_A', 'MISSION_B']:
    m = data['missions'][mid]
    print('============================== ' + mid + ' ==============================')
    for r in m['rooms']:
        print(f"*** R{r['room_number']}: {r['name']} ({r['puzzle']['type']}) ***")
        print(f"Answer: {r['puzzle']['correct_answer']}")
        print("Hotspots:")
        for h in r['hotspots']:
            is_hid = ' [HIDDEN]' if h.get('is_hidden_clue') else ''
            print(f"  - {h['id']}{is_hid}: {h['label']}")
            if 'clue_content' in h:
                print('    Clue: ' + h['clue_content'].replace('\n', ' // ')[:120])
            if 'discovery_text' in h:
                print('    Discovery: ' + h['discovery_text'].replace('\n', ' // ')[:120])
        print("Hints:")
        print("  T1:", r['hints']['tier_1'][:90])
        print("  T2:", r['hints']['tier_2'][:90])
        print("  T3:", r['hints']['tier_3'][:90])
        print()
