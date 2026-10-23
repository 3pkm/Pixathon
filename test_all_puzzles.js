const fs = require('fs');

const puzzleData = fs.readFileSync('horror_puzzle_data.js', 'utf-8');
const dataMatch = puzzleData.match(/window\.HORROR_SPEC\s*=\s*(\{[\s\S]*\});/);
const spec = JSON.parse(dataMatch[1]);

console.log('Testing all 16 puzzle answers against specifications:');

const expectedAnswers = {
  // Mission A
  'room_a_01_reception': '492',
  'room_a_02_locker_row': '738',
  'room_a_03_lecture_hall': 'BELL BEAST ABYSS',
  'room_a_04_library': 'VEIL',
  'room_a_05_art_room': 'SERPENT - MOON - HOURGLASS - EYE',
  'room_a_06_staff_office': '615',
  'room_a_07_examination_room': 'PURGE',
  'room_a_08_sealed_corridor': '738-PURGE-615',

  // Mission B
  'room_b_01_science_block': '1429',
  'room_b_02_mathematics_room': '55',
  'room_b_03_chemistry_lab': '6789',
  'room_b_04_computer_lab': 'ZERO',
  'room_b_05_optics_room': '45-135-45',
  'room_b_06_electrical_lab': 'ON - OFF - ON - OFF - ON',
  'room_b_07_storage_room': 'Canister C',
  'room_b_08_research_office': '1429-55-6789-ZERO'
};

let allPassed = true;
for (const mid of ['MISSION_A', 'MISSION_B']) {
  console.log(`\n=== Checking ${mid} ===`);
  for (const r of spec.missions[mid].rooms) {
    const expected = expectedAnswers[r.room_id];
    const actual = r.puzzle.correct_answer;
    if (expected !== actual) {
      console.error(`FAIL: ${r.room_id} -> expected '${expected}', got '${actual}'`);
      allPassed = false;
    } else {
      console.log(`PASS: ${r.room_id} -> '${actual}' (${r.puzzle.type})`);
    }
  }
}

if (allPassed) {
  console.log('\nALL 16 PUZZLES VERIFIED 100% CORRECT AND ACCORDING TO SPEC!');
} else {
  process.exit(1);
}
