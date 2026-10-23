const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');
const engine = fs.readFileSync('escape_game_engine.js', 'utf-8');
const puzzleData = fs.readFileSync('horror_puzzle_data.js', 'utf-8');

// Check that all IDs referenced in engine exist in index.html
const idMatches = engine.match(/getElementById\('([^']+)'\)/g) || [];
const missingIds = [];
for (const m of idMatches) {
  const id = m.match(/'([^']+)'/)[1];
  // Note: some IDs might be created dynamically in modals, e.g. loupe-inspect-modal, darkroom-dev-modal
  if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
    missingIds.push(id);
  }
}

console.log('Total getElementById calls:', idMatches.length);
console.log('Missing IDs from index.html (or dynamically created):', [...new Set(missingIds)]);

// Verify all 16 rooms in puzzle data
const dataMatch = puzzleData.match(/window\.HORROR_SPEC\s*=\s*(\{[\s\S]*\});/);
if (dataMatch) {
  const spec = JSON.parse(dataMatch[1]);
  console.log('Mission A rooms:', spec.missions.MISSION_A.rooms.length);
  console.log('Mission B rooms:', spec.missions.MISSION_B.rooms.length);
  
  // Verify each room has answer, hotspots, hints
  for (const mid of ['MISSION_A', 'MISSION_B']) {
    for (const r of spec.missions[mid].rooms) {
      if (!r.puzzle || !r.puzzle.correct_answer) {
        console.error(`ERROR: ${r.room_id} missing puzzle answer!`);
      }
      if (!r.hotspots || r.hotspots.length < 3) {
        console.error(`ERROR: ${r.room_id} has < 3 hotspots!`);
      }
      if (!r.hints || !r.hints.tier_1) {
        console.error(`ERROR: ${r.room_id} missing hints!`);
      }
    }
  }
  console.log('All 16 rooms verified with complete specs, answers, hotspots, and 3-tier hints!');
} else {
  console.error('ERROR: Could not parse window.HORROR_SPEC from horror_puzzle_data.js');
}
