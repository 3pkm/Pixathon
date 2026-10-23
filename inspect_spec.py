import json

with open('horror_puzzle_design_spec.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for mid, m in data['missions'].items():
    print(f"\n==================== {mid}: {m['name']} ====================")
    for r in m['rooms']:
        p = r['puzzle']
        hs = [h['id'] + (' [HIDDEN]' if h.get('is_hidden_clue') else '') for h in r['hotspots']]
        print(f"Room {r['room_number']}: {r['room_id']} - {r['name']}")
        print(f"  Title: {r['horror_title']}")
        print(f"  Puzzle Type: {p['type']}")
        print(f"  Input Mechanism: {p['input_mechanism']}")
        print(f"  Correct Answer: {p['correct_answer']}")
        print(f"  Hotspots ({len(hs)}): {', '.join(hs)}")
        hidden = [h for h in r['hotspots'] if h.get('is_hidden_clue')]
        if hidden:
            print(f"  Hidden Clue: {hidden[0]['label']} -> yields item: {hidden[0].get('yields_item')} | clue: {hidden[0].get('yields_clue')}")
        print(f"  Reward: {r.get('reward')}")
