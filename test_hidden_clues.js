const fs = require('fs');

const puzzleData = fs.readFileSync('horror_puzzle_data.js', 'utf-8');
const dataMatch = puzzleData.match(/window\.HORROR_SPEC\s*=\s*(\{[\s\S]*\});/);
const spec = JSON.parse(dataMatch[1]);

console.log('Verifying Mandatory Hidden Clue in all 16 rooms:');

let hiddenCount = 0;
for (const mid of ['MISSION_A', 'MISSION_B']) {
  for (const r of spec.missions[mid].rooms) {
    const hidden = r.hotspots.find(h => h.is_hidden_clue);
    if (!hidden) {
      console.error(`ERROR: ${r.room_id} missing is_hidden_clue hotspot!`);
    } else {
      hiddenCount++;
      console.log(`[OK] Room ${r.room_number} (${r.room_id}): Hidden Clue -> "${hidden.label}" (${hidden.mandatory_pdf_location || 'Mandatory'}) => Item: "${hidden.yields_item || 'None'}"`);
    }
  }
}

console.log(`\nTotal verified hidden clues: ${hiddenCount} / 16 rooms.`);
if (hiddenCount === 16) {
  console.log('ALL 16 ROOMS HAVE MANDATORY PDF HIDDEN CLUES CONFIGURED PROPERLY!');
} else {
  process.exit(1);
}
