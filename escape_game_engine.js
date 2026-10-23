/**
 * =============================================================================
 * ESCAPE PROTOCOL: HORROR & NOIR GAME ENGINE
 * File: escape_game_engine.js
 * 
 * Full 16-Room Game State Management, Interactive Puzzles,
 * Atmospheric Overlays, Inventory System, Forensic Loupe,
 * Darkroom Chemical Developing, Detective Notebook & Hint Engine.
 * =============================================================================
 */

(function () {
  'use strict';

  /* ===========================================================================
     1. GLOBAL GAME STATE & CONSTANTS
     =========================================================================== */
  const SAVE_STORAGE_KEY = 'BLACKWOOD_HAUNTED_COLLEGE_SAVE_V2';

  const DEFAULT_STATE = {
    currentMission: 'MISSION_A',
    currentRoomIndex: 0,
    unlockedRooms: ['room_a_01_reception'],
    completedRooms: [],
    inventory: [],
    notebook: [],
    hintsUsed: 0,
    startTime: Date.now(),
    storyMode: false, // Debug / Free-play toggle
    settings: {
      darkroomMode: false,
      venetianBlinds: false,
      flashlightMode: false,
      scanlines: true,
      audio: true
    }
  };

  class HorrorEscapeEngine {
    constructor() {
      this.state = this.loadState();
      this.activeModal = null;
      this.flashlightCleanup = null;
      this.timerInterval = null;

      // Audio engine instance shortcut
      this.audio = window.HorrorAssets ? window.HorrorAssets.audio : null;

      // Initialize
      this.init();
    }

    /* =========================================================================
       2. INITIALIZATION & BINDINGS
       ========================================================================= */
    init() {
      this.bindDOMElements();
      this.applySettings();
      this.renderInventory();
      this.renderRoom(this.state.currentMission, this.state.currentRoomIndex);
      this.startClockTicker();
      this.setupFlashlight();

      // Show welcome toast
      setTimeout(() => {
        this.showToast(`OCTOBER 28, 1994 // BLACKWOOD HALL LOCKDOWN ACTIVE`);
      }, 600);
    }

    loadState() {
      try {
        const saved = localStorage.getItem(SAVE_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return Object.assign({}, DEFAULT_STATE, parsed);
        }
      } catch (e) {
        console.warn('Could not load save state:', e);
      }
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }

    saveState() {
      try {
        localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Could not save state:', e);
      }
    }

    resetState() {
      localStorage.removeItem(SAVE_STORAGE_KEY);
      this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      this.state.startTime = Date.now();
      this.saveState();
      this.applySettings();
      this.renderInventory();
      this.renderRoom('MISSION_A', 0);
      this.showToast('MISSION REBOOTED: MEMORY PURGED');
      this.playSfx('reboot');
    }

    /* =========================================================================
       3. DOM BINDINGS & HUD CONTROLS
       ========================================================================= */
    bindDOMElements() {
      // Darkroom Crimson Mode
      const btnDarkroom = document.getElementById('btn-toggle-darkroom');
      if (btnDarkroom) {
        btnDarkroom.addEventListener('click', () => this.toggleDarkroomMode());
      }

      // Venetian Blinds
      const btnBlinds = document.getElementById('btn-toggle-blinds');
      if (btnBlinds) {
        btnBlinds.addEventListener('click', () => this.toggleVenetianBlinds());
      }

      // Flashlight Mode
      const btnFlashlight = document.getElementById('btn-toggle-flashlight');
      if (btnFlashlight) {
        btnFlashlight.addEventListener('click', () => this.toggleFlashlightMode());
      }

      // CRT Scanlines
      const btnScanlines = document.getElementById('btn-toggle-scanlines');
      if (btnScanlines) {
        btnScanlines.addEventListener('click', () => this.toggleScanlines());
      }

      // Audio Toggle
      const btnAudio = document.getElementById('btn-toggle-audio');
      if (btnAudio) {
        btnAudio.addEventListener('click', () => this.toggleAudio());
      }

      // Navigation: Prev Room
      const btnPrev = document.getElementById('btn-prev-room');
      if (btnPrev) {
        btnPrev.addEventListener('click', () => this.navigateRoom(-1));
      }

      // Navigation: Next Room
      const btnNext = document.getElementById('btn-next-room');
      if (btnNext) {
        btnNext.addEventListener('click', () => this.navigateRoom(1));
      }

      // Mission Switcher (Mission A <-> Mission B)
      const btnMissionSwitcher = document.getElementById('btn-mission-switcher');
      if (btnMissionSwitcher) {
        btnMissionSwitcher.addEventListener('click', () => this.openMissionSwitcherModal());
      }

      // Map / Fast Jump Modal
      const btnMap = document.getElementById('btn-open-map');
      if (btnMap) {
        btnMap.addEventListener('click', () => this.openMapModal());
      }

      // Forensic Loupe Magnifier Modal
      const btnLoupe = document.getElementById('btn-open-loupe');
      if (btnLoupe) {
        btnLoupe.addEventListener('click', () => this.openLoupeViewer());
      }

      // Chemical Developing Station Modal
      const btnDarkroomDev = document.getElementById('btn-open-darkroom-dev');
      if (btnDarkroomDev) {
        btnDarkroomDev.addEventListener('click', () => this.openChemicalStation());
      }

      // Detective Notebook Modal
      const btnNotebook = document.getElementById('btn-open-notebook');
      if (btnNotebook) {
        btnNotebook.addEventListener('click', () => this.openNotebookModal());
      }

      // 3-Tier Hint Modal
      const btnHints = document.getElementById('btn-open-hints');
      if (btnHints) {
        btnHints.addEventListener('click', () => this.openHintModal());
      }

      // Reboot / Reset Button
      const btnRestart = document.getElementById('btn-restart');
      if (btnRestart) {
        btnRestart.addEventListener('click', () => {
          if (confirm('REBOOT ESCAPE PROTOCOL?\nAll discovered clues and unlocked stages will be wiped.')) {
            this.resetState();
          }
        });
      }

      // Generic Modal Close
      const btnModalClose = document.getElementById('btn-modal-close');
      if (btnModalClose) {
        btnModalClose.addEventListener('click', () => this.closeGenericModal());
      }

      // Global ESC key listener to close modals
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAllModals();
        }
      });

      // Browser Autoplay audio wakeup
      window.addEventListener('click', () => {
        if (this.audio) {
          this.audio.ensureContext();
        }
        const hintBox = document.getElementById('audio-hint-box');
        if (hintBox) hintBox.style.display = 'none';
      }, { once: true });
    }

    startClockTicker() {
      const clockEl = document.getElementById('hud-clock');
      if (!clockEl) return;
      const update = () => {
        const elapsedSec = Math.floor((Date.now() - this.state.startTime) / 1000);
        const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
        const secs = String(elapsedSec % 60).padStart(2, '0');
        clockEl.textContent = `11:47 PM [+${mins}:${secs}]`;
      };
      update();
      this.timerInterval = setInterval(update, 1000);
    }

    /* =========================================================================
       4. AESTHETICS & HUD TOGGLES
       ========================================================================= */
    applySettings() {
      // Darkroom mode
      const darkroomOverlay = document.getElementById('darkroom-overlay');
      const body = document.body;
      if (this.state.settings.darkroomMode) {
        body.classList.add('darkroom-mode-active');
        if (darkroomOverlay) darkroomOverlay.classList.remove('hidden');
        if (this.audio && this.state.settings.audio) this.audio.startDarkroomHum();
      } else {
        body.classList.remove('darkroom-mode-active');
        if (darkroomOverlay) darkroomOverlay.classList.add('hidden');
        if (this.audio) this.audio.stopDarkroomHum();
      }

      // Venetian blinds
      const blindsOverlay = document.getElementById('venetian-overlay');
      if (blindsOverlay) {
        if (this.state.settings.venetianBlinds) {
          blindsOverlay.classList.remove('hidden');
        } else {
          blindsOverlay.classList.add('hidden');
        }
      }

      // CRT Scanlines
      const crtOverlay = document.getElementById('crt-overlay');
      const scanlinesLabel = document.getElementById('scanlines-label');
      if (crtOverlay) {
        if (this.state.settings.scanlines) {
          crtOverlay.classList.remove('hidden');
          if (scanlinesLabel) scanlinesLabel.textContent = 'CRT: ON';
        } else {
          crtOverlay.classList.add('hidden');
          if (scanlinesLabel) scanlinesLabel.textContent = 'CRT: OFF';
        }
      }

      // Audio state
      const audioIcon = document.getElementById('audio-icon');
      const audioLabel = document.getElementById('audio-label');
      if (this.audio) {
        this.audio.setMuted(!this.state.settings.audio);
      }
      if (audioIcon && audioLabel) {
        if (this.state.settings.audio) {
          audioIcon.className = 'fa-solid fa-volume-high text-emerald-400';
          audioLabel.textContent = 'SND: ON';
        } else {
          audioIcon.className = 'fa-solid fa-volume-xmark text-red-400';
          audioLabel.textContent = 'SND: OFF';
        }
      }
    }

    toggleDarkroomMode() {
      this.state.settings.darkroomMode = !this.state.settings.darkroomMode;
      this.applySettings();
      this.saveState();
      this.playSfx('click');
      this.showToast(this.state.settings.darkroomMode ? 'CRIMSON SAFELIGHT ACTIVATED' : 'STANDARD FLUORESCENT RESTORED');
    }

    toggleVenetianBlinds() {
      this.state.settings.venetianBlinds = !this.state.settings.venetianBlinds;
      this.applySettings();
      this.saveState();
      this.playSfx('click');
      this.showToast(this.state.settings.venetianBlinds ? 'NOIR VENETIAN BLINDS ENGAGED' : 'BLINDS CLEARED');
    }

    toggleScanlines() {
      this.state.settings.scanlines = !this.state.settings.scanlines;
      this.applySettings();
      this.saveState();
      this.playSfx('blip');
      this.showToast(this.state.settings.scanlines ? 'CRT SCANLINES ACTIVATED' : 'CRT SCANLINES DISABLED');
    }

    toggleAudio() {
      this.state.settings.audio = !this.state.settings.audio;
      this.applySettings();
      this.saveState();
      if (this.state.settings.audio) {
        this.playSfx('blip');
      }
      this.showToast(this.state.settings.audio ? 'AUDIO SYNTHESIZER ONLINE' : 'AUDIO MUTED');
    }

    toggleFlashlightMode() {
      this.state.settings.flashlightMode = !this.state.settings.flashlightMode;
      const screenContainer = document.getElementById('screen-container');
      const flashlightOverlay = document.getElementById('flashlight-overlay');
      const flashlightLabel = document.getElementById('flashlight-label');

      if (this.state.settings.flashlightMode) {
        screenContainer.classList.add('flashlight-active');
        if (flashlightOverlay) flashlightOverlay.classList.remove('hidden');
        if (flashlightLabel) flashlightLabel.textContent = 'BEAM: ON';
        this.playSfx('flashlight');
        this.showToast('FLASHLIGHT ON // SCANNING WITH CURSOR');
      } else {
        screenContainer.classList.remove('flashlight-active');
        if (flashlightOverlay) flashlightOverlay.classList.add('hidden');
        if (flashlightLabel) flashlightLabel.textContent = 'BEAM: OFF';
        this.playSfx('flashlight');
        this.showToast('FLASHLIGHT OFF');
      }
      this.saveState();
    }

    setupFlashlight() {
      const screenContainer = document.getElementById('screen-container');
      if (!screenContainer) return;

      screenContainer.addEventListener('mousemove', (e) => {
        if (!this.state.settings.flashlightMode) return;
        const rect = screenContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        screenContainer.style.setProperty('--mouse-x', `${x}px`);
        screenContainer.style.setProperty('--mouse-y', `${y}px`);
      });

      if (this.state.settings.flashlightMode) {
        screenContainer.classList.add('flashlight-active');
        const overlay = document.getElementById('flashlight-overlay');
        if (overlay) overlay.classList.remove('hidden');
      }
    }

    /* =========================================================================
       5. AUDIO FEEDBACK HELPER
       ========================================================================= */
    playSfx(type) {
      if (!this.state.settings.audio || !this.audio) return;
      try {
        switch (type) {
          case 'blip':
            this.audio.playTypewriterKey();
            break;
          case 'click':
          case 'dial':
            this.audio.playTypewriterKey();
            break;
          case 'error':
            this.audio.playGeigerStatic(12, 0.3);
            break;
          case 'success':
            this.audio.playCameraShutter();
            break;
          case 'door':
            this.audio.playMetallicSqueal();
            break;
          case 'jumpscare':
            this.audio.playJumpScareSting();
            break;
          case 'flashlight':
            this.audio.playFlashlightClick();
            break;
          case 'heartbeat':
            this.audio.playHeartbeat(75, 0.8);
            break;
          case 'reboot':
            this.audio.playGeigerStatic(20, 0.5);
            break;
          default:
            this.audio.playTypewriterKey();
        }
      } catch (err) {
        console.warn('Audio playback error:', err);
      }
    }

    /* =========================================================================
       6. ROOM RENDERING & NAVIGATION
       ========================================================================= */
    getCurrentRoomData() {
      const missionData = window.HORROR_SPEC.missions[this.state.currentMission];
      if (!missionData || !missionData.rooms) return null;
      return missionData.rooms[this.state.currentRoomIndex] || null;
    }

    navigateRoom(direction) {
      const missionData = window.HORROR_SPEC.missions[this.state.currentMission];
      const maxRooms = missionData.rooms.length;
      const targetIndex = this.state.currentRoomIndex + direction;

      if (targetIndex < 0 || targetIndex >= maxRooms) {
        this.playSfx('error');
        this.showToast('CORRIDOR BLOCKED: REACHED WING BOUNDARY');
        return;
      }

      const targetRoom = missionData.rooms[targetIndex];
      const isUnlocked = this.state.storyMode || this.state.unlockedRooms.includes(targetRoom.room_id);

      if (!isUnlocked) {
        this.playSfx('error');
        this.showToast(`LOCKED: COMPLETE PREVIOUS STAGE TO ADVANCE`);
        return;
      }

      this.playSfx('door');
      this.state.currentRoomIndex = targetIndex;
      this.saveState();
      this.renderRoom(this.state.currentMission, this.state.currentRoomIndex);
    }

    jumpToRoom(missionId, roomIndex) {
      const missionData = window.HORROR_SPEC.missions[missionId];
      if (!missionData || !missionData.rooms[roomIndex]) return;

      const targetRoom = missionData.rooms[roomIndex];
      const isUnlocked = this.state.storyMode || this.state.unlockedRooms.includes(targetRoom.room_id);

      if (!isUnlocked) {
        this.playSfx('error');
        this.showToast('ZONE LOCKED: CANNOT ACCESS');
        return;
      }

      this.state.currentMission = missionId;
      this.state.currentRoomIndex = roomIndex;
      this.saveState();
      this.renderRoom(missionId, roomIndex);
      this.closeAllModals();
      this.playSfx('door');
    }

    renderRoom(missionId, roomIndex) {
      const room = this.getCurrentRoomData();
      if (!room) return;

      const viewport = document.getElementById('room-viewport');
      const hotspotsLayer = document.getElementById('hotspots-layer');
      if (!viewport || !hotspotsLayer) return;

      // 1. Render Base Visual SVG
      viewport.innerHTML = this.generateSceneSVG(room);

      // 2. Render Interactive Hotspots
      hotspotsLayer.innerHTML = '';
      if (room.hotspots && room.hotspots.length) {
        room.hotspots.forEach(h => {
          const pin = document.createElement('div');
          pin.className = 'interactive-hotspot group';
          pin.style.left = `${h.x}%`;
          pin.style.top = `${h.y}%`;

          const isExamined = this.state.notebook.some(n => n.hotspotId === h.id);
          const isTrigger = h.is_puzzle_trigger;
          const isHidden = h.is_hidden_clue;

          pin.innerHTML = `
            <div class="hotspot-pin ${isTrigger ? 'pin-puzzle' : isHidden ? 'pin-hidden' : 'pin-clue'} ${isExamined ? 'pin-examined' : ''}">
              <i class="fa-solid ${h.icon || 'fa-magnifying-glass'} text-xs"></i>
              ${isExamined ? '<span class="pin-check">✓</span>' : ''}
            </div>
            <div class="hotspot-tooltip">
              <span class="font-pixel text-[8px] text-amber-300 block">${h.label}</span>
              <span class="font-terminal text-[10px] text-gray-300">${isTrigger ? '[CLICK TO SOLVE]' : isHidden ? '[HIDDEN CLUE]' : '[INSPECT]'}</span>
            </div>
          `;

          pin.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleHotspotClick(h, room);
          });

          hotspotsLayer.appendChild(pin);
        });
      }

      // 3. Update HUD Elements
      const hudRoomName = document.getElementById('hud-room-name');
      const hudStageBadge = document.getElementById('hud-stage-badge');
      const hudMissionBadge = document.getElementById('hud-mission-badge');
      const hudObjective = document.getElementById('hud-objective-text');
      const hintsBadge = document.getElementById('hints-badge');

      if (hudRoomName) {
        hudRoomName.textContent = `${room.name.toUpperCase()}`;
      }
      if (hudStageBadge) {
        hudStageBadge.textContent = `[STG ${room.room_number}/8]`;
      }
      if (hudMissionBadge) {
        hudMissionBadge.textContent = missionId === 'MISSION_A' ? 'MISSION A: FORGOTTEN WING' : 'MISSION B: PROJECT ZERO';
      }
      if (hudObjective) {
        hudObjective.textContent = room.puzzle ? `${room.puzzle.type}: ${room.hints.tier_1}` : room.horror_title;
      }
      if (hintsBadge) {
        hintsBadge.textContent = `HINTS: ${this.state.hintsUsed}`;
      }

      // 4. Update Navigation Buttons
      const btnPrev = document.getElementById('btn-prev-room');
      const btnNext = document.getElementById('btn-next-room');
      if (btnPrev) {
        btnPrev.disabled = (roomIndex === 0);
        btnPrev.classList.toggle('opacity-40', roomIndex === 0);
      }
      if (btnNext) {
        const nextRoomId = window.HORROR_SPEC.missions[missionId].rooms[roomIndex + 1]?.room_id;
        const canNext = nextRoomId && (this.state.storyMode || this.state.unlockedRooms.includes(nextRoomId));
        btnNext.disabled = !canNext;
        btnNext.classList.toggle('opacity-40', !canNext);
      }
    }

    /**
     * Dispatcher to select or compose scene SVGs matching room requirements
     */
    generateSceneSVG(room) {
      if (!window.HorrorAssets || !window.HorrorAssets.scenes) {
        return `<div class="p-8 text-center text-red-500 font-pixel">SCENE_ASSETS_MISSING</div>`;
      }

      const scenes = window.HorrorAssets.scenes;
      let baseSvg = '';

      switch (room.scene_type) {
        case 'reception':
          baseSvg = scenes.getNoirOfficeSceneSVG({ confessionNoteText: 'GATE CLEARANCE PIN: 492' });
          break;
        case 'lockers':
          baseSvg = scenes.getLockerRowHorrorSVG();
          break;
        case 'lecture_hall':
          baseSvg = scenes.getLectureHallHorrorSVG();
          break;
        case 'library':
          baseSvg = scenes.getLibraryHorrorSVG();
          break;
        case 'art_room':
          baseSvg = scenes.getClassroomSceneSVG({ bloodIntensity: 'high' });
          break;
        case 'office':
          baseSvg = scenes.getNoirOfficeSceneSVG({ confessionNoteText: 'DR. MERCER PERSONNEL #615' });
          break;
        case 'exam_room':
          baseSvg = scenes.getClassroomSceneSVG({ bloodIntensity: 'medium' });
          break;
        case 'corridor':
          baseSvg = scenes.getElectricalBreakerSVG();
          break;
        case 'science_block':
          baseSvg = scenes.getScienceLabHorrorSVG({ stage: 'quarantine' });
          break;
        case 'math_room':
          baseSvg = scenes.getClassroomSceneSVG({ bloodIntensity: 'low' });
          break;
        case 'chemistry_lab':
          baseSvg = scenes.getScienceLabHorrorSVG({ stage: 'elemental_tomb' });
          break;
        case 'computer_lab':
          baseSvg = scenes.getNoirOfficeSceneSVG({ confessionNoteText: 'TERMINAL DECRYPT: ZERO' });
          break;
        case 'optics_room':
          baseSvg = scenes.getScienceLabHorrorSVG({ stage: 'optics' });
          break;
        case 'electrical_lab':
          baseSvg = scenes.getElectricalBreakerSVG();
          break;
        case 'storage_room':
          baseSvg = scenes.getLibraryHorrorSVG();
          break;
        case 'research_vault':
          baseSvg = scenes.getDarkroomSceneSVG({ trayStage: 'fixer' });
          break;
        default:
          baseSvg = scenes.getClassroomSceneSVG();
      }

      // Add Room Title Badge & Atmospheric Vignette atop the SVG
      const titleBadge = `
        <div class="absolute top-2 left-2 z-15 pointer-events-none bg-black/80 border-2 border-red-950 px-2.5 py-1 text-left">
          <div class="text-[9px] font-pixel text-red-500 tracking-wider">${room.name.toUpperCase()}</div>
          <div class="text-[11px] font-terminal text-red-300">"${room.horror_title}"</div>
        </div>
      `;

      return `<div class="relative w-full h-full">${baseSvg}${titleBadge}</div>`;
    }

    /* =========================================================================
       7. HOTSPOT INTERACTIONS & HIDDEN CLUES
       ========================================================================= */
    handleHotspotClick(hotspot, room) {
      this.playSfx('click');

      // 1. If it's the puzzle trigger hotspot -> launch dedicated interactive puzzle
      if (hotspot.is_puzzle_trigger) {
        this.openPuzzleModal(room);
        return;
      }

      // 2. If it's the mandatory PDF hidden clue location!
      if (hotspot.is_hidden_clue) {
        this.handleHiddenClueDiscovery(hotspot, room);
        return;
      }

      // 3. Regular lore / evidence hotspot
      this.handleEvidenceInspection(hotspot, room);
    }

    handleHiddenClueDiscovery(hotspot, room) {
      this.playSfx('jumpscare');

      // Check if already in notebook
      const alreadyLogged = this.state.notebook.some(n => n.hotspotId === hotspot.id);

      if (!alreadyLogged) {
        // Record into Detective Notebook
        this.state.notebook.push({
          hotspotId: hotspot.id,
          title: `[MANDATORY DISCOVERY] ${hotspot.label}`,
          room: room.name,
          lore: hotspot.discovery_text || hotspot.description,
          clue: hotspot.yields_clue,
          timestamp: new Date().toLocaleTimeString()
        });

        // Grant Inventory Item if provided
        if (hotspot.yields_item) {
          this.addToInventory(hotspot.yields_item, room);
        }

        this.saveState();
        this.renderInventory();
        this.renderRoom(this.state.currentMission, this.state.currentRoomIndex);
      }

      // Open cinematic Graphic Novel modal
      const content = `
        <div class="comic-panel-crimson p-4 space-y-3">
          <div class="flex items-center gap-2 border-b-2 border-red-900 pb-2">
            <i class="fa-solid fa-hand-sparkles text-red-500 text-xl animate-pulse"></i>
            <div>
              <span class="comic-caption-box">PROTOCOL QUESTIONNAIRE: HIDDEN CLUE FOUND!</span>
              <h3 class="font-pixel text-sm text-red-400 mt-1">${hotspot.label}</h3>
            </div>
          </div>
          
          <div class="font-terminal text-base text-gray-200 leading-relaxed bg-black/60 p-3 border border-red-950">
            ${hotspot.discovery_text}
          </div>

          ${hotspot.yields_item ? `
            <div class="bg-red-950/70 border-2 border-red-700 p-2.5 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <i class="fa-solid fa-key text-amber-400 text-lg"></i>
                <div>
                  <span class="font-pixel text-[9px] text-amber-300 block">ITEM OBTAINED:</span>
                  <span class="font-terminal text-sm text-white font-bold">${hotspot.yields_item}</span>
                </div>
              </div>
              <span class="font-pixel text-[8px] bg-red-900 px-2 py-1 text-red-200 border border-red-500">INVENTORY +1</span>
            </div>
          ` : ''}

          <div class="font-terminal text-xs text-red-300/80 italic">
            &gt; CLUE TRANSCRIPT RECORDED IN DETECTIVE NOTEBOOK.
          </div>
        </div>
      `;

      this.openGenericModal(`&gt; HIDDEN CLUE: ${hotspot.label.toUpperCase()}`, content);
      this.showToast(`HIDDEN CLUE DISCOVERED: ${hotspot.label.toUpperCase()}`);
    }

    handleEvidenceInspection(hotspot, room) {
      // Record into Detective Notebook if not already logged
      const alreadyLogged = this.state.notebook.some(n => n.hotspotId === hotspot.id);
      if (!alreadyLogged) {
        this.state.notebook.push({
          hotspotId: hotspot.id,
          title: hotspot.label,
          room: room.name,
          lore: hotspot.description,
          clue: hotspot.clue_content || hotspot.description,
          timestamp: new Date().toLocaleTimeString()
        });
        this.saveState();
        this.renderRoom(this.state.currentMission, this.state.currentRoomIndex);
      }

      const content = `
        <div class="comic-panel-noir p-4 space-y-3">
          <div class="flex items-center gap-2 border-b-2 border-amber-950 pb-2">
            <i class="fa-solid ${hotspot.icon || 'fa-magnifying-glass'} text-amber-500 text-lg"></i>
            <div>
              <span class="comic-caption-box text-amber-400">CRIME SCENE EVIDENCE INSPECTION</span>
              <h3 class="font-pixel text-xs text-amber-300 mt-1">${hotspot.label}</h3>
            </div>
          </div>

          <div class="text-sm font-terminal text-gray-300 italic">
            "${hotspot.description}"
          </div>

          <div class="bg-black/80 border-2 border-gray-800 p-3 font-terminal text-base text-amber-200/90 whitespace-pre-line">
            ${hotspot.clue_content || 'No direct inscriptions found.'}
          </div>

          <div class="font-terminal text-xs text-amber-400/80 flex items-center justify-between">
            <span>&gt; LOGGED IN NOTEBOOK</span>
            <span>EVIDENCE COORD: [X:${hotspot.x}% Y:${hotspot.y}%]</span>
          </div>
        </div>
      `;

      this.openGenericModal(`&gt; EVIDENCE: ${hotspot.label.toUpperCase()}`, content);
    }

    /* =========================================================================
       8. INVENTORY SYSTEM (6 INTERACTIVE SLOTS)
       ========================================================================= */
    addToInventory(itemName, room) {
      if (this.state.inventory.some(i => i.name === itemName)) return;

      const itemMeta = this.getItemMetadata(itemName);
      this.state.inventory.push({
        name: itemName,
        icon: itemMeta.icon,
        desc: itemMeta.desc,
        lore: itemMeta.lore,
        obtainedIn: room.name
      });
      this.saveState();
      this.renderInventory();
    }

    getItemMetadata(name) {
      const db = {
        'Brass Skeleton Key': {
          icon: 'fa-key',
          desc: 'A heavy brass skeleton key salvaged from Clara Vance\'s hollow drawer base.',
          lore: 'Stamped with the Blackwood seal. Unlocks older iron corridor gates and cabinets.'
        },
        'Magnetic Security Keycard': {
          icon: 'fa-id-card',
          desc: 'Level-2 magnetic keycard retrieved from locker #204.',
          lore: 'Belonged to Samuel Ward. Bypasses hallway blast bulkhead gates.'
        },
        'Antique Iron Cog': {
          icon: 'fa-gear',
          desc: 'A heavy iron gear mechanism found behind the chalkboard hinge.',
          lore: 'Used in the mechanical clockwork override of the amphitheater.'
        },
        'Etched Brass Bookmark': {
          icon: 'fa-bookmark',
          desc: 'A tarnished brass marker etched with Roman numerals and letters V-E-I-L.',
          lore: 'Marked the missing grimoires of Blackwood Hall.'
        },
        'Ivory Palette Knife': {
          icon: 'fa-palette',
          desc: 'A stained palette knife carved from aged ivory.',
          lore: 'Used to unwedge occult shadow dials in the grotesque art gallery.'
        },
        'Small Steel Key': {
          icon: 'fa-key',
          desc: 'A polished steel key hidden behind the Dean\'s vertical filing cabinet.',
          lore: 'Opens Dr. Mercer\'s confidential personnel safe.'
        },
        'Personnel File #615': {
          icon: 'fa-folder-closed',
          desc: 'Classified dossier detailing the experimental subjects of Blackwood Wing A.',
          lore: 'Confirms Dr. Arthur Mercer\'s clearance ID 615.'
        },
        'UV Penlight': {
          icon: 'fa-lightbulb',
          desc: 'High-output ultraviolet forensics penlight.',
          lore: 'Illuminates hidden fluorescent inks, invisible Caesar cipher text, and blood stains.'
        },
        'Master Wing A Clearance Key': {
          icon: 'fa-passport',
          desc: 'The synthesized master credential for The Forgotten Wing.',
          lore: 'Grants access through the final quarantine bulkhead to Subterranean Project Zero.'
        },
        'Insulated Lab Tongs': {
          icon: 'fa-hands',
          desc: 'High-temperature insulated laboratory tongs from the quarantine prep shelf.',
          lore: 'Safe handling of radioactive reagents and volatile cryogenic vials.'
        },
        'Heavy Neodymium Magnet': {
          icon: 'fa-magnet',
          desc: 'Extremely strong permanent neodymium magnet from behind the mathematics whiteboard.',
          lore: 'Used to manipulate magnetic safety latches without triggering alarms.'
        },
        'Stabilizing Enzyme Vial': {
          icon: 'fa-vial-virus',
          desc: 'Cryogenically stabilized enzyme suspension retrieved from the chemistry sink drain.',
          lore: 'Neutralizes anomalous chemical decomposition in the subterranean vault.'
        },
        'Encrypted Magnetic Tape Drive': {
          icon: 'fa-tape',
          desc: 'High-density 1994 mainframe magnetic data tape.',
          lore: 'Contains the decrypted memory registers for the Project Zero mainframe.'
        },
        'Optical Ruby Prism': {
          icon: 'fa-gem',
          desc: 'Precision synthetic ruby prism from the optics bench lens cover.',
          lore: 'Refracts high-intensity laser beams to trigger optical photocells.'
        },
        'Heavy Ceramic Fuse': {
          icon: 'fa-plug',
          desc: 'High-voltage industrial 440V ceramic fuse.',
          lore: 'The critical component required to power the Project Zero Master Cryogenic Console.'
        },
        'Lead-Lined Handling Glove': {
          icon: 'fa-hand',
          desc: 'Protective radiation-absorbing glove from the hollowed storage textbook.',
          lore: 'Required to extract dense radioactive canisters safely.'
        },
        'Cryogenic Master Fuse': {
          icon: 'fa-car-battery',
          desc: 'The supercooled master fuse extracted from anomalous Canister C.',
          lore: 'Provides the high-amperage surge needed to breach the Master Vault.'
        },
        "Dr. Finch's Golden Master Keycard": {
          icon: 'fa-id-card-clip',
          desc: 'Lead Researcher Dr. Finch\'s personal golden biometric keycard.',
          lore: 'The final authentication token for the Project Zero Cryogenic Vault.'
        }
      };

      return db[name] || {
        icon: 'fa-box',
        desc: 'An item retrieved from the abandoned college.',
        lore: 'May hold forensic significance in later sectors.'
      };
    }

    renderInventory() {
      const slots = document.querySelectorAll('.inventory-slot');
      slots.forEach((slot, index) => {
        const item = this.state.inventory[index];
        slot.innerHTML = '';
        if (item) {
          slot.className = 'inventory-slot w-11 h-11 sm:w-12 sm:h-12 bg-red-950/80 border-2 border-red-600 flex items-center justify-center cursor-pointer relative hover:border-amber-400 group';
          slot.innerHTML = `
            <i class="fa-solid ${item.icon} text-amber-400 text-sm sm:text-base"></i>
            <span class="absolute bottom-0 right-1 text-[8px] font-pixel text-gray-300">${index + 1}</span>
            <div class="hidden group-hover:block absolute bottom-12 left-1/2 -translate-x-1/2 z-40 bg-black border border-amber-500 px-2 py-1 font-pixel text-[8px] text-amber-300 whitespace-nowrap shadow-xl">
              ${item.name}
            </div>
          `;
          slot.onclick = () => this.inspectInventoryItem(item);
        } else {
          slot.className = 'inventory-slot w-11 h-11 sm:w-12 sm:h-12 bg-[#0d131d] border-2 border-gray-700 flex items-center justify-center cursor-default relative';
          slot.innerHTML = `<span class="text-gray-700 font-pixel text-[8px]">${String(index + 1).padStart(2, '0')}</span>`;
          slot.onclick = null;
        }
      });
    }

    inspectInventoryItem(item) {
      this.playSfx('click');
      const content = `
        <div class="comic-panel-noir p-4 space-y-3">
          <div class="flex items-center gap-3 border-b-2 border-amber-900 pb-2">
            <div class="w-12 h-12 bg-black border-2 border-amber-500 flex items-center justify-center text-amber-400 text-xl">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <div>
              <span class="comic-caption-box text-amber-400">INVENTORY INSPECTION</span>
              <h3 class="font-pixel text-sm text-amber-300 mt-1">${item.name}</h3>
            </div>
          </div>

          <div class="font-terminal text-base text-gray-200 bg-black/60 p-3 border border-gray-800">
            ${item.desc}
          </div>

          <div class="border-t border-amber-950 pt-2 font-terminal text-xs text-amber-300/80">
            <span class="font-pixel text-[8px] text-amber-500 block mb-1">FORENSIC LORE:</span>
            ${item.lore}
          </div>

          <div class="font-pixel text-[8px] text-gray-500">
            OBTAINED IN: ${item.obtainedIn || 'BLACKWOOD HALL'}
          </div>
        </div>
      `;
      this.openGenericModal(`&gt; ITEM: ${item.name.toUpperCase()}`, content);
    }

    /* =========================================================================
       9. 16 INTERACTIVE PUZZLE MODALS (FULL COMPLETE IMPLEMENTATION)
       ========================================================================= */
    openPuzzleModal(room) {
      const modalContainer = document.getElementById('puzzle-modal-container');
      const modalWindow = document.getElementById('puzzle-modal-window');
      const modalTitle = document.getElementById('puzzle-modal-title');
      const modalContent = document.getElementById('puzzle-modal-content');

      if (!modalContainer || !modalContent) return;

      modalTitle.textContent = `> PUZZLE: ${room.name.toUpperCase()} // ${room.puzzle.type.toUpperCase()}`;
      modalContent.innerHTML = '';

      // Route to dedicated puzzle renderer
      switch (room.room_id) {
        // Mission A
        case 'room_a_01_reception':
          this.mountPuzzle_A1(room, modalContent);
          break;
        case 'room_a_02_locker_row':
          this.mountPuzzle_A2(room, modalContent);
          break;
        case 'room_a_03_lecture_hall':
          this.mountPuzzle_A3(room, modalContent);
          break;
        case 'room_a_04_library':
          this.mountPuzzle_A4(room, modalContent);
          break;
        case 'room_a_05_art_room':
          this.mountPuzzle_A5(room, modalContent);
          break;
        case 'room_a_06_staff_office':
          this.mountPuzzle_A6(room, modalContent);
          break;
        case 'room_a_07_examination_room':
          this.mountPuzzle_A7(room, modalContent);
          break;
        case 'room_a_08_sealed_corridor':
          this.mountPuzzle_A8(room, modalContent);
          break;

        // Mission B
        case 'room_b_01_science_block':
          this.mountPuzzle_B1(room, modalContent);
          break;
        case 'room_b_02_mathematics_room':
          this.mountPuzzle_B2(room, modalContent);
          break;
        case 'room_b_03_chemistry_lab':
          this.mountPuzzle_B3(room, modalContent);
          break;
        case 'room_b_04_computer_lab':
          this.mountPuzzle_B4(room, modalContent);
          break;
        case 'room_b_05_optics_room':
          this.mountPuzzle_B5(room, modalContent);
          break;
        case 'room_b_06_electrical_lab':
          this.mountPuzzle_B6(room, modalContent);
          break;
        case 'room_b_07_storage_room':
          this.mountPuzzle_B7(room, modalContent);
          break;
        case 'room_b_08_research_office':
          this.mountPuzzle_B8(room, modalContent);
          break;

        default:
          modalContent.innerHTML = `<p class="text-red-400 font-pixel">UNKNOWN PUZZLE ROUTE</p>`;
      }

      modalContainer.classList.remove('hidden');
      this.activeModal = modalContainer;
    }

    closePuzzleModal() {
      const modalContainer = document.getElementById('puzzle-modal-container');
      if (modalContainer) {
        modalContainer.classList.add('hidden');
      }
      this.activeModal = null;
    }

    onPuzzleSuccess(room, nextRoomId) {
      this.playSfx('success');
      this.playSfx('door');

      // Record room as completed
      if (!this.state.completedRooms.includes(room.room_id)) {
        this.state.completedRooms.push(room.room_id);
      }

      // Unlock next room if specified
      if (nextRoomId && !this.state.unlockedRooms.includes(nextRoomId)) {
        this.state.unlockedRooms.push(nextRoomId);
      }

      this.saveState();
      this.showToast(`SECURITY OVERRIDE GRANTED! STAGE CLEARED.`);

      setTimeout(() => {
        this.closePuzzleModal();
        this.renderRoom(this.state.currentMission, this.state.currentRoomIndex);
      }, 900);
    }

    /* -------------------------------------------------------------------------
       PUZZLE A1: Reception Keypad (Code: 492)
       ------------------------------------------------------------------------- */
    mountPuzzle_A1(room, container) {
      let currentInput = '';
      container.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-sm mx-auto text-center">
          <div class="text-xs font-pixel text-amber-400">BARRED GATE DIGITAL KEYPAD</div>
          <p class="font-terminal text-sm text-gray-300">Enter Clara Vance's 3-digit clearance PIN recorded in the visitor register.</p>

          <div class="bg-black border-2 border-emerald-500 py-3 px-4 font-pixel text-2xl tracking-[0.5em] text-emerald-400 text-center glow-green" id="keypad-display">
            _ _ _
          </div>

          <div class="grid grid-cols-3 gap-2 max-w-[220px] mx-auto">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
              <button class="pixel-btn py-2 text-xs font-pixel text-amber-300 bg-gray-900 border border-gray-700 hover:border-amber-400 active:scale-95" data-num="${num}">
                ${num}
              </button>
            `).join('')}
            <button class="pixel-btn py-2 text-[10px] font-pixel text-red-400 bg-gray-900 border border-red-800" id="btn-keypad-clear">CLR</button>
            <button class="pixel-btn py-2 text-xs font-pixel text-amber-300 bg-gray-900 border border-gray-700" data-num="0">0</button>
            <button class="pixel-btn py-2 text-[10px] font-pixel text-emerald-400 bg-emerald-950 border border-emerald-700" id="btn-keypad-enter">ENT</button>
          </div>
          <div id="keypad-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; STATUS: AWAITING 3-DIGIT INPUT</div>
        </div>
      `;

      const display = container.querySelector('#keypad-display');
      const status = container.querySelector('#keypad-status');

      const updateDisplay = () => {
        let text = currentInput.padEnd(3, '_');
        display.textContent = text.split('').join(' ');
      };

      container.querySelectorAll('[data-num]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.playSfx('blip');
          if (currentInput.length < 3) {
            currentInput += btn.getAttribute('data-num');
            updateDisplay();
          }
        });
      });

      container.querySelector('#btn-keypad-clear').addEventListener('click', () => {
        this.playSfx('blip');
        currentInput = '';
        updateDisplay();
        status.textContent = '> INPUT CLEARED';
      });

      container.querySelector('#btn-keypad-enter').addEventListener('click', () => {
        if (currentInput === room.puzzle.correct_answer) {
          status.innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">ACCESS GRANTED! GATE UNLOCKED.</span>`;
          display.classList.remove('border-emerald-500');
          display.classList.add('border-green-400', 'bg-green-950');
          this.onPuzzleSuccess(room, 'room_a_02_locker_row');
        } else {
          this.playSfx('error');
          status.innerHTML = `<span class="text-red-500 font-pixel text-[10px]">ERROR: INVALID CLEARANCE PIN</span>`;
          currentInput = '';
          setTimeout(updateDisplay, 600);
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE A2: Locker Row 3-Tumbler Rotary Dial (Code: 7-3-8)
       ------------------------------------------------------------------------- */
    mountPuzzle_A2(room, container) {
      let dials = [0, 0, 0];
      container.innerHTML = `
        <div class="comic-panel-crimson p-4 space-y-4 max-w-md mx-auto text-center">
          <div class="text-xs font-pixel text-red-400">LOCKER #204 COMBINATION TUMBLER</div>
          <p class="font-terminal text-sm text-gray-300">
            Subject sequence from stickers: Chemistry (Pd 7) -> Math (Pd 3) -> Physics (Pd 8).
          </p>

          <!-- 3 Tumbler Cylinders -->
          <div class="flex justify-center items-center gap-4 py-3">
            ${[0, 1, 2].map(idx => `
              <div class="flex flex-col items-center">
                <button class="pixel-btn px-3 py-1 font-pixel text-[10px] text-red-400 mb-1" data-dial-up="${idx}">▲</button>
                <div class="w-14 h-16 bg-black border-4 border-red-900 rounded flex items-center justify-center font-pixel text-2xl text-red-400 glow-red" id="dial-val-${idx}">
                  0
                </div>
                <button class="pixel-btn px-3 py-1 font-pixel text-[10px] text-red-400 mt-1" data-dial-down="${idx}">▼</button>
                <span class="font-terminal text-[11px] text-gray-400 mt-1">DIAL ${idx + 1}</span>
              </div>
            `).join('')}
          </div>

          <button id="btn-unlock-locker" class="noir-btn noir-btn-crimson w-full max-w-xs mx-auto text-xs py-2">
            <i class="fa-solid fa-lock-open mr-1"></i> ATTEMPT UNLOCK
          </button>
          <div id="locker-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; ROTARY MECHANISM ENGAGED</div>
        </div>
      `;

      const updateDials = () => {
        dials.forEach((val, i) => {
          container.querySelector(`#dial-val-${i}`).textContent = val;
        });
      };

      container.querySelectorAll('[data-dial-up]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.playSfx('dial');
          const idx = parseInt(btn.getAttribute('data-dial-up'));
          dials[idx] = (dials[idx] + 1) % 10;
          updateDials();
        });
      });

      container.querySelectorAll('[data-dial-down]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.playSfx('dial');
          const idx = parseInt(btn.getAttribute('data-dial-down'));
          dials[idx] = (dials[idx] - 1 + 10) % 10;
          updateDials();
        });
      });

      container.querySelector('#btn-unlock-locker').addEventListener('click', () => {
        const entered = dials.join('');
        if (entered === room.puzzle.correct_answer) {
          container.querySelector('#locker-status').innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">TUMBLERS ALIGNED! LOCKER DOOR SPRINGS OPEN.</span>`;
          this.addToInventory('Magnetic Security Keycard', room);
          this.onPuzzleSuccess(room, 'room_a_03_lecture_hall');
        } else {
          this.playSfx('error');
          container.querySelector('#locker-status').innerHTML = `<span class="text-red-500 font-pixel text-[10px]">FALSE ALIGNMENT: COMBINATION REJECTED</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE A3: Lecture Hall Sentence Completion (BELL BEAST ABYSS)
       ------------------------------------------------------------------------- */
    mountPuzzle_A3(room, container) {
      container.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-lg mx-auto text-center">
          <div class="text-xs font-pixel text-amber-400">AMPHITHEATER LECTERN MECHANISM</div>
          <div class="bg-black/80 border-2 border-gray-800 p-3 font-terminal text-base text-gray-200">
            "WHEN THE [ <span class="text-amber-400 font-bold" id="slot-1">___</span> ] FALLS SILENT, THE [ <span class="text-amber-400 font-bold" id="slot-2">___</span> ] AWAKENS IN THE [ <span class="text-amber-400 font-bold" id="slot-3">___</span> ]."
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <span class="font-pixel text-[8px] text-gray-400 block mb-1">WORD 1</span>
              <input type="text" id="input-word-1" placeholder="WORD 1" class="w-full bg-black border-2 border-gray-700 p-2 text-center font-pixel text-xs text-amber-300 uppercase">
            </div>
            <div>
              <span class="font-pixel text-[8px] text-gray-400 block mb-1">WORD 2</span>
              <input type="text" id="input-word-2" placeholder="WORD 2" class="w-full bg-black border-2 border-gray-700 p-2 text-center font-pixel text-xs text-amber-300 uppercase">
            </div>
            <div>
              <span class="font-pixel text-[8px] text-gray-400 block mb-1">WORD 3</span>
              <input type="text" id="input-word-3" placeholder="WORD 3" class="w-full bg-black border-2 border-gray-700 p-2 text-center font-pixel text-xs text-amber-300 uppercase">
            </div>
          </div>

          <!-- Quick Candidate Chips -->
          <div class="flex flex-wrap justify-center gap-1.5 pt-1">
            ${['BELL', 'SHADOW', 'BEAST', 'ABYSS', 'VOID', 'CLOCK', 'ECHO'].map(w => `
              <button class="px-2 py-0.5 bg-gray-900 border border-gray-700 text-gray-300 font-pixel text-[8px] hover:border-amber-400" data-chip="${w}">
                ${w}
              </button>
            `).join('')}
          </div>

          <button id="btn-submit-words" class="noir-btn noir-btn-amber w-full max-w-xs mx-auto text-xs py-2">
            ROTATE CYLINDER MECHANISM
          </button>
          <div id="word-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; ENTER MISSING OCCULT WORDS</div>
        </div>
      `;

      const in1 = container.querySelector('#input-word-1');
      const in2 = container.querySelector('#input-word-2');
      const in3 = container.querySelector('#input-word-3');

      container.querySelectorAll('[data-chip]').forEach(chip => {
        chip.addEventListener('click', () => {
          this.playSfx('blip');
          const val = chip.getAttribute('data-chip');
          if (!in1.value) in1.value = val;
          else if (!in2.value) in2.value = val;
          else in3.value = val;
        });
      });

      container.querySelector('#btn-submit-words').addEventListener('click', () => {
        const fullAnswer = `${in1.value.trim()} ${in2.value.trim()} ${in3.value.trim()}`.toUpperCase();
        if (fullAnswer === room.puzzle.correct_answer) {
          container.querySelector('#word-status').innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">CYLINDERS CLICK INTO PLACE! AMPHITHEATER EXIT UNLATCHED.</span>`;
          this.addToInventory('Antique Iron Cog', room);
          this.onPuzzleSuccess(room, 'room_a_04_library');
        } else {
          this.playSfx('error');
          container.querySelector('#word-status').innerHTML = `<span class="text-red-500 font-pixel text-[10px]">MECHANISM JAMS: WORDS DO NOT SATISFY THESIS</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE A4: Library 4-Letter Word Padlock (VEIL)
       ------------------------------------------------------------------------- */
    mountPuzzle_A4(room, container) {
      let letters = ['A', 'A', 'A', 'A'];
      const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

      container.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-md mx-auto text-center">
          <div class="text-xs font-pixel text-amber-400">BOOKCASE VAULT WORD PADLOCK</div>
          <p class="font-terminal text-sm text-gray-300">
            Order the 4 displaced ancient tomes chronologically by Roman publication year to read the spine word:
            <br><span class="text-amber-300/80 text-xs">1842 (V) &bull; 1889 (E) &bull; 1914 (I) &bull; 1928 (L)</span>
          </p>

          <div class="flex justify-center items-center gap-3 py-2">
            ${[0, 1, 2, 3].map(i => `
              <div class="flex flex-col items-center">
                <button class="pixel-btn px-2.5 py-1 text-[9px] text-amber-400 mb-1" data-letter-up="${i}">▲</button>
                <div class="w-12 h-14 bg-black border-4 border-amber-900 rounded flex items-center justify-center font-pixel text-2xl text-amber-400 glow-amber" id="letter-val-${i}">
                  A
                </div>
                <button class="pixel-btn px-2.5 py-1 text-[9px] text-amber-400 mt-1" data-letter-down="${i}">▼</button>
              </div>
            `).join('')}
          </div>

          <button id="btn-unlock-padlock" class="noir-btn noir-btn-amber w-full max-w-xs mx-auto text-xs py-2">
            SPRING PADLOCK SHACKLE
          </button>
          <div id="padlock-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; PADLOCK ENGAGED</div>
        </div>
      `;

      const updateLetters = () => {
        letters.forEach((l, i) => {
          container.querySelector(`#letter-val-${i}`).textContent = l;
        });
      };

      container.querySelectorAll('[data-letter-up]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.playSfx('dial');
          const idx = parseInt(btn.getAttribute('data-letter-up'));
          const curPos = ALPHABET.indexOf(letters[idx]);
          letters[idx] = ALPHABET[(curPos + 1) % ALPHABET.length];
          updateLetters();
        });
      });

      container.querySelectorAll('[data-letter-down]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.playSfx('dial');
          const idx = parseInt(btn.getAttribute('data-letter-down'));
          const curPos = ALPHABET.indexOf(letters[idx]);
          letters[idx] = ALPHABET[(curPos - 1 + ALPHABET.length) % ALPHABET.length];
          updateLetters();
        });
      });

      container.querySelector('#btn-unlock-padlock').addEventListener('click', () => {
        const word = letters.join('');
        if (word === room.puzzle.correct_answer) {
          container.querySelector('#padlock-status').innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">PADLOCK OPENS WITH METALLIC CLANK!</span>`;
          this.addToInventory('Etched Brass Bookmark', room);
          this.onPuzzleSuccess(room, 'room_a_05_art_room');
        } else {
          this.playSfx('error');
          container.querySelector('#padlock-status').innerHTML = `<span class="text-red-500 font-pixel text-[10px]">SHACKLE REMAINS LOCKED: '${word}' INCORRECT</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE A5: Art Room 4-Dial Occult Glyph Matcher (SERPENT-MOON-HOURGLASS-EYE)
       ------------------------------------------------------------------------- */
    mountPuzzle_A5(room, container) {
      const GLYPHS = [
        { name: 'SERPENT', icon: 'fa-staff-snake', char: '🐍' },
        { name: 'MOON', icon: 'fa-moon', char: '🌙' },
        { name: 'HOURGLASS', icon: 'fa-hourglass-half', char: '⏳' },
        { name: 'EYE', icon: 'fa-eye', char: '👁️' },
        { name: 'SKULL', icon: 'fa-skull', char: '💀' },
        { name: 'KEY', icon: 'fa-key', char: '🗝️' },
        { name: 'DAGGER', icon: 'fa-khanda', char: '🗡️' },
        { name: 'SUN', icon: 'fa-sun', char: '☀️' }
      ];

      let selectedGlyphs = [0, 0, 0, 0];

      container.innerHTML = `
        <div class="comic-panel-crimson p-4 space-y-4 max-w-lg mx-auto text-center">
          <div class="text-xs font-pixel text-red-400">GALLERY OCCULT GLYPH ROTOR</div>
          <p class="font-terminal text-sm text-gray-300">
            Rotate the 4 stone pedestals to match the shadows revealed inside the plaster bust:
            <br><span class="text-red-300/80 text-xs">SERPENT &bull; MOON &bull; HOURGLASS &bull; EYE</span>
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            ${[0, 1, 2, 3].map(i => `
              <div class="flex flex-col items-center bg-black/70 border-2 border-red-950 p-2.5 rounded">
                <span class="font-pixel text-[8px] text-gray-400 mb-2">ROTOR ${i + 1}</span>
                <button class="w-16 h-16 bg-[#1a0508] border-2 border-red-700 hover:border-red-400 rounded-full flex flex-col items-center justify-center transition-transform active:scale-90" data-glyph-rotor="${i}">
                  <span class="text-2xl" id="glyph-icon-${i}">🐍</span>
                  <span class="font-pixel text-[7px] text-red-300 mt-1" id="glyph-text-${i}">SERPENT</span>
                </button>
                <span class="font-terminal text-[10px] text-red-400/80 mt-1.5">[CLICK TO TURN]</span>
              </div>
            `).join('')}
          </div>

          <button id="btn-submit-glyphs" class="noir-btn noir-btn-crimson w-full max-w-xs mx-auto text-xs py-2">
            DEPRESS GALLERY PEDESTALS
          </button>
          <div id="glyph-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; AWAITING GLYPH ALIGNMENT</div>
        </div>
      `;

      const updateGlyphs = () => {
        selectedGlyphs.forEach((gIdx, i) => {
          const item = GLYPHS[gIdx];
          container.querySelector(`#glyph-icon-${i}`).textContent = item.char;
          container.querySelector(`#glyph-text-${i}`).textContent = item.name;
        });
      };

      container.querySelectorAll('[data-glyph-rotor]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.playSfx('click');
          const idx = parseInt(btn.getAttribute('data-glyph-rotor'));
          selectedGlyphs[idx] = (selectedGlyphs[idx] + 1) % GLYPHS.length;
          updateGlyphs();
        });
      });

      container.querySelector('#btn-submit-glyphs').addEventListener('click', () => {
        const curNames = selectedGlyphs.map(i => GLYPHS[i].name).join(' - ');
        if (curNames === room.puzzle.correct_answer) {
          container.querySelector('#glyph-status').innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">OCCULT DIALS SINK INTO WALL! CORRIDOR UNSEALS.</span>`;
          this.addToInventory('Ivory Palette Knife', room);
          this.onPuzzleSuccess(room, 'room_a_06_staff_office');
        } else {
          this.playSfx('error');
          container.querySelector('#glyph-status').innerHTML = `<span class="text-red-500 font-pixel text-[10px]">PEDESTALS RESIST: SHADOW HARMONY REJECTED</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE A6: Staff Office Safe PIN & Manifest (615)
       ------------------------------------------------------------------------- */
    mountPuzzle_A6(room, container) {
      let code = '';
      container.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-md mx-auto text-center">
          <div class="text-xs font-pixel text-amber-400">DEAN'S WALL SAFE & RECONSTRUCTED DOSSIER</div>
          
          <div class="bg-black/90 border-2 border-amber-900/60 p-3 font-terminal text-xs text-left text-amber-200/90 leading-tight">
            <div class="border-b border-amber-950 pb-1 font-pixel text-[9px] text-amber-400">RECONSTRUCTED PERSONNEL FRAGMENT #04</div>
            <div class="mt-1">SUBJECT: DR. ARTHUR MERCER (FACULTY CHAIR)</div>
            <div>STATUS: CLEARANCE REVOKED &bull; LEVEL 3 QUARANTINE</div>
            <div class="text-red-400 font-bold mt-1">PRIMARY CLEARANCE IDENTIFIER: [ 6 1 5 ]</div>
          </div>

          <div class="bg-black border-2 border-amber-500 py-2.5 px-4 font-pixel text-2xl tracking-[0.4em] text-amber-400 text-center glow-amber" id="safe-display">
            _ _ _
          </div>

          <div class="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
              <button class="pixel-btn py-2 text-xs font-pixel text-amber-300 bg-gray-900 border border-gray-700" data-safe-num="${num}">
                ${num}
              </button>
            `).join('')}
            <button class="pixel-btn py-2 text-[9px] font-pixel text-red-400 bg-gray-900 border border-red-800" id="btn-safe-clear">CLR</button>
            <button class="pixel-btn py-2 text-xs font-pixel text-amber-300 bg-gray-900 border border-gray-700" data-safe-num="0">0</button>
            <button class="pixel-btn py-2 text-[9px] font-pixel text-emerald-400 bg-emerald-950 border border-emerald-700" id="btn-safe-enter">ENT</button>
          </div>
          <div id="safe-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; ENTER 3-DIGIT FACULTY PIN</div>
        </div>
      `;

      const display = container.querySelector('#safe-display');
      const status = container.querySelector('#safe-status');

      const update = () => {
        display.textContent = code.padEnd(3, '_').split('').join(' ');
      };

      container.querySelectorAll('[data-safe-num]').forEach(b => {
        b.addEventListener('click', () => {
          this.playSfx('blip');
          if (code.length < 3) {
            code += b.getAttribute('data-safe-num');
            update();
          }
        });
      });

      container.querySelector('#btn-safe-clear').addEventListener('click', () => {
        this.playSfx('blip');
        code = '';
        update();
      });

      container.querySelector('#btn-safe-enter').addEventListener('click', () => {
        if (code === room.puzzle.correct_answer) {
          status.innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">HEAVY STEEL BOLTS RETRACT! SAFE OPENS.</span>`;
          this.addToInventory('Small Steel Key', room);
          this.addToInventory('Personnel File #615', room);
          this.onPuzzleSuccess(room, 'room_a_07_examination_room');
        } else {
          this.playSfx('error');
          status.innerHTML = `<span class="text-red-500 font-pixel text-[10px]">ACCESS DENIED: CLEARANCE INVALID</span>`;
          code = '';
          setTimeout(update, 500);
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE A7: Examination Room Caesar Shift (-3) Terminal (PURGE)
       ------------------------------------------------------------------------- */
    mountPuzzle_A7(room, container) {
      let isUVOn = false;

      container.innerHTML = `
        <div class="comic-panel-crimson p-4 space-y-4 max-w-lg mx-auto text-center">
          <div class="text-xs font-pixel text-red-400">VENTILATION OVERRIDE CAESAR CIPHER</div>
          
          <div class="flex justify-between items-center bg-black/80 border border-red-950 p-2.5">
            <span class="font-terminal text-xs text-gray-300">EXAM PODIUM UV FLUORESCENCE:</span>
            <button id="btn-toggle-uv" class="pixel-btn px-2.5 py-1 text-[8px] font-pixel text-purple-400 border-purple-800 bg-purple-950">
              <i class="fa-solid fa-lightbulb mr-1"></i> TOGGLE UV PENLIGHT
            </button>
          </div>

          <div id="uv-reveal-box" class="h-16 bg-black border-2 border-gray-800 rounded flex items-center justify-center font-pixel text-xl transition-all duration-300">
            <span class="text-gray-700 text-sm font-terminal">[PENCIL SCRATCHES INVISIBLE TO NAKED EYE]</span>
          </div>

          <div class="font-terminal text-xs text-left bg-black/60 p-2 border border-gray-800 text-gray-400">
            CAESAR DECODER RULE: SHIFT EACH LETTER BY -3 (A &larr; D, B &larr; E ...)
            <br><span class="text-purple-300">S(-3)=P &bull; X(-3)=U &bull; U(-3)=R &bull; J(-3)=G &bull; H(-3)=E</span>
          </div>

          <div class="flex justify-center gap-2">
            <input type="text" id="cipher-word-input" maxlength="5" placeholder="DECODED WORD" class="w-48 bg-black border-2 border-red-700 p-2 text-center font-pixel text-sm text-red-400 uppercase tracking-widest">
            <button id="btn-submit-cipher" class="noir-btn noir-btn-crimson text-xs px-4">
              EXECUTE OVERRIDE
            </button>
          </div>
          <div id="cipher-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; AWAITING 5-LETTER OVERRIDE</div>
        </div>
      `;

      const uvBox = container.querySelector('#uv-reveal-box');
      const btnUV = container.querySelector('#btn-toggle-uv');
      const input = container.querySelector('#cipher-word-input');
      const status = container.querySelector('#cipher-status');

      btnUV.addEventListener('click', () => {
        this.playSfx('flashlight');
        isUVOn = !isUVOn;
        if (isUVOn) {
          uvBox.className = 'h-16 bg-[#1a052e] border-2 border-purple-500 rounded flex items-center justify-center font-pixel text-2xl text-purple-300 tracking-[0.4em] shadow-[0_0_20px_rgba(168,85,247,0.5)]';
          uvBox.innerHTML = `<span>S X U J H</span>`;
          btnUV.textContent = 'UV PENLIGHT: ACTIVE';
        } else {
          uvBox.className = 'h-16 bg-black border-2 border-gray-800 rounded flex items-center justify-center font-pixel text-xl';
          uvBox.innerHTML = `<span class="text-gray-700 text-sm font-terminal">[PENCIL SCRATCHES INVISIBLE TO NAKED EYE]</span>`;
          btnUV.textContent = 'TOGGLE UV PENLIGHT';
        }
      });

      container.querySelector('#btn-submit-cipher').addEventListener('click', () => {
        const val = input.value.trim().toUpperCase();
        if (val === room.puzzle.correct_answer) {
          status.innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">VENTILATION HATCH UNLATCHED! AIR SCRUBBERS ENGAGED.</span>`;
          this.addToInventory('UV Penlight', room);
          this.onPuzzleSuccess(room, 'room_a_08_sealed_corridor');
        } else {
          this.playSfx('error');
          status.innerHTML = `<span class="text-red-500 font-pixel text-[10px]">OVERRIDE REJECTED: '${val}' IS NOT EMERGENCY TOKEN</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE A8: Sealed Corridor Master Synthesis Console (738-PURGE-615)
       ------------------------------------------------------------------------- */
    mountPuzzle_A8(room, container) {
      container.innerHTML = `
        <div class="comic-panel-crimson p-5 space-y-4 max-w-lg mx-auto text-center">
          <div class="text-xs font-pixel text-red-500 glow-red">MASTER QUARANTINE SYNTHESIS CONSOLE</div>
          <p class="font-terminal text-sm text-gray-300">
            Synthesize all 3 Wing A credentials to breach the Subterranean Vault:
            <br><span class="text-amber-300 text-xs">[LOCKER DIAL 738] &mdash; [CIPHER OVERRIDE PURGE] &mdash; [DEAN PIN 615]</span>
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <span class="font-pixel text-[8px] text-gray-400 block mb-1">PART 1: DIAL</span>
              <input type="text" id="syn-code-1" placeholder="DIAL" class="w-full bg-black border-2 border-red-800 p-2 text-center font-pixel text-xs text-amber-300 uppercase">
            </div>
            <div>
              <span class="font-pixel text-[8px] text-gray-400 block mb-1">PART 2: CIPHER</span>
              <input type="text" id="syn-code-2" placeholder="WORD" class="w-full bg-black border-2 border-red-800 p-2 text-center font-pixel text-xs text-amber-300 uppercase">
            </div>
            <div>
              <span class="font-pixel text-[8px] text-gray-400 block mb-1">PART 3: DEAN ID</span>
              <input type="text" id="syn-code-3" placeholder="PIN" class="w-full bg-black border-2 border-red-800 p-2 text-center font-pixel text-xs text-amber-300 uppercase">
            </div>
          </div>

          <button id="btn-breach-vault" class="noir-btn noir-btn-crimson w-full max-w-xs mx-auto text-xs py-2.5">
            <i class="fa-solid fa-triangle-exclamation mr-1"></i> INITIATE WING BREACH
          </button>
          <div id="syn-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; AWAITING THREE CREDENTIAL VECTORS</div>
        </div>
      `;

      const c1 = container.querySelector('#syn-code-1');
      const c2 = container.querySelector('#syn-code-2');
      const c3 = container.querySelector('#syn-code-3');
      const status = container.querySelector('#syn-status');

      container.querySelector('#btn-breach-vault').addEventListener('click', () => {
        const full = `${c1.value.trim()}-${c2.value.trim()}-${c3.value.trim()}`.toUpperCase();
        if (full === '738-PURGE-615') {
          status.innerHTML = `<span class="text-emerald-400 font-pixel text-[11px]">WING A QUARANTINE BREACHED! MISSION A COMPLETE!</span>`;
          this.addToInventory('Master Wing A Clearance Key', room);
          this.onPuzzleSuccess(room, 'room_b_01_science_block');
          setTimeout(() => {
            this.openMissionAVictoryModal();
          }, 1200);
        } else {
          this.playSfx('error');
          status.innerHTML = `<span class="text-red-500 font-pixel text-[10px]">CREDENTIAL MISMATCH: BLAST DOORS REMAIN IMPENETRABLE</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE B1: Science Block Reagent Silhouette Keypad (1429)
       ------------------------------------------------------------------------- */
    mountPuzzle_B1(room, container) {
      let code = '';
      container.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-sm mx-auto text-center">
          <div class="text-xs font-pixel text-amber-400">REAGENT CABINET SILHOUETTE LOCK</div>
          
          <div class="flex justify-around items-center bg-black/90 border border-gray-800 p-2 font-pixel text-[8px] text-amber-300">
            <div><i class="fa-solid fa-fire block text-base mb-1"></i>BURNER(1)</div>
            <div><i class="fa-solid fa-flask block text-base mb-1"></i>BEAKER(4)</div>
            <div><i class="fa-solid fa-bowl-rice block text-base mb-1"></i>CRUCIBLE(2)</div>
            <div><i class="fa-solid fa-flask-vial block text-base mb-1"></i>FLASK(9)</div>
          </div>

          <div class="bg-black border-2 border-cyan-500 py-2.5 px-4 font-pixel text-2xl tracking-[0.5em] text-cyan-400 text-center glow-green" id="b1-display">
            _ _ _ _
          </div>

          <div class="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `
              <button class="pixel-btn py-2 text-xs font-pixel text-cyan-300 bg-gray-900 border border-gray-700" data-b1-num="${n}">${n}</button>
            `).join('')}
            <button class="pixel-btn py-2 text-[9px] font-pixel text-red-400 bg-gray-900 border border-red-800" id="btn-b1-clear">CLR</button>
            <button class="pixel-btn py-2 text-xs font-pixel text-cyan-300 bg-gray-900 border border-gray-700" data-b1-num="0">0</button>
            <button class="pixel-btn py-2 text-[9px] font-pixel text-emerald-400 bg-emerald-950 border border-emerald-700" id="btn-b1-enter">ENT</button>
          </div>
          <div id="b1-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; ENTER 4-DIGIT APPARATUS SEQUENCE</div>
        </div>
      `;

      const display = container.querySelector('#b1-display');
      const status = container.querySelector('#b1-status');

      const update = () => {
        display.textContent = code.padEnd(4, '_').split('').join(' ');
      };

      container.querySelectorAll('[data-b1-num]').forEach(b => {
        b.addEventListener('click', () => {
          this.playSfx('blip');
          if (code.length < 4) {
            code += b.getAttribute('data-b1-num');
            update();
          }
        });
      });

      container.querySelector('#btn-b1-clear').addEventListener('click', () => {
        this.playSfx('blip');
        code = '';
        update();
      });

      container.querySelector('#btn-b1-enter').addEventListener('click', () => {
        if (code === room.puzzle.correct_answer) {
          status.innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">CABINET UNLATCHED! REAGENTS SECURED.</span>`;
          this.addToInventory('Insulated Lab Tongs', room);
          this.onPuzzleSuccess(room, 'room_b_02_mathematics_room');
        } else {
          this.playSfx('error');
          status.innerHTML = `<span class="text-red-500 font-pixel text-[10px]">SEQUENCE ERROR: APPARATUS MISALIGNED</span>`;
          code = '';
          setTimeout(update, 500);
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE B2: Mathematics Room Recursive Progression (55)
       ------------------------------------------------------------------------- */
    mountPuzzle_B2(room, container) {
      container.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-md mx-auto text-center">
          <div class="text-xs font-pixel text-amber-400">THE FRACTAL ASYLUM SEQUENCE LOCKBOX</div>
          
          <div class="bg-black/90 border-2 border-emerald-900/60 p-3 font-terminal text-base text-emerald-300">
            RECURSIVE SERIES: 1, 2, 3, 5, 8, 13, 21, 34, [ <span class="font-bold text-amber-400">?</span> ]
            <div class="text-xs text-gray-400 mt-1">Rule: Each term is the sum of the preceding two terms (21 + 34).</div>
          </div>

          <div class="flex justify-center gap-2">
            <input type="number" id="math-num-input" placeholder="??" class="w-28 bg-black border-2 border-emerald-500 p-2.5 text-center font-pixel text-xl text-emerald-400 tracking-widest">
            <button id="btn-submit-math" class="noir-btn noir-btn-amber text-xs px-4">
              UNLOCK VAULT
            </button>
          </div>
          <div id="math-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; ENTER NEXT TERM IN SEQUENCE</div>
        </div>
      `;

      const input = container.querySelector('#math-num-input');
      const status = container.querySelector('#math-status');

      container.querySelector('#btn-submit-math').addEventListener('click', () => {
        const val = input.value.trim();
        if (val === room.puzzle.correct_answer) {
          status.innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">SEQUENCE VALIDATED! NEODYMIUM LATCH RELEASES.</span>`;
          this.addToInventory('Heavy Neodymium Magnet', room);
          this.onPuzzleSuccess(room, 'room_b_03_chemistry_lab');
        } else {
          this.playSfx('error');
          status.innerHTML = `<span class="text-red-500 font-pixel text-[10px]">FRACTAL DIVERGENCE: NUMERIC KEY REJECTED</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE B3: Chemistry Lab Periodic Table Keypad (6789)
       ------------------------------------------------------------------------- */
    mountPuzzle_B3(room, container) {
      let code = '';
      container.innerHTML = `
        <div class="comic-panel-crimson p-4 space-y-4 max-w-sm mx-auto text-center">
          <div class="text-xs font-pixel text-red-400">CRYO-SPECIMEN PERIODIC KEYPAD</div>

          <div class="grid grid-cols-4 gap-1.5 bg-black p-2 border border-red-950 font-terminal text-center">
            <div class="bg-gray-900 p-1 border border-gray-700">
              <span class="text-[9px] text-gray-400 block font-pixel">C</span>
              <span class="text-xs text-amber-300 font-bold">#6</span>
            </div>
            <div class="bg-gray-900 p-1 border border-gray-700">
              <span class="text-[9px] text-gray-400 block font-pixel">N</span>
              <span class="text-xs text-amber-300 font-bold">#7</span>
            </div>
            <div class="bg-gray-900 p-1 border border-gray-700">
              <span class="text-[9px] text-gray-400 block font-pixel">O</span>
              <span class="text-xs text-amber-300 font-bold">#8</span>
            </div>
            <div class="bg-gray-900 p-1 border border-gray-700">
              <span class="text-[9px] text-gray-400 block font-pixel">F</span>
              <span class="text-xs text-amber-300 font-bold">#9</span>
            </div>
          </div>

          <div class="bg-black border-2 border-red-500 py-2.5 px-4 font-pixel text-2xl tracking-[0.5em] text-red-400 text-center glow-red" id="b3-display">
            _ _ _ _
          </div>

          <div class="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `
              <button class="pixel-btn py-2 text-xs font-pixel text-red-300 bg-gray-900 border border-gray-700" data-b3-num="${n}">${n}</button>
            `).join('')}
            <button class="pixel-btn py-2 text-[9px] font-pixel text-red-400 bg-gray-900 border border-red-800" id="btn-b3-clear">CLR</button>
            <button class="pixel-btn py-2 text-xs font-pixel text-red-300 bg-gray-900 border border-gray-700" data-b3-num="0">0</button>
            <button class="pixel-btn py-2 text-[9px] font-pixel text-emerald-400 bg-emerald-950 border border-emerald-700" id="btn-b3-enter">ENT</button>
          </div>
          <div id="b3-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; ENTER ATOMIC NUMBERS: C &bull; N &bull; O &bull; F</div>
        </div>
      `;

      const display = container.querySelector('#b3-display');
      const status = container.querySelector('#b3-status');

      const update = () => {
        display.textContent = code.padEnd(4, '_').split('').join(' ');
      };

      container.querySelectorAll('[data-b3-num]').forEach(b => {
        b.addEventListener('click', () => {
          this.playSfx('blip');
          if (code.length < 4) {
            code += b.getAttribute('data-b3-num');
            update();
          }
        });
      });

      container.querySelector('#btn-b3-clear').addEventListener('click', () => {
        this.playSfx('blip');
        code = '';
        update();
      });

      container.querySelector('#btn-b3-enter').addEventListener('click', () => {
        if (code === room.puzzle.correct_answer) {
          status.innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">CRYO-SEAL DISENGAGED! ENZYME EXTRACTED.</span>`;
          this.addToInventory('Stabilizing Enzyme Vial', room);
          this.onPuzzleSuccess(room, 'room_b_04_computer_lab');
        } else {
          this.playSfx('error');
          status.innerHTML = `<span class="text-red-500 font-pixel text-[10px]">ATOMIC WEIGHT MISMATCH: PIN REJECTED</span>`;
          code = '';
          setTimeout(update, 500);
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE B4: Computer Lab Binary ASCII Terminal (ZERO)
       ------------------------------------------------------------------------- */
    mountPuzzle_B4(room, container) {
      container.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-lg mx-auto text-center">
          <div class="text-xs font-pixel text-emerald-400">SILICON CRYPT ASCII DECODER TERMINAL</div>

          <div class="bg-black/90 border-2 border-emerald-500/60 p-3 font-terminal text-sm text-left text-emerald-300 leading-tight">
            <div class="text-[10px] font-pixel text-emerald-500 mb-1">SYSTEM REGISTER DUMP (8-BIT BYTES):</div>
            <div>BYTE 1: 01011010 (DEC 90 &rarr; ASCII 'Z')</div>
            <div>BYTE 2: 01000101 (DEC 69 &rarr; ASCII 'E')</div>
            <div>BYTE 3: 01010010 (DEC 82 &rarr; ASCII 'R')</div>
            <div>BYTE 4: 01001111 (DEC 79 &rarr; ASCII 'O')</div>
          </div>

          <div class="flex justify-center gap-2">
            <input type="text" id="ascii-word-input" maxlength="4" placeholder="ASCII WORD" class="w-36 bg-black border-2 border-emerald-500 p-2 text-center font-pixel text-base text-emerald-400 uppercase tracking-widest">
            <button id="btn-submit-ascii" class="noir-btn noir-btn-amber text-xs px-4">
              EXECUTE BOOT
            </button>
          </div>
          <div id="ascii-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; AWAITING 4-BYTE ASCII TRANSLATION</div>
        </div>
      `;

      const input = container.querySelector('#ascii-word-input');
      const status = container.querySelector('#ascii-status');

      container.querySelector('#btn-submit-ascii').addEventListener('click', () => {
        const val = input.value.trim().toUpperCase();
        if (val === room.puzzle.correct_answer) {
          status.innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">MAINFRAME MOUNTED! TAPE DRIVE EJECTED.</span>`;
          this.addToInventory('Encrypted Magnetic Tape Drive', room);
          this.onPuzzleSuccess(room, 'room_b_05_optics_room');
        } else {
          this.playSfx('error');
          status.innerHTML = `<span class="text-red-500 font-pixel text-[10px]">SYNTAX ERROR: BINARY WORD DOES NOT TRANSLATE</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE B5: Optics Room 3-Mirror Angle Deflection (45-135-45)
       ------------------------------------------------------------------------- */
    mountPuzzle_B5(room, container) {
      const ANGLES = [0, 45, 90, 135, 180];
      let mirrorAngles = [0, 0, 0];

      container.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-lg mx-auto text-center">
          <div class="text-xs font-pixel text-cyan-400">PRISMATIC LASER DEFLECTION BENCH</div>
          <p class="font-terminal text-sm text-gray-300">
            Rotate 3 mirrors to reflect the ruby laser beam into the target photocell:
            <br><span class="text-cyan-300 text-xs">TARGET: 45&deg; &bull; 135&deg; &bull; 45&deg;</span>
          </p>

          <div class="grid grid-cols-3 gap-3 py-2">
            ${[0, 1, 2].map(i => `
              <div class="bg-black border-2 border-cyan-900 p-2.5 rounded flex flex-col items-center">
                <span class="font-pixel text-[8px] text-gray-400 mb-2">MIRROR ${i + 1}</span>
                <button class="pixel-btn px-2 py-1 text-[8px] text-cyan-400 mb-1" data-mirror-up="${i}">▲ +45&deg;</button>
                <div class="w-16 h-14 bg-[#05131a] border-2 border-cyan-600 rounded flex items-center justify-center font-pixel text-base text-cyan-300 glow-green" id="mirror-val-${i}">
                  0&deg;
                </div>
                <button class="pixel-btn px-2 py-1 text-[8px] text-cyan-400 mt-1" data-mirror-down="${i}">▼ -45&deg;</button>
              </div>
            `).join('')}
          </div>

          <button id="btn-fire-laser" class="noir-btn noir-btn-amber w-full max-w-xs mx-auto text-xs py-2">
            <i class="fa-solid fa-bolt mr-1"></i> PULSE LASER EMITTER
          </button>
          <div id="laser-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; LASER READY &bull; PHOTOCELL UNTRIGGERED</div>
        </div>
      `;

      const updateMirrors = () => {
        mirrorAngles.forEach((val, i) => {
          container.querySelector(`#mirror-val-${i}`).textContent = `${val}°`;
        });
      };

      container.querySelectorAll('[data-mirror-up]').forEach(b => {
        b.addEventListener('click', () => {
          this.playSfx('dial');
          const idx = parseInt(b.getAttribute('data-mirror-up'));
          const curIndex = ANGLES.indexOf(mirrorAngles[idx]);
          mirrorAngles[idx] = ANGLES[(curIndex + 1) % ANGLES.length];
          updateMirrors();
        });
      });

      container.querySelectorAll('[data-mirror-down]').forEach(b => {
        b.addEventListener('click', () => {
          this.playSfx('dial');
          const idx = parseInt(b.getAttribute('data-mirror-down'));
          const curIndex = ANGLES.indexOf(mirrorAngles[idx]);
          mirrorAngles[idx] = ANGLES[(curIndex - 1 + ANGLES.length) % ANGLES.length];
          updateMirrors();
        });
      });

      container.querySelector('#btn-fire-laser').addEventListener('click', () => {
        const code = mirrorAngles.join('-');
        if (code === room.puzzle.correct_answer) {
          container.querySelector('#laser-status').innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">BEAM CONVERGES ON SENSOR! OPTICAL PRISM EXTRACTED.</span>`;
          this.addToInventory('Optical Ruby Prism', room);
          this.onPuzzleSuccess(room, 'room_b_06_electrical_lab');
        } else {
          this.playSfx('error');
          container.querySelector('#laser-status').innerHTML = `<span class="text-red-500 font-pixel text-[10px]">DEFLECTION FAILED: BEAM SCATTERS INTO VOID</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE B6: Electrical Lab 5-Knife Switch Bank (ON-OFF-ON-OFF-ON)
       ------------------------------------------------------------------------- */
    mountPuzzle_B6(room, container) {
      let switches = [false, false, false, false, false];

      container.innerHTML = `
        <div class="comic-panel-crimson p-4 space-y-4 max-w-lg mx-auto text-center">
          <div class="text-xs font-pixel text-red-400">HIGH-VOLTAGE 5-CHANNEL SWITCH BANK</div>
          <p class="font-terminal text-sm text-gray-300">
            Configure breaker switches to bypass surge relays:
            <br><span class="text-amber-300 text-xs">CONFIG: ON &bull; OFF &bull; ON &bull; OFF &bull; ON</span>
          </p>

          <div class="grid grid-cols-5 gap-2 py-2">
            ${[0, 1, 2, 3, 4].map(i => `
              <div class="flex flex-col items-center bg-black border-2 border-red-950 p-2 rounded">
                <span class="font-pixel text-[7px] text-gray-400 mb-1">SW ${i + 1}</span>
                <button class="w-12 h-16 bg-gray-900 border-2 border-gray-600 rounded flex flex-col justify-between p-1 transition-all" data-knife-sw="${i}">
                  <span class="text-[8px] font-pixel text-gray-500" id="sw-state-on-${i}">ON</span>
                  <div class="w-full h-4 bg-gray-700 rounded transition-all" id="sw-handle-${i}"></div>
                  <span class="text-[8px] font-pixel text-red-500" id="sw-state-off-${i}">OFF</span>
                </button>
              </div>
            `).join('')}
          </div>

          <button id="btn-engage-generator" class="noir-btn noir-btn-crimson w-full max-w-xs mx-auto text-xs py-2">
            <i class="fa-solid fa-bolt mr-1"></i> ENGAGE 440V MAIN TRANSFORMER
          </button>
          <div id="breaker-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; RELAY COILS DORMANT</div>
        </div>
      `;

      const updateSwitches = () => {
        switches.forEach((state, i) => {
          const handle = container.querySelector(`#sw-handle-${i}`);
          const onTxt = container.querySelector(`#sw-state-on-${i}`);
          const offTxt = container.querySelector(`#sw-state-off-${i}`);
          if (state) {
            handle.className = 'w-full h-4 bg-emerald-500 -translate-y-4 rounded transition-all shadow-[0_0_8px_rgba(16,185,129,0.8)]';
            onTxt.className = 'text-[8px] font-pixel text-emerald-400 font-bold';
            offTxt.className = 'text-[8px] font-pixel text-gray-700';
          } else {
            handle.className = 'w-full h-4 bg-red-600 translate-y-4 rounded transition-all';
            onTxt.className = 'text-[8px] font-pixel text-gray-700';
            offTxt.className = 'text-[8px] font-pixel text-red-500 font-bold';
          }
        });
      };
      updateSwitches();

      container.querySelectorAll('[data-knife-sw]').forEach(b => {
        b.addEventListener('click', () => {
          this.playSfx('click');
          const idx = parseInt(b.getAttribute('data-knife-sw'));
          switches[idx] = !switches[idx];
          updateSwitches();
        });
      });

      container.querySelector('#btn-engage-generator').addEventListener('click', () => {
        const curPattern = switches.map(s => s ? 'ON' : 'OFF').join(' - ');
        if (curPattern === room.puzzle.correct_answer) {
          container.querySelector('#breaker-status').innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">440V POWER SURGES! CERAMIC FUSE EJECTED.</span>`;
          this.addToInventory('Heavy Ceramic Fuse', room);
          this.onPuzzleSuccess(room, 'room_b_07_storage_room');
        } else {
          this.playSfx('error');
          container.querySelector('#breaker-status').innerHTML = `<span class="text-red-500 font-pixel text-[10px]">CIRCUIT BREAKER TRIPPED: SHORT DETECTED</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE B7: Storage Room Dual-Pan Balance Scale (Canister C)
       ------------------------------------------------------------------------- */
    mountPuzzle_B7(room, container) {
      let leftPan = null;
      let rightPan = null;
      let selectedDecouple = 'Canister A';

      const WEIGHTS = {
        'Canister A': 5.0,
        'Canister B': 5.0,
        'Canister C': 6.4, // Anomalously heavy (contains Master Fuse!)
        'Canister D': 5.0
      };

      container.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-lg mx-auto text-center">
          <div class="text-xs font-pixel text-amber-400">DUAL-PAN BALANCE SCALE WEIGHER</div>
          <p class="font-terminal text-sm text-gray-300">
            Compare lead canister weights on Left and Right pans to find the anomalous heavy container holding the fuse.
          </p>

          <!-- Interactive Balance Pans -->
          <div class="flex justify-around items-center bg-black/80 border-2 border-gray-800 p-3 rounded">
            <div class="flex flex-col items-center">
              <span class="font-pixel text-[8px] text-gray-400 mb-1">LEFT PAN</span>
              <div id="pan-left" class="w-24 h-16 bg-gray-900 border-2 border-amber-600 rounded flex items-center justify-center font-pixel text-[9px] text-amber-300">
                EMPTY
              </div>
              <button class="pixel-btn px-2 py-0.5 text-[7px] text-red-400 mt-1" id="btn-clear-left">CLEAR</button>
            </div>

            <div class="font-pixel text-xs text-amber-500" id="balance-tilt-gauge">
              [ BALANCED ]
            </div>

            <div class="flex flex-col items-center">
              <span class="font-pixel text-[8px] text-gray-400 mb-1">RIGHT PAN</span>
              <div id="pan-right" class="w-24 h-16 bg-gray-900 border-2 border-amber-600 rounded flex items-center justify-center font-pixel text-[9px] text-amber-300">
                EMPTY
              </div>
              <button class="pixel-btn px-2 py-0.5 text-[7px] text-red-400 mt-1" id="btn-clear-right">CLEAR</button>
            </div>
          </div>

          <!-- Canister Buttons -->
          <div class="flex flex-wrap justify-center gap-2">
            ${['Canister A', 'Canister B', 'Canister C', 'Canister D'].map(can => `
              <div class="flex flex-col items-center">
                <span class="font-pixel text-[8px] text-gray-400 mb-0.5">${can}</span>
                <div class="flex gap-1">
                  <button class="pixel-btn px-2 py-1 text-[7px] text-amber-300" data-can-left="${can}">+ LEFT</button>
                  <button class="pixel-btn px-2 py-1 text-[7px] text-amber-300" data-can-right="${can}">+ RIGHT</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Decouple Selection -->
          <div class="pt-2 border-t border-gray-800 flex justify-center items-center gap-2">
            <select id="select-decouple-canister" class="bg-black border border-amber-500 text-amber-300 font-pixel text-[9px] p-2">
              <option value="Canister A">CANISTER A</option>
              <option value="Canister B">CANISTER B</option>
              <option value="Canister C" selected>CANISTER C (6.4 KG)</option>
              <option value="Canister D">CANISTER D</option>
            </select>
            <button id="btn-decouple-canister" class="noir-btn noir-btn-amber text-xs py-2 px-3">
              OPEN HEAVY CANISTER
            </button>
          </div>
          <div id="scale-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; LOAD CANISTERS ONTO SCALE</div>
        </div>
      `;

      const panL = container.querySelector('#pan-left');
      const panR = container.querySelector('#pan-right');
      const gauge = container.querySelector('#balance-tilt-gauge');
      const status = container.querySelector('#scale-status');

      const evaluateScale = () => {
        panL.textContent = leftPan || 'EMPTY';
        panR.textContent = rightPan || 'EMPTY';

        if (!leftPan && !rightPan) {
          gauge.textContent = '[ BALANCED ]';
          gauge.className = 'font-pixel text-xs text-gray-400';
          return;
        }

        const wL = leftPan ? WEIGHTS[leftPan] : 0;
        const wR = rightPan ? WEIGHTS[rightPan] : 0;

        if (wL > wR) {
          gauge.innerHTML = `<span class="text-red-400 font-bold">&larr; LEFT HEAVIER (+${(wL - wR).toFixed(1)}kg)</span>`;
        } else if (wR > wL) {
          gauge.innerHTML = `<span class="text-red-400 font-bold">RIGHT HEAVIER (+${(wR - wL).toFixed(1)}kg) &rarr;</span>`;
        } else {
          gauge.innerHTML = `<span class="text-emerald-400 font-bold">[ EXACT BALANCE ]</span>`;
        }
      };

      container.querySelectorAll('[data-can-left]').forEach(b => {
        b.addEventListener('click', () => {
          this.playSfx('dial');
          leftPan = b.getAttribute('data-can-left');
          evaluateScale();
        });
      });

      container.querySelectorAll('[data-can-right]').forEach(b => {
        b.addEventListener('click', () => {
          this.playSfx('dial');
          rightPan = b.getAttribute('data-can-right');
          evaluateScale();
        });
      });

      container.querySelector('#btn-clear-left').addEventListener('click', () => {
        leftPan = null;
        evaluateScale();
      });

      container.querySelector('#btn-clear-right').addEventListener('click', () => {
        rightPan = null;
        evaluateScale();
      });

      container.querySelector('#btn-decouple-canister').addEventListener('click', () => {
        const choice = container.querySelector('#select-decouple-canister').value;
        if (choice === room.puzzle.correct_answer) {
          status.innerHTML = `<span class="text-emerald-400 font-pixel text-[10px]">ANOMALOUS DENSITY CONFIRMED! CRYOGENIC MASTER FUSE OBTAINED.</span>`;
          this.addToInventory('Cryogenic Master Fuse', room);
          this.addToInventory('Lead-Lined Handling Glove', room);
          this.onPuzzleSuccess(room, 'room_b_08_research_office');
        } else {
          this.playSfx('error');
          status.innerHTML = `<span class="text-red-500 font-pixel text-[10px]">CANISTER HOLLOW: ONLY STANDARD LEAD SLAG INSIDE</span>`;
        }
      });
    }

    /* -------------------------------------------------------------------------
       PUZZLE B8: Research Office Master Vault Console (1429-55-6789-ZERO)
       ------------------------------------------------------------------------- */
    mountPuzzle_B8(room, container) {
      let hasFuseInserted = false;
      let hasCardSwiped = false;

      container.innerHTML = `
        <div class="comic-panel-crimson p-5 space-y-4 max-w-xl mx-auto text-center">
          <div class="text-xs font-pixel text-red-500 glow-red">PROJECT ZERO MASTER CRYOGENIC CONSOLE</div>
          <p class="font-terminal text-sm text-gray-300">
            Synthesize all 4 Mission B milestones to disengage the containment clamps:
            <br><span class="text-cyan-300 text-xs">[REAGENTS 1429] &bull; [SEQUENCE 55] &bull; [ATOMIC 6789] &bull; [ASCII ZERO]</span>
          </p>

          <!-- Hardware Insert Toggles -->
          <div class="flex justify-center gap-3 bg-black/80 p-3 border border-red-950 rounded">
            <button id="btn-insert-fuse" class="pixel-btn px-3 py-2 text-[8px] font-pixel text-amber-300 border border-amber-800 bg-amber-950">
              <i class="fa-solid fa-car-battery mr-1"></i> [INSERT CERAMIC FUSE]
            </button>
            <button id="btn-swipe-keycard" class="pixel-btn px-3 py-2 text-[8px] font-pixel text-cyan-300 border border-cyan-800 bg-cyan-950">
              <i class="fa-solid fa-id-card mr-1"></i> [SWIPE DR. FINCH CARD]
            </button>
          </div>

          <!-- 4 Parameters Input -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span class="font-pixel text-[7px] text-gray-400 block mb-1">P1: REAGENT</span>
              <input type="text" id="final-p1" placeholder="1429" class="w-full bg-black border-2 border-red-800 p-2 text-center font-pixel text-xs text-cyan-300">
            </div>
            <div>
              <span class="font-pixel text-[7px] text-gray-400 block mb-1">P2: SEQUENCE</span>
              <input type="text" id="final-p2" placeholder="55" class="w-full bg-black border-2 border-red-800 p-2 text-center font-pixel text-xs text-cyan-300">
            </div>
            <div>
              <span class="font-pixel text-[7px] text-gray-400 block mb-1">P3: ATOMIC</span>
              <input type="text" id="final-p3" placeholder="6789" class="w-full bg-black border-2 border-red-800 p-2 text-center font-pixel text-xs text-cyan-300">
            </div>
            <div>
              <span class="font-pixel text-[7px] text-gray-400 block mb-1">P4: ASCII</span>
              <input type="text" id="final-p4" placeholder="ZERO" class="w-full bg-black border-2 border-red-800 p-2 text-center font-pixel text-xs text-cyan-300 uppercase">
            </div>
          </div>

          <button id="btn-disengage-vault" class="noir-btn noir-btn-crimson w-full max-w-sm mx-auto text-xs py-2.5">
            <i class="fa-solid fa-radiation mr-1"></i> EXECUTE CRITICAL FACILITY PURGE
          </button>
          <div id="final-status" class="font-terminal text-xs text-gray-400 min-h-[1.5rem]">&gt; RECEPTACLES AWAITING HARDWARE & SYNTHESIS</div>
        </div>
      `;

      const btnFuse = container.querySelector('#btn-insert-fuse');
      const btnCard = container.querySelector('#btn-swipe-keycard');
      const status = container.querySelector('#final-status');

      btnFuse.addEventListener('click', () => {
        this.playSfx('click');
        hasFuseInserted = !hasFuseInserted;
        btnFuse.className = hasFuseInserted
          ? 'pixel-btn px-3 py-2 text-[8px] font-pixel text-emerald-300 border border-emerald-600 bg-emerald-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
          : 'pixel-btn px-3 py-2 text-[8px] font-pixel text-amber-300 border border-amber-800 bg-amber-950';
        btnFuse.innerHTML = hasFuseInserted ? '✓ FUSE CRADLE: ENERGIZED' : '[INSERT CERAMIC FUSE]';
      });

      btnCard.addEventListener('click', () => {
        this.playSfx('click');
        hasCardSwiped = !hasCardSwiped;
        btnCard.className = hasCardSwiped
          ? 'pixel-btn px-3 py-2 text-[8px] font-pixel text-emerald-300 border border-emerald-600 bg-emerald-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
          : 'pixel-btn px-3 py-2 text-[8px] font-pixel text-cyan-300 border border-cyan-800 bg-cyan-950';
        btnCard.innerHTML = hasCardSwiped ? '✓ KEYCARD: AUTHENTICATED' : '[SWIPE DR. FINCH CARD]';
      });

      container.querySelector('#btn-disengage-vault').addEventListener('click', () => {
        const p1 = container.querySelector('#final-p1').value.trim();
        const p2 = container.querySelector('#final-p2').value.trim();
        const p3 = container.querySelector('#final-p3').value.trim();
        const p4 = container.querySelector('#final-p4').value.trim().toUpperCase();

        if (!hasFuseInserted) {
          this.playSfx('error');
          status.innerHTML = `<span class="text-amber-400 font-pixel text-[9px]">ERROR: CERAMIC FUSE CRADLE DISCONNECTED!</span>`;
          return;
        }

        if (!hasCardSwiped) {
          this.playSfx('error');
          status.innerHTML = `<span class="text-amber-400 font-pixel text-[9px]">ERROR: DR. FINCH BIOMETRIC CARD REQUIRED!</span>`;
          return;
        }

        const synthesisCode = `${p1}-${p2}-${p3}-${p4}`;
        if (synthesisCode === room.puzzle.correct_answer) {
          status.innerHTML = `<span class="text-emerald-400 font-pixel text-[11px]">CRITICAL SUCCESS: PROJECT ZERO LOCKED DOWN! GRAND VICTORY!</span>`;
          this.addToInventory("Dr. Finch's Golden Master Keycard", room);
          this.onPuzzleSuccess(room, null);
          setTimeout(() => {
            this.openMissionBVictoryModal();
          }, 1500);
        } else {
          this.playSfx('error');
          status.innerHTML = `<span class="text-red-500 font-pixel text-[10px]">SYNTHESIS REJECTED: CODES DO NOT MATCH CRYO-REGISTERS</span>`;
        }
      });
    }

    /* =========================================================================
       10. DETECTIVE NOTEBOOK & 3-TIER HINTS
       ========================================================================= */
    openNotebookModal() {
      this.playSfx('click');
      const modal = document.getElementById('notebook-modal');
      const list = document.getElementById('notebook-list');
      if (!modal || !list) return;

      if (!this.state.notebook || this.state.notebook.length === 0) {
        list.innerHTML = `<p class="text-gray-400 font-terminal italic">&gt; No logs recorded yet. Inspect marked coordinates in rooms.</p>`;
      } else {
        list.innerHTML = this.state.notebook.map(entry => `
          <div class="bg-black/80 border border-gray-800 p-2.5 font-terminal text-sm space-y-1">
            <div class="flex justify-between items-center text-amber-400 font-pixel text-[8px] border-b border-gray-800 pb-1">
              <span>${entry.title}</span>
              <span class="text-gray-500">${entry.timestamp || ''} &bull; ${entry.room || ''}</span>
            </div>
            <div class="text-gray-300 italic text-xs">${entry.lore || ''}</div>
            ${entry.clue ? `<div class="text-amber-200 text-xs bg-gray-900/60 p-1.5 border-l-2 border-amber-500 font-bold">${entry.clue}</div>` : ''}
          </div>
        `).join('');
      }

      modal.classList.remove('hidden');
      this.activeModal = modal;
    }

    openHintModal() {
      this.playSfx('click');
      const room = this.getCurrentRoomData();
      if (!room || !room.hints) return;

      const modal = document.getElementById('hints-modal');
      const content = document.getElementById('hints-content');
      if (!modal || !content) return;

      content.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-md mx-auto text-left">
          <div class="flex items-center gap-2 border-b-2 border-emerald-900 pb-2">
            <i class="fa-solid fa-lightbulb text-emerald-400 text-lg"></i>
            <div>
              <span class="comic-caption-box text-emerald-400">FORENSIC HINT SYSTEM</span>
              <h3 class="font-pixel text-xs text-emerald-300 mt-1">${room.name.toUpperCase()}</h3>
            </div>
          </div>

          <!-- Tier 1 -->
          <div class="bg-black/80 border border-gray-800 p-3 space-y-1">
            <div class="font-pixel text-[9px] text-emerald-400">TIER 1: OBSERVATION NUDGE (FREE)</div>
            <p class="font-terminal text-sm text-gray-200">${room.hints.tier_1}</p>
          </div>

          <!-- Tier 2 -->
          <div class="bg-black/80 border border-gray-800 p-3 space-y-1">
            <div class="font-pixel text-[9px] text-amber-400">TIER 2: LOGICAL DEDUCTION (+1 HINT PENALTY)</div>
            <p class="font-terminal text-sm text-gray-200">${room.hints.tier_2}</p>
          </div>

          <!-- Tier 3 -->
          <div class="bg-black/80 border border-red-950 p-3 space-y-1">
            <div class="font-pixel text-[9px] text-red-400">TIER 3: EXPLICIT SOLUTION (+2 HINT PENALTY)</div>
            <p class="font-terminal text-sm text-red-200 font-bold">${room.hints.tier_3}</p>
          </div>

          <div class="flex justify-between items-center text-xs font-terminal text-gray-400 pt-2 border-t border-gray-800">
            <span>TOTAL HINTS REQUESTED: ${this.state.hintsUsed}</span>
            <button id="btn-request-hint-penalty" class="pixel-btn px-2 py-1 text-[8px] text-amber-400">LOG +1 HINT</button>
          </div>
        </div>
      `;

      content.querySelector('#btn-request-hint-penalty').addEventListener('click', () => {
        this.playSfx('blip');
        this.state.hintsUsed += 1;
        this.saveState();
        document.getElementById('hints-badge').textContent = `HINTS: ${this.state.hintsUsed}`;
        this.showToast('HINT LOGGED TO CASE SCORE');
      });

      modal.classList.remove('hidden');
      this.activeModal = modal;
    }

    /* =========================================================================
       11. FORENSIC MINI-GAMES: LOUPE & DARKROOM
       ========================================================================= */
    openLoupeViewer() {
      if (!window.HorrorAssets || !window.HorrorAssets.widgets) {
        this.showToast('LOUPE WIDGET NOT INITIALIZED');
        return;
      }
      this.playSfx('flashlight');
      window.HorrorAssets.widgets.openLoupeInspectionModal({
        imageSrc: './download (17).jpeg',
        title: 'FORENSIC EVIDENCE MAGNIFIER: CLASSROOM ROT',
        caption: '2.5x Loupe Magnifier: Scan the blood-splattered desks and chalkboard for hidden inscribed digits.',
        hiddenClues: [
          { x: 35, y: 48, label: 'SCRATCHED PERIOD NUMBER: 7' },
          { x: 72, y: 25, label: 'BLACKBOARD LATIN: BELL BEAST ABYSS' },
          { x: 18, y: 82, label: 'FALSE DRAWER BASE NOTCH' }
        ]
      });
    }

    openChemicalStation() {
      if (!window.HorrorAssets || !window.HorrorAssets.widgets) {
        this.showToast('DARKROOM WIDGET NOT INITIALIZED');
        return;
      }
      this.playSfx('click');
      window.HorrorAssets.widgets.openDarkroomDevelopingModal({
        polaroidImageSrc: './Dusty Photo Darkroom Crimson Glow Spooky Cartoon Aesthetics Wallpaper.jpeg',
        targetSecretCode: '738-PURGE-615',
        onComplete: (code) => {
          this.showToast(`POLAROID DEVELOPED! REVEALED CODE: ${code}`);
          this.addToInventory('Personnel File #615', this.getCurrentRoomData() || { name: 'Darkroom' });
        }
      });
    }

    /* =========================================================================
       12. MAP & MISSION SWITCHER MODALS
       ========================================================================= */
    openMapModal() {
      this.playSfx('click');
      const modal = document.getElementById('map-modal');
      const content = document.getElementById('map-content');
      if (!modal || !content) return;

      const missionA = window.HORROR_SPEC.missions.MISSION_A;
      const missionB = window.HORROR_SPEC.missions.MISSION_B;

      content.innerHTML = `
        <div class="comic-panel-noir p-4 space-y-4 max-w-2xl mx-auto text-left">
          <div class="flex items-center justify-between border-b-2 border-amber-900 pb-2">
            <div>
              <span class="comic-caption-box text-amber-400">BLACKWOOD HALL COMPLEX MAP</span>
              <h3 class="font-pixel text-xs text-amber-300 mt-1">16-ROOM EMERGENCY BLUEPRINT</h3>
            </div>
            <button id="btn-toggle-storymode" class="pixel-btn px-2 py-1 text-[8px] ${this.state.storyMode ? 'text-emerald-400 border-emerald-600' : 'text-gray-400'}">
              FREE-PLAY / STORY: ${this.state.storyMode ? 'ON' : 'OFF'}
            </button>
          </div>

          <!-- Mission A Grid -->
          <div class="space-y-2">
            <div class="font-pixel text-[10px] text-amber-400 border-b border-gray-800 pb-1">
              MISSION A: THE FORGOTTEN WING (ROOMS 1-8)
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${missionA.rooms.map((r, i) => {
                const isUnlocked = this.state.storyMode || this.state.unlockedRooms.includes(r.room_id);
                const isDone = this.state.completedRooms.includes(r.room_id);
                return `
                  <button class="p-2 border-2 text-left font-terminal text-xs transition-all ${isDone ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300' : isUnlocked ? 'border-amber-600 bg-black text-amber-200 hover:border-amber-400' : 'border-gray-800 bg-gray-950 text-gray-600 cursor-not-allowed'}" data-map-jump="MISSION_A" data-map-idx="${i}" ${isUnlocked ? '' : 'disabled'}>
                    <div class="font-pixel text-[8px] flex justify-between">
                      <span>RM 0${i + 1}</span>
                      <span>${isDone ? '✓' : isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
                    </div>
                    <div class="truncate mt-1">${r.name.replace(/^Room \d+:\s*/, '')}</div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Mission B Grid -->
          <div class="space-y-2 pt-2">
            <div class="font-pixel text-[10px] text-cyan-400 border-b border-gray-800 pb-1">
              MISSION B: PROJECT ZERO (ROOMS 1-8)
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${missionB.rooms.map((r, i) => {
                const isUnlocked = this.state.storyMode || this.state.unlockedRooms.includes(r.room_id);
                const isDone = this.state.completedRooms.includes(r.room_id);
                return `
                  <button class="p-2 border-2 text-left font-terminal text-xs transition-all ${isDone ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300' : isUnlocked ? 'border-cyan-600 bg-black text-cyan-200 hover:border-cyan-400' : 'border-gray-800 bg-gray-950 text-gray-600 cursor-not-allowed'}" data-map-jump="MISSION_B" data-map-idx="${i}" ${isUnlocked ? '' : 'disabled'}>
                    <div class="font-pixel text-[8px] flex justify-between">
                      <span>RM 0${i + 1}</span>
                      <span>${isDone ? '✓' : isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
                    </div>
                    <div class="truncate mt-1">${r.name.replace(/^Room \d+:\s*/, '')}</div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;

      // Jump click handlers
      content.querySelectorAll('[data-map-jump]').forEach(btn => {
        btn.addEventListener('click', () => {
          const mId = btn.getAttribute('data-map-jump');
          const idx = parseInt(btn.getAttribute('data-map-idx'));
          this.jumpToRoom(mId, idx);
        });
      });

      // Free-play toggle handler
      content.querySelector('#btn-toggle-storymode').addEventListener('click', () => {
        this.state.storyMode = !this.state.storyMode;
        this.saveState();
        this.openMapModal();
        this.showToast(this.state.storyMode ? 'FREE-PLAY MODE ACTIVATED: ALL ROOMS OPEN' : 'STORY MODE: PROGRESSION LOCKED');
      });

      modal.classList.remove('hidden');
      this.activeModal = modal;
    }

    openMissionSwitcherModal() {
      this.openMapModal();
    }

    /* =========================================================================
       13. VICTORY SCREENS (MISSION A & MISSION B)
       ========================================================================= */
    openMissionAVictoryModal() {
      const modal = document.getElementById('mission-a-victory-modal');
      if (!modal) return;
      this.playSfx('success');
      modal.classList.remove('hidden');
      this.activeModal = modal;

      const btnContinue = document.getElementById('btn-continue-mission-b');
      if (btnContinue) {
        btnContinue.onclick = () => {
          modal.classList.add('hidden');
          this.jumpToRoom('MISSION_B', 0);
          this.showToast('ENTERING SUBTERRANEAN PROJECT ZERO COMPLEX');
        };
      }
    }

    openMissionBVictoryModal() {
      const modal = document.getElementById('mission-b-victory-modal');
      if (!modal) return;
      this.playSfx('success');
      modal.classList.remove('hidden');
      this.activeModal = modal;

      const elapsedSec = Math.floor((Date.now() - this.state.startTime) / 1000);
      const mins = Math.floor(elapsedSec / 60);
      const secs = elapsedSec % 60;

      const timeEl = document.getElementById('victory-stat-time');
      const cluesEl = document.getElementById('victory-stat-clues');
      const hintsEl = document.getElementById('victory-stat-hints');
      const rankEl = document.getElementById('victory-stat-rank');

      if (timeEl) timeEl.textContent = `${mins}m ${secs}s`;
      if (cluesEl) cluesEl.textContent = `${this.state.notebook.length} / 16`;
      if (hintsEl) hintsEl.textContent = `${this.state.hintsUsed}`;

      // Calculate Rank
      let rank = 'S-RANK [MASTER DETECTIVE]';
      if (this.state.hintsUsed > 4) rank = 'A-RANK [SENIOR INVESTIGATOR]';
      if (this.state.hintsUsed > 8) rank = 'B-RANK [SURVIVOR]';
      if (rankEl) rankEl.textContent = rank;
    }

    /* =========================================================================
       14. GENERIC MODAL & TOAST MANAGERS
       ========================================================================= */
    openGenericModal(title, contentHtml) {
      const modal = document.getElementById('modal-container');
      const titleEl = document.getElementById('modal-title');
      const contentEl = document.getElementById('modal-content');
      if (!modal || !contentEl) return;

      if (titleEl) titleEl.textContent = title;
      contentEl.innerHTML = contentHtml;
      modal.classList.remove('hidden');
      this.activeModal = modal;
    }

    closeGenericModal() {
      const modal = document.getElementById('modal-container');
      if (modal) modal.classList.add('hidden');
      this.activeModal = null;
    }

    closeAllModals() {
      const modalIds = [
        'modal-container',
        'notebook-modal',
        'hints-modal',
        'map-modal',
        'puzzle-modal-container',
        'mission-a-victory-modal',
        'mission-b-victory-modal',
        'darkroom-dev-modal',
        'loupe-inspect-modal'
      ];
      modalIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });
      this.activeModal = null;
    }

    showToast(message) {
      const toast = document.getElementById('pixel-toast');
      const text = document.getElementById('pixel-toast-text');
      if (!toast || !text) return;

      text.textContent = message;
      toast.style.opacity = '1';
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.style.opacity = '0';
      }, 3500);
    }
  }

  // Initialize engine on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new HorrorEscapeEngine();
  });

})();
