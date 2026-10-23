/**
 * =============================================================================
 * ESCAPE PROTOCOL: HORROR & NOIR VISUAL ASSETS & AUDIO ENGINE
 * File: horror_visual_assets.js
 * 
 * Invokes the aesthetics of:
 *   1. 'download (17).jpeg' (Abandoned College Classroom: overturned desks, blood, torn curtains)
 *   2. 'Dusty Photo Darkroom Crimson Glow Spooky Cartoon Aesthetics Wallpaper.jpeg' (Crimson safe-lamp photo lab)
 *   3. 'NOIR CONFESSION - 1 Issue _ Art for Graphic Novel , Daniil jpegman Suponitskiy.gif' (90s Detective Noir office)
 * =============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HorrorAssets = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  /* ===========================================================================
     1. PROCEDURAL HORROR & NOIR WEB AUDIO ENGINE
     Zero external MP3 dependencies - 100% Web Audio API synthesizers
     =========================================================================== */
  class HorrorAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.darkroomHumGain = null;
      this.darkroomHumOsc1 = null;
      this.darkroomHumOsc2 = null;
      this.heartbeatTimer = null;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }

    ensureContext() {
      if (!this.ctx) this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    setMuted(muted) {
      this.isMuted = muted;
      if (this.darkroomHumGain && this.ctx) {
        this.darkroomHumGain.gain.setValueAtTime(muted ? 0 : 0.09, this.ctx.currentTime);
      }
    }

    /**
     * Heartbeat Thump ("lub-dub" double pulse)
     * Rate in BPM, intensity 0.0 - 1.0
     */
    playHeartbeat(bpm = 72, intensity = 1.0) {
      if (this.isMuted) return;
      this.ensureContext();
      const now = this.ctx.currentTime;
      const beatInterval = 60 / bpm;

      // Pulse 1: "Lub" (55 Hz low sub-thud)
      this._createHeartPulse(now, 55, 38, 0.14 * intensity, 0.16);

      // Pulse 2: "Dub" (slightly higher, quicker, +0.12s later)
      this._createHeartPulse(now + 0.12, 64, 42, 0.11 * intensity, 0.13);
    }

    _createHeartPulse(time, startFreq, endFreq, gainVal, duration) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, time);
      osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(gainVal, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + duration + 0.02);
    }

    /**
     * Geiger Counter / Radio Static Clicks
     * Emulates erratic ionizing radiation pops or paranormal EMF detector
     */
    playGeigerStatic(density = 16, durationSec = 0.5) {
      if (this.isMuted) return;
      this.ensureContext();
      const now = this.ctx.currentTime;

      for (let i = 0; i < density; i++) {
        const offset = Math.random() * durationSec;
        const clickTime = now + offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(1200 + Math.random() * 2400, clickTime);

        gain.gain.setValueAtTime(0.08, clickTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.008);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(clickTime);
        osc.stop(clickTime + 0.01);
      }
    }

    /**
     * Continuous 60Hz AC Electrical Hum & Safelight Ballast Drone
     */
    startDarkroomHum() {
      if (this.darkroomHumGain || this.isMuted) return;
      this.ensureContext();
      const now = this.ctx.currentTime;

      this.darkroomHumOsc1 = this.ctx.createOscillator();
      this.darkroomHumOsc2 = this.ctx.createOscillator();
      this.darkroomHumGain = this.ctx.createGain();

      // 60Hz American mains power hum
      this.darkroomHumOsc1.type = 'sawtooth';
      this.darkroomHumOsc1.frequency.setValueAtTime(60, now);

      // 120Hz fluorescent transformer buzz
      this.darkroomHumOsc2.type = 'sine';
      this.darkroomHumOsc2.frequency.setValueAtTime(120, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);

      this.darkroomHumOsc1.connect(filter);
      this.darkroomHumOsc2.connect(filter);
      filter.connect(this.darkroomHumGain);
      this.darkroomHumGain.connect(this.ctx.destination);

      this.darkroomHumGain.gain.setValueAtTime(this.isMuted ? 0 : 0.07, now);
      this.darkroomHumOsc1.start();
      this.darkroomHumOsc2.start();
    }

    stopDarkroomHum() {
      if (!this.darkroomHumGain) return;
      try {
        const now = this.ctx.currentTime;
        this.darkroomHumGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        setTimeout(() => {
          if (this.darkroomHumOsc1) { this.darkroomHumOsc1.stop(); this.darkroomHumOsc1.disconnect(); }
          if (this.darkroomHumOsc2) { this.darkroomHumOsc2.stop(); this.darkroomHumOsc2.disconnect(); }
          if (this.darkroomHumGain) { this.darkroomHumGain.disconnect(); }
          this.darkroomHumGain = null;
          this.darkroomHumOsc1 = null;
          this.darkroomHumOsc2 = null;
        }, 350);
      } catch (e) {
        this.darkroomHumGain = null;
      }
    }

    /**
     * Distant Metallic Squeal / Scraped Pipe Resonance
     */
    playMetallicSqueal() {
      if (this.isMuted) return;
      this.ensureContext();
      const now = this.ctx.currentTime;
      const duration = 1.4;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(320, now + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, now);
      filter.Q.setValueAtTime(8, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    }

    /**
     * Liquid Chemical Bath Splash & Bubbles
     */
    playChemicalDrip() {
      if (this.isMuted) return;
      this.ensureContext();
      const now = this.ctx.currentTime;

      // Pitch sweep bubble droplet
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    }

    /**
     * Mechanical Vintage SLR Camera Shutter Click
     */
    playCameraShutter() {
      if (this.isMuted) return;
      this.ensureContext();
      const now = this.ctx.currentTime;

      // Mirror slap (low thud)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.05);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // Shutter curtain slice (snappy noise)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(1600, now + 0.03);
      osc2.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain2.gain.setValueAtTime(0.18, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.03);
      osc2.stop(now + 0.09);
    }

    /**
     * Dissonant Horror Sting / Jump Scare Screech
     */
    playJumpScareSting() {
      if (this.isMuted) return;
      this.ensureContext();
      const now = this.ctx.currentTime;
      const duration = 1.2;

      // Tritone diminished chord: B4 (493.88 Hz), F5 (698.46 Hz), G#5 (830.61 Hz)
      const freqs = [493.88, 698.46, 830.61];
      freqs.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 1.05, now + duration);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.05);
      });
    }

    /**
     * Typewriter Clack & Carriage Bell
     */
    playTypewriterKey() {
      if (this.isMuted) return;
      this.ensureContext();
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700 + Math.random() * 300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }

    playCarriageReturn() {
      if (this.isMuted) return;
      this.ensureContext();
      const now = this.ctx.currentTime;

      // High crisp brass bell
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2489, now); // D#7

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    }

    playFlashlightClick() {
      if (this.isMuted) return;
      this.ensureContext();
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  }

  const horrorAudio = new HorrorAudioEngine();

  /* ===========================================================================
     2. SVG ROOM TEMPLATES & SCENE GENERATORS
     Matching the 3 User Reference Images with Pixel/Graphic Novel Cel-Shading
     =========================================================================== */

  /**
   * SCENE 1: ABANDONED COLLEGE CLASSROOM
   * Inspired by 'download (17).jpeg'
   * Features: Overturned student desks, bloody scratches on blackboard,
   * torn ragged curtains, gloomy overcast gothic window, grimy tiles.
   */
  function getClassroomSceneSVG(options = {}) {
    const {
      showBackdropPhoto = true,
      backdropOpacity = 0.38,
      bloodIntensity = 'high'
    } = options;

    return `
    <svg viewBox="0 0 320 180" class="w-full h-full" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Grimy Floor Gradient -->
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#14181a"/>
          <stop offset="100%" stop-color="#07090b"/>
        </linearGradient>

        <!-- Arched Window Rain Pattern -->
        <pattern id="rainPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <line x1="2" y1="0" x2="0" y2="10" stroke="#486581" stroke-width="0.8" opacity="0.6"/>
          <line x1="12" y1="5" x2="10" y2="18" stroke="#334e68" stroke-width="0.8" opacity="0.5"/>
        </pattern>
      </defs>

      <!-- Base Classroom Wall (Institutional Grimy Sage/Grey) -->
      <rect x="0" y="0" width="320" height="180" fill="#1b2421"/>
      
      ${showBackdropPhoto ? `
        <!-- Direct Reference Photo Integration: download (17).jpeg -->
        <image href="./download (17).jpeg" x="0" y="0" width="320" height="180" 
               preserveAspectRatio="xMidYMid slice" opacity="${backdropOpacity}" 
               style="mix-blend-mode: overlay; filter: contrast(125%) brightness(85%);" />
      ` : ''}

      <!-- Peeling Wallpaper & Exposed Brick Decals -->
      <path d="M0,0 L60,0 L45,35 L0,20 Z" fill="#3a1d17"/>
      <path d="M4,4 H20 M8,12 H28 M4,20 H24" stroke="#1d0d0a" stroke-width="2"/>
      <path d="M260,0 L320,0 L320,40 L280,25 Z" fill="#3a1d17"/>
      <path d="M285,6 H310 M275,15 H305" stroke="#1d0d0a" stroke-width="2"/>

      <!-- Gloomy Overcast Gothic Windows (Center-Left) -->
      <g id="window-bay">
        <!-- Window frame outer -->
        <rect x="25" y="15" width="65" height="95" fill="#080e14" stroke="#000" stroke-width="3"/>
        <!-- Window panes with rain -->
        <rect x="28" y="18" width="28" height="42" fill="#243b53"/>
        <rect x="58" y="18" width="28" height="42" fill="#1e3247"/>
        <rect x="28" y="63" width="28" height="44" fill="#182738"/>
        <rect x="58" y="63" width="28" height="44" fill="#14202e"/>
        <rect x="28" y="18" width="58" height="89" fill="url(#rainPattern)"/>
        <!-- Sills & Muntins -->
        <line x1="57" y1="18" x2="57" y2="107" stroke="#000" stroke-width="3"/>
        <line x1="28" y1="61" x2="86" y2="61" stroke="#000" stroke-width="3"/>
        <!-- Torn Ragged Curtains -->
        <path d="M23,15 Q35,50 24,115 L28,115 Q38,55 30,15 Z" fill="#4a3728" stroke="#000" stroke-width="1.5"/>
        <path d="M92,15 Q80,50 88,115 L83,115 Q75,55 86,15 Z" fill="#3e2e21" stroke="#000" stroke-width="1.5"/>
        <!-- Ragged rips in curtain -->
        <line x1="25" y1="60" x2="29" y2="65" stroke="#1a120b" stroke-width="1"/>
        <line x1="26" y1="90" x2="31" y2="96" stroke="#1a120b" stroke-width="1"/>
      </g>

      <!-- Smashed Blackboard (Center-Right) -->
      <g id="classroom-blackboard">
        <!-- Wood frame with solid black comic stroke -->
        <rect x="110" y="20" width="195" height="80" fill="#2d1c12" stroke="#000" stroke-width="3"/>
        <!-- Slate blackboard surface -->
        <rect x="115" y="24" width="185" height="72" fill="#15261d"/>
        <!-- Blackboard chalk chalkings & formulas -->
        <text x="122" y="42" fill="#8ba695" font-family="monospace" font-size="7" font-weight="bold">PROJECT ZERO: EXP 09-B</text>
        <text x="122" y="54" fill="#587363" font-family="monospace" font-size="6">t = [v_0 / g] * sin(theta)</text>
        <text x="122" y="65" fill="#587363" font-family="monospace" font-size="6">CLEARANCE CODE: [ _ _ _ ]</text>
        
        <!-- Chalkboard Bloody Scrawl & Handprint -->
        <text x="180" y="55" fill="#ff2a2a" font-family="'Courier New', monospace" font-size="11" font-weight="bold" transform="rotate(-4 180 55)">RUN AWAY</text>
        <!-- Bloody handprint decal -->
        <path d="M260,35 C263,30 268,32 268,38 C270,30 274,31 274,39 C277,32 281,34 280,41 L278,50 C276,55 264,55 262,48 Z" fill="#8b0000" opacity="0.88"/>
        <!-- Blood Drips from blackboard frame -->
        <path d="M140,96 L140,118 L142,118 L142,96 Z" fill="#8b0000"/>
        <circle cx="141" cy="120" r="1.8" fill="#8b0000"/>
        <path d="M210,96 L210,112 L211.5,112 L211.5,96 Z" fill="#8b0000"/>
      </g>

      <!-- Classroom Floor Boundary Line -->
      <polygon points="0,115 320,115 320,180 0,180" fill="url(#floorGrad)"/>
      <line x1="0" y1="115" x2="320" y2="115" stroke="#000" stroke-width="4"/>

      <!-- Desks: Overturned & Smashed (Directly from download (17).jpeg) -->
      <!-- Overturned Desk 1 (Foreground Left) -->
      <g id="overturned-desk-left" transform="translate(10, 110) rotate(16)">
        <!-- Cast iron desk legs sticking in the air -->
        <line x1="15" y1="10" x2="8" y2="-15" stroke="#000" stroke-width="4"/>
        <line x1="15" y1="10" x2="8" y2="-15" stroke="#374151" stroke-width="2.5"/>
        <line x1="45" y1="12" x2="52" y2="-12" stroke="#000" stroke-width="4"/>
        <line x1="45" y1="12" x2="52" y2="-12" stroke="#374151" stroke-width="2.5"/>
        <!-- Desk wooden surface tilted -->
        <polygon points="5,8 60,10 52,28 0,25" fill="#5c3a21" stroke="#000" stroke-width="3"/>
        <polygon points="8,11 56,13 50,25 4,23" fill="#85532f"/>
        <!-- Open book & scattered test papers spilled on floor -->
        <polygon points="40,22 55,24 53,32 38,30" fill="#ded5bf" stroke="#000" stroke-width="1.5"/>
      </g>

      <!-- Upright Desolate Desk 2 (Center) -->
      <g id="desk-center" transform="translate(125, 120)">
        <!-- Desk legs -->
        <line x1="10" y1="15" x2="10" y2="45" stroke="#000" stroke-width="3"/>
        <line x1="60" y1="15" x2="60" y2="45" stroke="#000" stroke-width="3"/>
        <!-- Desk top -->
        <rect x="0" y="5" width="70" height="14" fill="#6d4327" stroke="#000" stroke-width="3"/>
        <rect x="3" y="7" width="64" height="6" fill="#8f5b35"/>
        <!-- Desk shelf cubby with hidden clue book -->
        <rect x="5" y="19" width="60" height="12" fill="#231710" stroke="#000" stroke-width="2"/>
        <rect x="12" y="21" width="22" height="8" fill="#992222" stroke="#000" stroke-width="1.5"/>
        <!-- Blood stain on desk corner -->
        <path d="M55,6 C58,10 65,12 68,6 Z" fill="#8b0000"/>
      </g>

      <!-- Overturned Desk 3 (Foreground Right) -->
      <g id="overturned-desk-right" transform="translate(240, 125) rotate(-22)">
        <polygon points="0,5 65,8 58,24 0,20" fill="#4d2f1a" stroke="#000" stroke-width="3"/>
        <line x1="10" y1="5" x2="5" y2="-20" stroke="#000" stroke-width="3.5"/>
        <line x1="55" y1="8" x2="62" y2="-18" stroke="#000" stroke-width="3.5"/>
      </g>

      <!-- Puddles of Dark Stagnant Water / Blood on floor -->
      <ellipse cx="90" cy="160" rx="35" ry="8" fill="#100304" stroke="#3a0808" stroke-width="1.5"/>
      <ellipse cx="210" cy="168" rx="28" ry="6" fill="#080c10" stroke="#1e293b" stroke-width="1.5"/>

      <!-- Ceiling Flickering Fluorescent Tube Fixture -->
      <g id="ceiling-lamp" class="fluorescent-flicker">
        <line x1="120" y1="0" x2="120" y2="12" stroke="#000" stroke-width="2"/>
        <line x1="200" y1="0" x2="200" y2="12" stroke="#000" stroke-width="2"/>
        <rect x="100" y="10" width="120" height="6" fill="#1f2937" stroke="#000" stroke-width="2"/>
        <rect x="105" y="14" width="110" height="3" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.5"/>
      </g>
    </svg>
    `;
  }

  /**
   * SCENE 2: DUSTY CRIMSON PHOTO DARKROOM
   * Inspired by 'Dusty Photo Darkroom Crimson Glow Spooky Cartoon Aesthetics Wallpaper.jpeg'
   * Features: Deep crimson fluorescent safe-light fixtures, drying crime photos on twine,
   * 3 chemical developing trays (DEVELOPER, STOP BATH, FIXER), vintage enlarger, red clock.
   */
  function getDarkroomSceneSVG(options = {}) {
    const {
      showBackdropPhoto = true,
      backdropOpacity = 0.42,
      trayStage = 'developer'
    } = options;

    return `
    <svg viewBox="0 0 320 180" class="w-full h-full" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Deep Crimson Safelight Cone Gradient -->
        <radialGradient id="crimsonSafelight" cx="50%" cy="10%" r="80%">
          <stop offset="0%" stop-color="#ff3333" stop-opacity="0.85"/>
          <stop offset="40%" stop-color="#aa0000" stop-opacity="0.55"/>
          <stop offset="85%" stop-color="#2a0004" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#0d0102" stop-opacity="0.98"/>
        </radialGradient>

        <linearGradient id="chemicalLiquidDev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d97706" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#78350f" stop-opacity="0.95"/>
        </linearGradient>

        <linearGradient id="chemicalLiquidStop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0284c7" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#0369a1" stop-opacity="0.95"/>
        </linearGradient>

        <linearGradient id="chemicalLiquidFix" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#059669" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#064e3b" stop-opacity="0.95"/>
        </linearGradient>
      </defs>

      <!-- Base Crimson Void Background -->
      <rect x="0" y="0" width="320" height="180" fill="url(#crimsonSafelight)"/>

      ${showBackdropPhoto ? `
        <!-- Direct Reference Photo Integration: Dusty Photo Darkroom Crimson Glow Wallpaper.jpeg -->
        <image href="./Dusty Photo Darkroom Crimson Glow Spooky Cartoon Aesthetics Wallpaper.jpeg" 
               x="0" y="0" width="320" height="180" preserveAspectRatio="xMidYMid slice" 
               opacity="${backdropOpacity}" style="mix-blend-mode: color-dodge; filter: contrast(140%) saturate(160%);" />
      ` : ''}

      <!-- Ceiling Safelight Fixture (Bright Red Fluorescent Tube) -->
      <g id="safelight-tube-fixture">
        <line x1="80" y1="0" x2="80" y2="14" stroke="#000" stroke-width="2"/>
        <line x1="240" y1="0" x2="240" y2="14" stroke="#000" stroke-width="2"/>
        <rect x="60" y="12" width="200" height="10" fill="#140203" stroke="#000" stroke-width="3"/>
        <!-- Glowing Red Tube with Safelight Hum -->
        <rect x="68" y="18" width="184" height="5" fill="#ff4d4d" stroke="#ff0000" stroke-width="1.5" class="safelight-tube"/>
      </g>

      <!-- Photographic Enlarger Machine (Left Side) -->
      <g id="photo-enlarger" transform="translate(18, 30)">
        <!-- Heavy vertical support column -->
        <line x1="25" y1="10" x2="25" y2="90" stroke="#000" stroke-width="5"/>
        <line x1="25" y1="10" x2="25" y2="90" stroke="#4b5563" stroke-width="3"/>
        <!-- Bellows & Lamp House -->
        <polygon points="12,15 38,15 34,42 16,42" fill="#1f0305" stroke="#000" stroke-width="3"/>
        <!-- Glowing red condenser head -->
        <circle cx="25" cy="15" r="9" fill="#ff1a1a" stroke="#000" stroke-width="2"/>
        <!-- Lens projection cone downward -->
        <polygon points="18,42 32,42 45,95 5,95" fill="#ff2a2a" opacity="0.15"/>
        <!-- Enlarger easel base board -->
        <rect x="5" y="90" width="40" height="8" fill="#ded5bf" stroke="#000" stroke-width="2.5"/>
      </g>

      <!-- Twine Wire Line with Clothespins & Hanging Polaroids -->
      <g id="twine-drying-line">
        <!-- Wire string curve -->
        <path d="M0,45 Q160,54 320,46" stroke="#5a3d28" stroke-width="2" fill="none"/>
        <path d="M0,45 Q160,54 320,46" stroke="#000" stroke-width="0.8" fill="none"/>

        <!-- Hanging Polaroid 1 (Crime Scene Victim / Locker 204) -->
        <g transform="translate(75, 48) rotate(-4)">
          <!-- Wooden clothespin -->
          <rect x="13" y="-6" width="5" height="12" fill="#c2914d" stroke="#000" stroke-width="1.5"/>
          <!-- Polaroid card body -->
          <rect x="0" y="4" width="32" height="42" fill="#f7f2e7" stroke="#000" stroke-width="2.5"/>
          <!-- Photo square inside -->
          <rect x="3" y="7" width="26" height="26" fill="#1f0406" stroke="#000" stroke-width="1.5"/>
          <!-- Photo subject: Lockers silhouette -->
          <rect x="6" y="10" width="8" height="20" fill="#aa0000"/>
          <text x="5" y="41" fill="#111" font-family="'Courier New', monospace" font-size="4.5" font-weight="bold">#204-DIAL</text>
        </g>

        <!-- Hanging Polaroid 2 (Bloody Handprint / Classroom Clue) -->
        <g transform="translate(145, 50) rotate(3)">
          <rect x="13" y="-6" width="5" height="12" fill="#c2914d" stroke="#000" stroke-width="1.5"/>
          <rect x="0" y="4" width="32" height="42" fill="#f7f2e7" stroke="#000" stroke-width="2.5"/>
          <rect x="3" y="7" width="26" height="26" fill="#140203" stroke="#000" stroke-width="1.5"/>
          <!-- Handprint glyph -->
          <circle cx="16" cy="18" r="4.5" fill="#ff1a1a"/>
          <line x1="14" y1="13" x2="13" y2="9" stroke="#ff1a1a" stroke-width="1.5"/>
          <line x1="16" y1="13" x2="16" y2="8" stroke="#ff1a1a" stroke-width="1.5"/>
          <line x1="18" y1="13" x2="19" y2="9" stroke="#ff1a1a" stroke-width="1.5"/>
          <text x="5" y="41" fill="#111" font-family="'Courier New', monospace" font-size="4.5" font-weight="bold">STAGE_01</text>
        </g>

        <!-- Hanging Polaroid 3 (Confession Letter Fragment) -->
        <g transform="translate(215, 49) rotate(-2)">
          <rect x="13" y="-6" width="5" height="12" fill="#c2914d" stroke="#000" stroke-width="1.5"/>
          <rect x="0" y="4" width="32" height="42" fill="#f7f2e7" stroke="#000" stroke-width="2.5"/>
          <rect x="3" y="7" width="26" height="26" fill="#0c0e14" stroke="#000" stroke-width="1.5"/>
          <line x1="6" y1="12" x2="26" y2="12" stroke="#e2e8f0" stroke-width="1.2"/>
          <line x1="6" y1="16" x2="22" y2="16" stroke="#e2e8f0" stroke-width="1.2"/>
          <line x1="6" y1="20" x2="24" y2="20" stroke="#e2e8f0" stroke-width="1.2"/>
          <text x="6" y="41" fill="#880000" font-family="'Courier New', monospace" font-size="4.5" font-weight="bold">CIPHER</text>
        </g>
      </g>

      <!-- Digital Crimson Darkroom Timer Clock (Top Right) -->
      <g id="darkroom-timer" transform="translate(268, 14)">
        <rect x="0" y="0" width="44" height="20" fill="#080001" stroke="#000" stroke-width="2"/>
        <text x="5" y="15" fill="#ff2a2a" font-family="'Courier New', monospace" font-size="11" font-weight="bold" class="glow-red">03:45</text>
      </g>

      <!-- Chemical Development Countertop (Bottom Section) -->
      <g id="darkroom-chemical-bench">
        <!-- Counter surface -->
        <rect x="0" y="115" width="320" height="65" fill="#0a0506" stroke="#000" stroke-width="3"/>
        <line x1="0" y1="115" x2="320" y2="115" stroke="#ff2a2a" stroke-width="2"/>

        <!-- TRAY 1: DEVELOPER (Left) -->
        <g id="tray-developer-svg" transform="translate(18, 122)">
          <rect x="0" y="0" width="82" height="50" rx="3" fill="#1b120c" stroke="#000" stroke-width="2.5"/>
          <!-- Liquid amber bath -->
          <rect x="4" y="6" width="74" height="40" fill="url(#chemicalLiquidDev)" stroke="#000" stroke-width="1"/>
          <!-- Tray label plate -->
          <rect x="18" y="40" width="46" height="8" fill="#000" rx="1"/>
          <text x="21" y="46" fill="#f59e0b" font-family="monospace" font-size="5.5" font-weight="bold">1. DEVELOPER</text>
          <!-- Floating photographic paper dipped -->
          <rect x="15" y="12" width="50" height="24" fill="#eed9b3" stroke="#000" stroke-width="1.5" opacity="0.85"/>
        </g>

        <!-- TRAY 2: STOP BATH (Center) -->
        <g id="tray-stopbath-svg" transform="translate(118, 122)">
          <rect x="0" y="0" width="82" height="50" rx="3" fill="#0b1724" stroke="#000" stroke-width="2.5"/>
          <!-- Azure liquid bath -->
          <rect x="4" y="6" width="74" height="40" fill="url(#chemicalLiquidStop)" stroke="#000" stroke-width="1"/>
          <rect x="18" y="40" width="46" height="8" fill="#000" rx="1"/>
          <text x="21" y="46" fill="#38bdf8" font-family="monospace" font-size="5.5" font-weight="bold">2. STOP BATH</text>
        </g>

        <!-- TRAY 3: FIXER (Right) -->
        <g id="tray-fixer-svg" transform="translate(218, 122)">
          <rect x="0" y="0" width="82" height="50" rx="3" fill="#0c1e14" stroke="#000" stroke-width="2.5"/>
          <!-- Emerald chemical liquid -->
          <rect x="4" y="6" width="74" height="40" fill="url(#chemicalLiquidFix)" stroke="#000" stroke-width="1"/>
          <rect x="22" y="40" width="38" height="8" fill="#000" rx="1"/>
          <text x="26" y="46" fill="#4ade80" font-family="monospace" font-size="5.5" font-weight="bold">3. FIXER</text>
        </g>

        <!-- Tongs on counter -->
        <line x1="105" y1="130" x2="112" y2="165" stroke="#9ca3af" stroke-width="2"/>
        <line x1="108" y1="130" x2="114" y2="165" stroke="#000" stroke-width="1"/>
      </g>
    </svg>
    `;
  }

  /**
   * SCENE 3: 90s NOIR INVESTIGATOR / PROFESSOR OFFICE
   * Inspired by 'NOIR CONFESSION - 1 Issue _ Art for Graphic Novel , Daniil jpegman Suponitskiy.gif'
   * Features: Slanted venetian blind shadows slicing across the mahogany desk,
   * green banker's desk lamp, mechanical typewriter, cigarette smoke, scattered case files.
   */
  function getNoirOfficeSceneSVG(options = {}) {
    const {
      showBackdropPhoto = true,
      backdropOpacity = 0.38,
      confessionNoteText = 'THE ARCHIVE IS SEALED IN 204'
    } = options;

    return `
    <svg viewBox="0 0 320 180" class="w-full h-full" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Banker's Lamp Emerald Glow -->
        <radialGradient id="bankerGlow" cx="20%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.6"/>
          <stop offset="35%" stop-color="#15803d" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#021f0f" stop-opacity="0"/>
        </radialGradient>

        <!-- Venetian Blind Slatted Shadow Mask -->
        <pattern id="venetianSlats" width="20" height="30" patternTransform="rotate(-35 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="14" stroke="#000" stroke-width="14" opacity="0.68"/>
        </pattern>
      </defs>

      <!-- Charcoal Noir Wallpaper Wall -->
      <rect x="0" y="0" width="320" height="180" fill="#0d1117"/>

      ${showBackdropPhoto ? `
        <!-- Direct Reference Photo Integration: NOIR CONFESSION .gif -->
        <image href="./NOIR CONFESSION - 1 Issue _ Art for Graphic Novel , Daniil jpegman Suponitskiy.gif" 
               x="0" y="0" width="320" height="180" preserveAspectRatio="xMidYMid slice" 
               opacity="${backdropOpacity}" style="mix-blend-mode: luminosity; filter: contrast(135%) brightness(88%);" />
      ` : ''}

      <!-- Wall Picture Frame: Detective Conspiracy Corkboard with Red Thread -->
      <g id="conspiracy-board" transform="translate(185, 18)">
        <rect x="0" y="0" width="115" height="60" fill="#a87948" stroke="#000" stroke-width="3"/>
        <!-- Cork surface -->
        <rect x="3" y="3" width="109" height="54" fill="#c4975f"/>
        <!-- Suspect mugshots -->
        <rect x="12" y="8" width="18" height="22" fill="#fff" stroke="#000" stroke-width="1.5"/>
        <rect x="14" y="10" width="14" height="14" fill="#333"/>
        <rect x="75" y="10" width="18" height="22" fill="#fff" stroke="#000" stroke-width="1.5"/>
        <rect x="77" y="12" width="14" height="14" fill="#444"/>
        <rect x="44" y="28" width="22" height="24" fill="#fff" stroke="#000" stroke-width="1.5"/>
        <text x="46" y="42" fill="#990000" font-family="monospace" font-size="4" font-weight="bold">TARGET</text>
        <!-- Red Thread Connecting Evidence -->
        <line x1="22" y1="20" x2="52" y2="35" stroke="#ff0000" stroke-width="1.5"/>
        <line x1="84" y1="20" x2="56" y2="35" stroke="#ff0000" stroke-width="1.5"/>
      </g>

      <!-- Mahogany Executive Desk (Center-Foreground) -->
      <g id="noir-desk">
        <polygon points="0,95 320,95 320,180 0,180" fill="#221510"/>
        <line x1="0" y1="95" x2="320" y2="95" stroke="#000" stroke-width="4"/>
        <rect x="10" y="102" width="300" height="6" fill="#3d261c"/>
      </g>

      <!-- Slanted Venetian Blind Shadows Over Entire Room -->
      <rect x="0" y="0" width="320" height="180" fill="url(#venetianSlats)" style="pointer-events:none; mix-blend-mode: multiply;"/>

      <!-- Classic Banker's Desk Lamp (Foreground Left) -->
      <g id="bankers-lamp" transform="translate(30, 68)">
        <!-- Emerald light cone -->
        <circle cx="35" cy="20" r="60" fill="url(#bankerGlow)" style="pointer-events:none;"/>
        <!-- Brass base -->
        <ellipse cx="35" cy="48" rx="14" ry="4" fill="#b4832c" stroke="#000" stroke-width="2.5"/>
        <line x1="35" y1="48" x2="35" y2="22" stroke="#b4832c" stroke-width="5"/>
        <line x1="35" y1="48" x2="35" y2="22" stroke="#000" stroke-width="1"/>
        <!-- Green Glass Hood -->
        <path d="M15,22 C15,10 55,10 55,22 Z" fill="#15803d" stroke="#000" stroke-width="3"/>
        <path d="M18,20 C18,12 52,12 52,20 Z" fill="#22c55e"/>
        <!-- Golden pull chain -->
        <line x1="48" y1="22" x2="48" y2="36" stroke="#fbbf24" stroke-width="1.5"/>
        <circle cx="48" cy="38" r="1.5" fill="#fbbf24" stroke="#000" stroke-width="0.8"/>
      </g>

      <!-- Mechanical Typewriter (Center Desk) -->
      <g id="noir-typewriter" transform="translate(110, 102)">
        <!-- Heavy cast-metal typewriter chassis -->
        <polygon points="10,25 75,25 80,55 5,55" fill="#1e222b" stroke="#000" stroke-width="3"/>
        <!-- Mechanical keys stepped rows -->
        <rect x="15" y="42" width="55" height="10" fill="#0f1117" stroke="#000" stroke-width="1.5"/>
        <line x1="20" y1="45" x2="65" y2="45" stroke="#9ca3af" stroke-width="1" stroke-dasharray="2,2"/>
        <line x1="18" y1="48" x2="67" y2="48" stroke="#9ca3af" stroke-width="1" stroke-dasharray="2,2"/>
        <!-- Paper carriage roll -->
        <rect x="12" y="18" width="62" height="9" fill="#374151" stroke="#000" stroke-width="2"/>
        <!-- Stamped Confession Sheet emerging from carriage -->
        <polygon points="18,-10 66,-10 66,18 18,18" fill="#f5eedc" stroke="#000" stroke-width="2"/>
        <!-- Typed ink lines on paper -->
        <text x="22" y="-2" fill="#111" font-family="'Courier New', monospace" font-size="4.2" font-weight="bold">CONFESSION:</text>
        <text x="22" y="5" fill="#111" font-family="'Courier New', monospace" font-size="3.5">${confessionNoteText.substring(0, 20)}</text>
        <text x="22" y="11" fill="#8b0000" font-family="'Courier New', monospace" font-size="3.5" font-weight="bold">PIN: [ 4 - 9 - 2 ]</text>
      </g>

      <!-- Heavy Glass Ashtray with Lit Cigarette & Curling Smoke -->
      <g id="ashtray-smoke" transform="translate(205, 128)">
        <ellipse cx="14" cy="10" rx="14" ry="7" fill="#475569" stroke="#000" stroke-width="2"/>
        <ellipse cx="14" cy="9" rx="10" ry="4" fill="#1e293b"/>
        <!-- Lit cigarette -->
        <line x1="12" y1="8" x2="26" y2="4" stroke="#ffffff" stroke-width="2"/>
        <circle cx="27" cy="3.5" r="1.2" fill="#ef4444"/>
        <!-- Animated curling smoke trail -->
        <path d="M27,3 Q32,-15 25,-30 T30,-50" stroke="#cbd5e1" stroke-width="1.5" fill="none" opacity="0.6" stroke-linecap="round"/>
      </g>

      <!-- Vintage Rotary Telephone (Desk Right) -->
      <g id="rotary-phone" transform="translate(245, 105)">
        <polygon points="12,18 42,18 46,45 8,45" fill="#0f1117" stroke="#000" stroke-width="3"/>
        <circle cx="27" cy="32" r="9" fill="#e5e7eb" stroke="#000" stroke-width="2"/>
        <circle cx="27" cy="32" r="3" fill="#0f1117"/>
        <!-- Handset cradle -->
        <polygon points="2,14 52,14 48,6 6,6" fill="#1f242d" stroke="#000" stroke-width="2.5"/>
      </g>

      <!-- Detective Case Files Dossiers (Desk Left) -->
      <g id="case-dossier" transform="translate(18, 125) rotate(-10)">
        <polygon points="0,0 45,5 40,32 0,26" fill="#ded5bf" stroke="#000" stroke-width="2"/>
        <polygon points="2,2 43,7 39,30 2,24" fill="#eed9b3"/>
        <!-- Red "RESTRICTED" Stamp -->
        <rect x="8" y="10" width="26" height="8" fill="none" stroke="#b91c1c" stroke-width="1.5" transform="rotate(-6 8 10)"/>
        <text x="10" y="16" fill="#b91c1c" font-family="'Courier New', monospace" font-size="4.5" font-weight="bold" transform="rotate(-6 8 10)">TOP SECRET</text>
      </g>
    </svg>
    `;
  }

  /**
   * SCENE 4: RESTRICTED COLLEGE LIBRARY / ARCHIVES
   * Based on Room 04 Questionnaire (ordering books, carved reading desk)
   */
  function getLibraryHorrorSVG(options = {}) {
    return `
    <svg viewBox="0 0 320 180" class="w-full h-full" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <!-- Deep Archival Wood Wall -->
      <rect x="0" y="0" width="320" height="180" fill="#0e0c0a"/>
      
      <!-- Towering Bookshelves (Left & Right) -->
      <g id="left-bookshelf">
        <rect x="5" y="5" width="85" height="145" fill="#2d1c12" stroke="#000" stroke-width="3"/>
        <!-- Shelves -->
        <line x1="5" y1="35" x2="90" y2="35" stroke="#000" stroke-width="2.5"/>
        <line x1="5" y1="70" x2="90" y2="70" stroke="#000" stroke-width="2.5"/>
        <line x1="5" y1="105" x2="90" y2="105" stroke="#000" stroke-width="2.5"/>
        <line x1="5" y1="140" x2="90" y2="140" stroke="#000" stroke-width="2.5"/>
        <!-- Books row 1 -->
        <rect x="10" y="10" width="8" height="25" fill="#7f1d1d" stroke="#000" stroke-width="1.5"/>
        <rect x="19" y="12" width="7" height="23" fill="#1e3a8a" stroke="#000" stroke-width="1.5"/>
        <rect x="27" y="8" width="9" height="27" fill="#b45309" stroke="#000" stroke-width="1.5"/>
        <rect x="37" y="14" width="6" height="21" fill="#14532d" stroke="#000" stroke-width="1.5"/>
        <rect x="44" y="11" width="8" height="24" fill="#374151" stroke="#000" stroke-width="1.5"/>
        <!-- Secret Word Book with Golden Roman Numeral -->
        <rect x="53" y="7" width="10" height="28" fill="#581c87" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="56" y="24" fill="#fbbf24" font-family="serif" font-size="6" font-weight="bold">IV</text>
      </g>

      <!-- Center Gothic Stained Glass Window -->
      <g id="gothic-window" transform="translate(125, 10)">
        <path d="M0,80 L0,35 Q35,0 70,35 L70,80 Z" fill="#111827" stroke="#000" stroke-width="3"/>
        <path d="M5,77 L5,36 Q35,5 65,36 L65,77 Z" fill="#1e293b"/>
        <!-- Stained glass red & gold cross panes -->
        <circle cx="35" cy="35" r="14" fill="#991b1b" stroke="#000" stroke-width="2"/>
        <line x1="35" y1="5" x2="35" y2="77" stroke="#000" stroke-width="2.5"/>
        <line x1="5" y1="45" x2="65" y2="45" stroke="#000" stroke-width="2.5"/>
      </g>

      <!-- Right Bookshelf -->
      <g id="right-bookshelf" transform="translate(230, 5)">
        <rect x="0" y="0" width="85" height="145" fill="#2d1c12" stroke="#000" stroke-width="3"/>
        <line x1="0" y1="35" x2="85" y2="35" stroke="#000" stroke-width="2.5"/>
        <line x1="0" y1="70" x2="85" y2="70" stroke="#000" stroke-width="2.5"/>
        <line x1="0" y1="105" x2="85" y2="105" stroke="#000" stroke-width="2.5"/>
        <line x1="0" y1="140" x2="85" y2="140" stroke="#000" stroke-width="2.5"/>
        <!-- Books row -->
        <rect x="8" y="10" width="8" height="25" fill="#047857" stroke="#000" stroke-width="1.5"/>
        <rect x="17" y="7" width="9" height="28" fill="#831843" stroke="#000" stroke-width="1.5"/>
        <rect x="27" y="12" width="7" height="23" fill="#1e293b" stroke="#000" stroke-width="1.5"/>
        <rect x="35" y="9" width="8" height="26" fill="#b45309" stroke="#000" stroke-width="1.5"/>
      </g>

      <!-- Heavy Librarian Reading Desk (Center Foreground) -->
      <g id="librarian-desk" transform="translate(90, 115)">
        <polygon points="5,5 135,5 140,55 0,55" fill="#3b2112" stroke="#000" stroke-width="3.5"/>
        <polygon points="10,8 130,8 135,22 5,22" fill="#54301a"/>
        <!-- Carved cipher clue on desk wooden leg -->
        <rect x="10" y="24" width="12" height="30" fill="#231309" stroke="#000" stroke-width="2"/>
        <text x="13" y="42" fill="#c2914d" font-family="monospace" font-size="5" font-weight="bold">VII</text>
        <!-- Ancient Tome Open with candle -->
        <polygon points="45,10 75,10 72,20 42,20" fill="#ded5bf" stroke="#000" stroke-width="1.5"/>
        <polygon points="75,10 105,10 102,20 72,20" fill="#ded5bf" stroke="#000" stroke-width="1.5"/>
        <!-- Brass candlestick with flickering candle flame -->
        <ellipse cx="28" cy="16" rx="5" ry="2" fill="#fbbf24" stroke="#000" stroke-width="1"/>
        <line x1="28" y1="16" x2="28" y2="8" stroke="#fef08a" stroke-width="2"/>
        <circle cx="28" cy="6" r="2.5" fill="#f97316"/>
      </g>
    </svg>
    `;
  }

  /**
   * SCENE 5: CORRODED LOCKER ROW & EMERGENCY BULKHEAD
   * Based on Room 02 Questionnaire (combination lock 204, torn timetable, scratches)
   */
  function getLockerRowHorrorSVG(options = {}) {
    return `
    <svg viewBox="0 0 320 180" class="w-full h-full" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <!-- Dark Corroded Hallway Wall -->
      <rect x="0" y="0" width="320" height="180" fill="#0d1416"/>
      
      <!-- Locker Bank (Institutional Military Olive / Slate Green) -->
      <g id="locker-row-bank" transform="translate(15, 20)">
        <!-- Locker 201 -->
        <rect x="0" y="0" width="32" height="115" fill="#1b2a26" stroke="#000" stroke-width="3"/>
        <line x1="8" y1="12" x2="24" y2="12" stroke="#000" stroke-width="2"/>
        <line x1="8" y1="17" x2="24" y2="17" stroke="#000" stroke-width="2"/>
        <circle cx="25" cy="58" r="2.5" fill="#9ca3af" stroke="#000" stroke-width="1.5"/>
        <text x="8" y="32" fill="#64748b" font-family="monospace" font-size="6" font-weight="bold">201</text>

        <!-- Locker 202 -->
        <rect x="32" y="0" width="32" height="115" fill="#1e302b" stroke="#000" stroke-width="3"/>
        <line x1="40" y1="12" x2="56" y2="12" stroke="#000" stroke-width="2"/>
        <line x1="40" y1="17" x2="56" y2="17" stroke="#000" stroke-width="2"/>
        <circle cx="57" cy="58" r="2.5" fill="#9ca3af" stroke="#000" stroke-width="1.5"/>
        <text x="40" y="32" fill="#64748b" font-family="monospace" font-size="6" font-weight="bold">202</text>

        <!-- Locker 203 (Dented) -->
        <rect x="64" y="0" width="32" height="115" fill="#172421" stroke="#000" stroke-width="3"/>
        <line x1="72" y1="12" x2="88" y2="12" stroke="#000" stroke-width="2"/>
        <circle cx="89" cy="58" r="2.5" fill="#9ca3af" stroke="#000" stroke-width="1.5"/>
        <text x="72" y="32" fill="#64748b" font-family="monospace" font-size="6" font-weight="bold">203</text>

        <!-- Locker 204: TARGET LOCKER (Ajar with Bloody Handprint & Red Glow Inside) -->
        <g id="locker-204-target">
          <rect x="96" y="0" width="32" height="115" fill="#080001" stroke="#000" stroke-width="3"/>
          <!-- Glowing red interior seam -->
          <line x1="124" y1="2" x2="124" y2="113" stroke="#ff2a2a" stroke-width="3" class="glow-red"/>
          <text x="102" y="32" fill="#ef4444" font-family="monospace" font-size="6" font-weight="bold">204</text>
          <!-- Combination Tumbler Padlock -->
          <circle cx="118" cy="58" r="4.5" fill="#d97706" stroke="#000" stroke-width="2"/>
          <circle cx="118" cy="58" r="2" fill="#000"/>
          <!-- Bloody Handprint Dripping Down -->
          <path d="M102,40 C106,36 112,38 112,45 C114,37 118,39 117,47 L114,56 C112,62 100,60 99,52 Z" fill="#8b0000" opacity="0.9"/>
          <path d="M103,58 L103,78" stroke="#8b0000" stroke-width="1.8"/>
        </g>
      </g>

      <!-- Sealed Bulkhead Door (Right Side) -->
      <g id="archive-bulkhead" transform="translate(180, 15)">
        <rect x="0" y="0" width="125" height="135" fill="#111827" stroke="#000" stroke-width="4"/>
        <rect x="10" y="10" width="105" height="115" fill="#1f2937" stroke="#000" stroke-width="3"/>
        <!-- Heavy steel reinforcement ribs -->
        <line x1="10" y1="40" x2="115" y2="40" stroke="#000" stroke-width="3"/>
        <line x1="10" y1="80" x2="115" y2="80" stroke="#000" stroke-width="3"/>
        <!-- Keycard Swipe Terminal -->
        <rect x="90" y="55" width="18" height="26" fill="#000" stroke="#374151" stroke-width="2"/>
        <rect x="94" y="60" width="10" height="4" fill="#ef4444"/>
        <line x1="93" y1="70" x2="105" y2="70" stroke="#9ca3af" stroke-width="1.5"/>
        <!-- Warning Stencil Sign -->
        <rect x="25" y="20" width="75" height="15" fill="#f59e0b" stroke="#000" stroke-width="2"/>
        <text x="30" y="30" fill="#000" font-family="monospace" font-size="6" font-weight="bold">RESTRICTED WING</text>
      </g>

      <!-- Hallway Floor -->
      <polygon points="0,145 320,145 320,180 0,180" fill="#070a0d"/>
      <line x1="0" y1="145" x2="320" y2="145" stroke="#000" stroke-width="3"/>
    </svg>
    `;
  }

  /**
   * SCENE 6: ABANDONED LECTURE HALL (AMPHITHEATER)
   * Based on Room 03 Questionnaire (Language deduction, blackboard, professor notes)
   */
  function getLectureHallHorrorSVG(options = {}) {
    return `
    <svg viewBox="0 0 320 180" class="w-full h-full" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Projector Beam Cone -->
        <linearGradient id="projectorBeam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5"/>
          <stop offset="60%" stop-color="#0284c7" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#0369a1" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- Deep Hall Background -->
      <rect x="0" y="0" width="320" height="180" fill="#0a0c10"/>

      <!-- Stepped Auditorium Rows (Rising Upwards in Background) -->
      <g id="auditorium-tiers">
        <polygon points="0,15 320,15 320,35 0,35" fill="#151b23" stroke="#000" stroke-width="2"/>
        <polygon points="0,35 320,35 320,55 0,55" fill="#1c2430" stroke="#000" stroke-width="2"/>
        <polygon points="0,55 320,55 320,75 0,75" fill="#243040" stroke="#000" stroke-width="2"/>
        <!-- Fold-down student theater seats -->
        <rect x="25" y="42" width="14" height="10" fill="#7f1d1d" stroke="#000" stroke-width="1.5"/>
        <rect x="55" y="42" width="14" height="10" fill="#7f1d1d" stroke="#000" stroke-width="1.5"/>
        <rect x="85" y="42" width="14" height="10" fill="#450a0a" stroke="#000" stroke-width="1.5"/>
        <rect x="115" y="42" width="14" height="10" fill="#7f1d1d" stroke="#000" stroke-width="1.5"/>
        <rect x="190" y="42" width="14" height="10" fill="#7f1d1d" stroke="#000" stroke-width="1.5"/>
        <rect x="220" y="42" width="14" height="10" fill="#450a0a" stroke="#000" stroke-width="1.5"/>
        <rect x="250" y="42" width="14" height="10" fill="#7f1d1d" stroke="#000" stroke-width="1.5"/>
      </g>

      <!-- Projector Beam Shining Downwards onto Projection Screen -->
      <polygon points="20,10 200,60 200,115 20,40" fill="url(#projectorBeam)" style="pointer-events:none; mix-blend-mode: screen;"/>

      <!-- Large Center Projection Screen -->
      <g id="projection-screen" transform="translate(140, 25)">
        <rect x="0" y="0" width="140" height="75" fill="#0f172a" stroke="#000" stroke-width="3"/>
        <rect x="4" y="4" width="132" height="67" fill="#0284c7" opacity="0.2"/>
        <!-- Occult Slide Graphic Projection -->
        <text x="14" y="22" fill="#38bdf8" font-family="monospace" font-size="7" font-weight="bold">LECTURE 14: THE FORGOTTEN</text>
        <text x="14" y="34" fill="#bae6fd" font-family="monospace" font-size="5.5">&gt; MISSING WORDS: "THE GATE OPENS AT ___"</text>
        <text x="14" y="46" fill="#f87171" font-family="monospace" font-size="5.5">&gt; MARGIN NOTE: "CHECK RECEPTION LOG"</text>
        <!-- Static scanline noise -->
        <line x1="4" y1="55" x2="136" y2="55" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4,3"/>
      </g>

      <!-- Front Stage Podium & Reel-to-Reel Audio Recorder -->
      <g id="stage-podium" transform="translate(45, 95)">
        <polygon points="10,10 50,10 55,65 5,65" fill="#382216" stroke="#000" stroke-width="3"/>
        <polygon points="8,8 52,8 50,16 6,16" fill="#523220"/>
        <!-- Reel to Reel tape machine on podium -->
        <rect x="12" y="-4" width="36" height="12" fill="#1f2937" stroke="#000" stroke-width="2"/>
        <circle cx="21" cy="2" r="4" fill="#9ca3af" stroke="#000" stroke-width="1.2"/>
        <circle cx="39" cy="2" r="4" fill="#9ca3af" stroke="#000" stroke-width="1.2"/>
        <!-- Microphone gooseneck -->
        <path d="M16,0 Q12,-12 18,-15" stroke="#d1d5db" stroke-width="2" fill="none"/>
        <circle cx="19" cy="-16" r="2" fill="#111" stroke="#9ca3af" stroke-width="0.8"/>
      </g>

      <!-- Stage Floor -->
      <polygon points="0,135 320,135 320,180 0,180" fill="#0d1117"/>
      <line x1="0" y1="135" x2="320" y2="135" stroke="#000" stroke-width="4"/>
    </svg>
    `;
  }

  /**
   * SCENE 7: SCIENCE / ALCHEMY EXPERIMENT LAB
   * Based on Mission B Room 01 & 03 (Chemical cabinet, fume hood, periodic table)
   */
  function getScienceLabHorrorSVG(options = {}) {
    return `
    <svg viewBox="0 0 320 180" class="w-full h-full" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="toxicGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="#15803d" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#021f0f" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Grimy White Tiled Lab Wall -->
      <rect x="0" y="0" width="320" height="180" fill="#151b18"/>
      <!-- Tile Grid -->
      <path d="M0,25 H320 M0,50 H320 M0,75 H320 M0,100 H320" stroke="#0b100d" stroke-width="1.5"/>
      <path d="M40,0 V115 M80,0 V115 M120,0 V115 M160,0 V115 M200,0 V115 M240,0 V115 M280,0 V115" stroke="#0b100d" stroke-width="1.5"/>

      <!-- Fume Hood Chamber (Left) -->
      <g id="fume-hood" transform="translate(15, 15)">
        <rect x="0" y="0" width="95" height="100" fill="#1f2937" stroke="#000" stroke-width="3"/>
        <!-- Glass sash pulled halfway -->
        <rect x="8" y="10" width="79" height="42" fill="#0284c7" opacity="0.25" stroke="#000" stroke-width="1.5"/>
        <!-- Fume hood interior with glowing green reaction -->
        <rect x="8" y="52" width="79" height="38" fill="#04120a"/>
        <!-- Boiling Erlenmeyer Flask with Glowing Green Reagent -->
        <circle cx="48" cy="74" r="14" fill="url(#toxicGlow)" style="pointer-events:none;"/>
        <polygon points="40,82 56,82 50,68 46,68" fill="#15803d" stroke="#000" stroke-width="1.5"/>
        <circle cx="48" cy="78" r="4" fill="#4ade80"/>
        <!-- Toxic vapor rising -->
        <circle cx="48" cy="62" r="2" fill="#86efac" opacity="0.7"/>
        <circle cx="50" cy="56" r="3" fill="#86efac" opacity="0.5"/>
      </g>

      <!-- Periodic Table of Elements Poster (Center Wall) -->
      <g id="periodic-table" transform="translate(125, 12)">
        <rect x="0" y="0" width="85" height="52" fill="#fef3c7" stroke="#000" stroke-width="2.5"/>
        <text x="8" y="10" fill="#000" font-family="monospace" font-size="5" font-weight="bold">PERIODIC SYSTEM</text>
        <rect x="6" y="14" width="73" height="32" fill="#1e293b"/>
        <!-- Element blocks -->
        <rect x="8" y="16" width="8" height="8" fill="#ef4444"/>
        <text x="9.5" y="22" fill="#fff" font-family="monospace" font-size="4">H</text>
        <rect x="69" y="16" width="8" height="8" fill="#3b82f6"/>
        <text x="70.5" y="22" fill="#fff" font-family="monospace" font-size="4">He</text>
        <!-- Highlighted Clue Element: C (Carbon #6) -->
        <rect x="36" y="26" width="10" height="9" fill="#22c55e" stroke="#fbbf24" stroke-width="1.5"/>
        <text x="39" y="33" fill="#000" font-family="monospace" font-size="5.5" font-weight="bold">C</text>
      </g>

      <!-- Specimen Jar with Preserved Specimen (Right Shelf) -->
      <g id="specimen-shelf" transform="translate(230, 25)">
        <rect x="0" y="45" width="75" height="6" fill="#374151" stroke="#000" stroke-width="2"/>
        <!-- Glass Jar -->
        <rect x="18" y="12" width="28" height="33" rx="4" fill="#0f766e" opacity="0.4" stroke="#000" stroke-width="2"/>
        <rect x="22" y="8" width="20" height="4" fill="#111" stroke="#000" stroke-width="1.5"/>
        <!-- Preserved specimen silhouette -->
        <ellipse cx="32" cy="28" rx="8" ry="10" fill="#7f1d1d"/>
        <circle cx="30" cy="24" r="2" fill="#fca5a5"/>
      </g>

      <!-- Heavy Lab Countertop Bench -->
      <polygon points="0,115 320,115 320,180 0,180" fill="#0a0f12"/>
      <line x1="0" y1="115" x2="320" y2="115" stroke="#000" stroke-width="3.5"/>
    </svg>
    `;
  }

  /**
   * SCENE 8: HIGH-VOLTAGE ELECTRICAL BREAKER ROOM
   * Based on Mission B Room 06 & Mission A Room 08 (Breaker panel, circuit logic)
   */
  function getElectricalBreakerSVG(options = {}) {
    return `
    <svg viewBox="0 0 320 180" class="w-full h-full" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Spark Lightning Flare -->
        <radialGradient id="sparkFlare" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="1"/>
          <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Industrial Steel Boiler Wall -->
      <rect x="0" y="0" width="320" height="180" fill="#0f1115"/>
      <!-- Rivet Lines -->
      <line x1="15" y1="0" x2="15" y2="180" stroke="#1f242d" stroke-width="2" stroke-dasharray="4,6"/>
      <line x1="305" y1="0" x2="305" y2="180" stroke="#1f242d" stroke-width="2" stroke-dasharray="4,6"/>

      <!-- Steam Pipes Crossing Room -->
      <rect x="0" y="15" width="320" height="12" fill="#374151" stroke="#000" stroke-width="2"/>
      <rect x="65" y="13" width="10" height="16" fill="#1f2937" stroke="#000" stroke-width="1.5"/>
      <rect x="220" y="13" width="10" height="16" fill="#1f2937" stroke="#000" stroke-width="1.5"/>
      <!-- Steam Leak wisp -->
      <path d="M75,20 Q85,10 95,20" stroke="#94a3b8" stroke-width="2" opacity="0.4" fill="none"/>

      <!-- Main High-Voltage Electrical Breaker Cabinet (Center) -->
      <g id="breaker-cabinet" transform="translate(85, 35)">
        <!-- Outer Enclosure -->
        <rect x="0" y="0" width="150" height="120" fill="#1f242e" stroke="#000" stroke-width="4"/>
        <rect x="6" y="6" width="138" height="108" fill="#11141a" stroke="#000" stroke-width="2"/>

        <!-- Warning Skull / Hazard Stencil -->
        <rect x="35" y="12" width="80" height="16" fill="#eab308" stroke="#000" stroke-width="2"/>
        <text x="40" y="23" fill="#000" font-family="monospace" font-size="6.5" font-weight="bold">HIGH VOLTAGE: 480V</text>

        <!-- Voltmeter Analog Dial -->
        <g transform="translate(18, 36)">
          <circle cx="16" cy="16" r="16" fill="#f8fafc" stroke="#000" stroke-width="2"/>
          <path d="M6,22 A12,12 0 0,1 26,22" stroke="#ef4444" stroke-width="2" fill="none"/>
          <!-- Needle tipped into Danger Red zone -->
          <line x1="16" y1="16" x2="24" y2="8" stroke="#000" stroke-width="2"/>
          <circle cx="16" cy="16" r="2.5" fill="#000"/>
        </g>

        <!-- 4 Heavy Knife Switches (Circuit Switch Puzzle) -->
        <g id="knife-switches" transform="translate(60, 40)">
          <!-- Switch 1 (Up) -->
          <rect x="0" y="0" width="12" height="28" fill="#000" stroke="#4b5563" stroke-width="1.5"/>
          <line x1="6" y1="20" x2="6" y2="4" stroke="#fbbf24" stroke-width="3"/>
          <circle cx="6" cy="4" r="2.5" fill="#ef4444"/>

          <!-- Switch 2 (Down) -->
          <rect x="18" y="0" width="12" height="28" fill="#000" stroke="#4b5563" stroke-width="1.5"/>
          <line x1="24" y1="8" x2="24" y2="24" stroke="#fbbf24" stroke-width="3"/>
          <circle cx="24" cy="24" r="2.5" fill="#22c55e"/>

          <!-- Switch 3 (Up) -->
          <rect x="36" y="0" width="12" height="28" fill="#000" stroke="#4b5563" stroke-width="1.5"/>
          <line x1="42" y1="20" x2="42" y2="4" stroke="#fbbf24" stroke-width="3"/>
          <circle cx="42" cy="4" r="2.5" fill="#ef4444"/>

          <!-- Switch 4 (Down) -->
          <rect x="54" y="0" width="12" height="28" fill="#000" stroke="#4b5563" stroke-width="1.5"/>
          <line x1="60" y1="8" x2="60" y2="24" stroke="#fbbf24" stroke-width="3"/>
          <circle cx="60" cy="24" r="2.5" fill="#22c55e"/>
        </g>

        <!-- Main Emergency Trip Lever (Right) -->
        <g transform="translate(126, 68)">
          <rect x="0" y="0" width="12" height="35" fill="#000" stroke="#374151" stroke-width="1.5"/>
          <line x1="6" y1="28" x2="6" y2="8" stroke="#dc2626" stroke-width="4"/>
          <circle cx="6" cy="6" r="3.5" fill="#ef4444"/>
        </g>

        <!-- Sparking Exposed Fuse Terminal (Bottom Left) -->
        <g transform="translate(18, 78)">
          <rect x="0" y="0" width="32" height="24" fill="#050505" stroke="#000" stroke-width="1.5"/>
          <circle cx="16" cy="12" r="10" fill="url(#sparkFlare)" style="pointer-events:none;"/>
          <!-- Spark star polygons -->
          <polygon points="16,8 18,11 21,12 18,13 16,16 14,13 11,12 14,11" fill="#fff"/>
        </g>
      </g>

      <!-- Industrial Grated Floor -->
      <polygon points="0,155 320,155 320,180 0,180" fill="#05070a"/>
      <line x1="0" y1="155" x2="320" y2="155" stroke="#000" stroke-width="4"/>
    </svg>
    `;
  }

  /* ===========================================================================
     MODULAR SVG DECALS & STAMPS (FOR INLINE ROOM DECORATION)
     =========================================================================== */
  function getBloodSplatterDecal(variant = 1) {
    if (variant === 2) {
      return `
      <g class="blood-decal">
        <path d="M12,2 C18,0 24,6 22,14 C26,12 30,16 28,22 C32,26 28,34 22,32 C18,36 10,34 8,26 C4,24 2,18 6,12 C4,6 8,2 12,2 Z" fill="#8b0000" opacity="0.9"/>
        <circle cx="34" cy="18" r="2" fill="#8b0000"/>
        <circle cx="16" cy="38" r="2.5" fill="#8b0000"/>
        <circle cx="4" cy="28" r="1.5" fill="#8b0000"/>
      </g>`;
    }
    return `
    <g class="blood-decal">
      <ellipse cx="20" cy="15" rx="14" ry="9" fill="#8b0000" opacity="0.9"/>
      <path d="M18,22 C18,28 15,36 15,40" stroke="#8b0000" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="15" cy="42" r="2" fill="#8b0000"/>
      <circle cx="32" cy="10" r="1.8" fill="#8b0000"/>
      <circle cx="6" cy="18" r="2.2" fill="#8b0000"/>
    </g>`;
  }

  function getScratchMarksDecal() {
    return `
    <g class="scratch-decal" stroke="#000" stroke-width="1.8" stroke-linecap="round">
      <line x1="5" y1="2" x2="25" y2="28" stroke="#1f2937"/>
      <line x1="10" y1="2" x2="30" y2="28" stroke="#1f2937"/>
      <line x1="15" y1="4" x2="35" y2="30" stroke="#1f2937"/>
      <line x1="4" y1="1" x2="24" y2="27" stroke="#dc2626" stroke-width="0.8"/>
      <line x1="9" y1="1" x2="29" y2="27" stroke="#dc2626" stroke-width="0.8"/>
      <line x1="14" y1="3" x2="34" y2="29" stroke="#dc2626" stroke-width="0.8"/>
    </g>`;
  }

  function getCobwebDecal(corner = 'top-left') {
    return `
    <g class="cobweb-decal" opacity="0.45" stroke="#94a3b8" stroke-width="0.8" fill="none">
      <path d="M0,0 L40,0 M0,0 L35,15 M0,0 L25,30 M0,0 L0,40"/>
      <path d="M10,0 Q8,8 0,10"/>
      <path d="M22,0 Q18,18 0,22"/>
      <path d="M35,0 Q30,30 0,35"/>
    </g>`;
  }

  function getCrimeTapeDecal(text = 'POLICE LINE DO NOT CROSS') {
    return `
    <g class="crime-tape-decal">
      <polygon points="0,0 200,0 195,18 0,18" fill="#eab308" stroke="#000" stroke-width="2"/>
      <line x1="0" y1="18" x2="195" y2="18" stroke="#000" stroke-width="2"/>
      <text x="12" y="12" fill="#000" font-family="'Courier New', monospace" font-size="7.5" font-weight="bold" letter-spacing="1.5">${text}</text>
    </g>`;
  }

  function getPolaroidFrameDecal(imageSrc, caption = 'EVIDENCE #01') {
    return `
    <div class="polaroid-drying cursor-zoom-in" onclick="HorrorAssets.widgets.openLoupeInspectionModal({ imageSrc: '${imageSrc}', title: '${caption}' })">
      <div class="clothespin"></div>
      <img src="${imageSrc}" class="w-full h-16 object-cover border border-black" alt="${caption}" width="80" height="64"/>
      <p class="text-[9px] font-pixel text-black mt-1 text-center truncate">${caption}</p>
    </div>`;
  }

  /* ===========================================================================
     3. INTERACTIVE DARKROOM CHEMICAL TRAY WIDGET
     Allows player to develop undeveloped crime photos in 3 chemical baths!
     =========================================================================== */
  function openDarkroomDevelopingModal(options = {}) {
    const {
      onComplete = () => {},
      targetSecretCode = '739',
      polaroidImageSrc = './Dusty Photo Darkroom Crimson Glow Spooky Cartoon Aesthetics Wallpaper.jpeg'
    } = options;

    horrorAudio.startDarkroomHum();

    // Create modal backdrop
    const modal = document.createElement('div');
    modal.className = 'noir-modal-backdrop';
    modal.id = 'darkroom-dev-modal';

    modal.innerHTML = `
      <div class="noir-modal-card comic-panel-crimson p-4 max-w-2xl text-left relative">
        <!-- Close Button -->
        <button id="close-darkroom-modal" class="absolute top-3 right-3 text-red-500 hover:text-white font-pixel text-xs px-2 py-1 border-2 border-black bg-[#200508]">
          [X] CLOSE
        </button>

        <!-- Header Bar -->
        <div class="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black">
          <i class="fa-solid fa-flask text-red-500 text-lg"></i>
          <div>
            <h2 class="font-pixel text-sm text-red-400">CRIMSON PHOTO LAB: CHEMICAL DEVELOPMENT</h2>
            <p class="font-terminal text-xs text-red-300">PROCESS: SUBMERGE BLANK PAPER IN TRAYS [1. DEVELOPER] -> [2. STOP BATH] -> [3. FIXER]</p>
          </div>
        </div>

        <!-- Safe Light Fixture Visual Bar -->
        <div class="safelight-fixture p-2 mb-3 rounded flex justify-between items-center">
          <div class="safelight-tube w-48"></div>
          <span class="font-terminal text-red-400 text-sm font-bold glow-red">SAFELIGHT: ACTIVE 650nm</span>
          <div class="safelight-tube w-48"></div>
        </div>

        <!-- Upper Twine Line with Clothespins -->
        <div class="twine-drying-wire mb-4 bg-[#140204] border-2 border-black rounded relative overflow-hidden">
          <span class="absolute top-1 left-2 font-terminal text-[11px] text-[#ff6666]">DRYING TWINE WIRE (HANG FINISHED CLUES HERE)</span>
          
          <div id="drying-slot-1" class="polaroid-drying mt-3">
            <div class="clothespin"></div>
            <img src="./download (17).jpeg" class="w-full h-14 object-cover border border-black" alt="Crime Scene Photo" width="80" height="56"/>
            <p class="text-[9px] font-pixel text-black mt-1 text-center">ROOM_204</p>
          </div>

          <div id="drying-slot-active" class="polaroid-drying mt-3 opacity-50 border-dashed">
            <div class="clothespin"></div>
            <div class="w-full h-14 bg-[#333] flex items-center justify-center text-[10px] text-gray-400 font-pixel">
              [EMPTY]
            </div>
            <p class="text-[9px] font-pixel text-gray-500 mt-1 text-center">SLOT_02</p>
          </div>
        </div>

        <!-- Interactive Chemical Trays Bench -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <!-- Tray 1: Developer -->
          <div id="btn-tray-developer" class="chemical-tray tray-developer p-2 flex flex-col justify-between">
            <div class="flex justify-between items-center z-10">
              <span class="font-pixel text-[10px] text-amber-400">1. DEVELOPER</span>
              <span id="dev-status" class="text-[10px] font-terminal text-amber-300">READY</span>
            </div>
            <div class="tray-liquid bg-amber-800"></div>
            <div class="z-10 text-center">
              <p class="text-xs font-terminal text-amber-200">BATH: METOL-HYDROQUINONE</p>
              <button class="noir-btn noir-btn-amber text-xs mt-1 w-full justify-center">DIP PHOTO (4s)</button>
            </div>
          </div>

          <!-- Tray 2: Stop Bath -->
          <div id="btn-tray-stopbath" class="chemical-tray tray-stopbath p-2 flex flex-col justify-between opacity-50 pointer-events-none">
            <div class="flex justify-between items-center z-10">
              <span class="font-pixel text-[10px] text-sky-400">2. STOP BATH</span>
              <span id="stop-status" class="text-[10px] font-terminal text-sky-300">LOCKED</span>
            </div>
            <div class="tray-liquid bg-sky-900"></div>
            <div class="z-10 text-center">
              <p class="text-xs font-terminal text-sky-200">BATH: 2% ACETIC ACID</p>
              <button class="noir-btn text-xs mt-1 w-full justify-center">NEUTRALIZE (2s)</button>
            </div>
          </div>

          <!-- Tray 3: Fixer -->
          <div id="btn-tray-fixer" class="chemical-tray tray-fixer p-2 flex flex-col justify-between opacity-50 pointer-events-none">
            <div class="flex justify-between items-center z-10">
              <span class="font-pixel text-[10px] text-emerald-400">3. RAPID FIXER</span>
              <span id="fix-status" class="text-[10px] font-terminal text-emerald-300">LOCKED</span>
            </div>
            <div class="tray-liquid bg-emerald-950"></div>
            <div class="z-10 text-center">
              <p class="text-xs font-terminal text-emerald-200">BATH: SODIUM THIOSULFATE</p>
              <button class="noir-btn text-xs mt-1 w-full justify-center">PERMANENT FIX (3s)</button>
            </div>
          </div>
        </div>

        <!-- The Developing Photo Preview Sheet -->
        <div class="bg-[#0b0c10] border-2 border-black p-3 rounded flex items-center gap-4">
          <div id="developing-sheet-container" class="w-32 h-40 bg-[#f7f2e7] border-2 border-black shadow-md p-2 flex flex-col justify-between flex-shrink-0">
            <div id="developing-photo-image" class="w-full h-28 bg-[#d9d2c2] border border-black photo-undeveloped overflow-hidden relative">
              <img src="${polaroidImageSrc}" class="w-full h-full object-cover" alt="Developing Photographic Clue" width="128" height="112"/>
              <div id="secret-pin-reveal" class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-1000 bg-black/60">
                <span class="font-pixel text-lg text-red-500 glow-red">PIN: ${targetSecretCode}</span>
              </div>
            </div>
            <p id="developing-label" class="font-terminal text-xs text-black font-bold text-center">[UNEXPOSED SHEET]</p>
          </div>

          <div class="flex-1 space-y-2">
            <div class="comic-caption-box">
              "The silver halides are reacting under the darkroom safe-light. Follow the chemistry sequence precisely to reveal the hidden inscription."
            </div>
            <div id="dev-progress-bar-container" class="w-full bg-black h-3 border border-red-900 rounded overflow-hidden">
              <div id="dev-progress-bar" class="h-full bg-red-600 transition-all duration-300 w-0"></div>
            </div>
            <p id="dev-instruction-text" class="font-terminal text-xs text-red-400 font-bold">&gt; STEP 1: Click the DEVELOPER tray to immerse photographic paper.</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Chemical State Machine
    let stage = 0; // 0: start, 1: developed, 2: stopped, 3: fixed
    const btnDev = modal.querySelector('#btn-tray-developer');
    const btnStop = modal.querySelector('#btn-tray-stopbath');
    const btnFix = modal.querySelector('#btn-tray-fixer');
    const photoImg = modal.querySelector('#developing-photo-image');
    const secretPin = modal.querySelector('#secret-pin-reveal');
    const label = modal.querySelector('#developing-label');
    const progressBar = modal.querySelector('#dev-progress-bar');
    const instruction = modal.querySelector('#dev-instruction-text');
    const closeBtn = modal.querySelector('#close-darkroom-modal');

    closeBtn.addEventListener('click', () => {
      horrorAudio.stopDarkroomHum();
      modal.remove();
    });

    // Step 1: Developer
    btnDev.addEventListener('click', () => {
      if (stage !== 0) return;
      horrorAudio.playChemicalDrip();
      btnDev.classList.add('opacity-50', 'pointer-events-none');
      instruction.textContent = "> DEVELOPING: Silver grains forming... (4s)";
      progressBar.style.width = "33%";

      setTimeout(() => {
        stage = 1;
        photoImg.className = "w-full h-28 bg-[#d9d2c2] border border-black photo-in-developer overflow-hidden relative";
        label.textContent = "[LATENT IMAGE VISIBLE]";
        btnStop.classList.remove('opacity-50', 'pointer-events-none');
        modal.querySelector('#stop-status').textContent = "READY";
        instruction.textContent = "> STEP 2: Chemical reaction active! Submerge immediately into STOP BATH to halt degradation!";
        horrorAudio.playGeigerStatic(6, 0.4);
      }, 3500);
    });

    // Step 2: Stop Bath
    btnStop.addEventListener('click', () => {
      if (stage !== 1) return;
      horrorAudio.playChemicalDrip();
      btnStop.classList.add('opacity-50', 'pointer-events-none');
      instruction.textContent = "> NEUTRALIZING: Acid bath stopping developer... (2s)";
      progressBar.style.width = "66%";

      setTimeout(() => {
        stage = 2;
        label.textContent = "[STABILIZED]";
        btnFix.classList.remove('opacity-50', 'pointer-events-none');
        modal.querySelector('#fix-status').textContent = "READY";
        instruction.textContent = "> STEP 3: Submerge into FIXER bath to permanently lock the silver image and reveal secret data.";
      }, 2000);
    });

    // Step 3: Fixer
    btnFix.addEventListener('click', () => {
      if (stage !== 2) return;
      horrorAudio.playChemicalDrip();
      btnFix.classList.add('opacity-50', 'pointer-events-none');
      instruction.textContent = "> FIXING: Dissolving remaining silver halides... (3s)";
      progressBar.style.width = "100%";

      setTimeout(() => {
        stage = 3;
        photoImg.className = "w-full h-28 bg-[#d9d2c2] border border-black photo-developed overflow-hidden relative";
        secretPin.classList.remove('opacity-0');
        label.textContent = "[PERMANENT EVIDENCE]";
        instruction.innerHTML = `<span class="text-green-400 font-pixel">&gt; SUCCESS! SECRET CIPHER CODE REVEALED: ${targetSecretCode}</span>`;
        horrorAudio.playCameraShutter();
        onComplete(targetSecretCode);
      }, 3000);
    });
  }

  /* ===========================================================================
     4. INTERACTIVE LOUPE / MAGNIFIER INSPECTION MODAL
     Inspects high-resolution scene evidence, photos, or documents
     =========================================================================== */
  function openLoupeInspectionModal(options = {}) {
    const {
      imageSrc = './download (17).jpeg',
      title = 'EXAMINE CRIME EVIDENCE',
      caption = 'Use the forensic loupe to scan for scratched cipher symbols or hidden inscriptions.',
      hiddenClues = [
        { x: 35, y: 48, label: 'SCRATCHED DIGIT: 4' },
        { x: 72, y: 25, label: 'BLACKBOARD FORMULA: H2SO4' }
      ]
    } = options;

    horrorAudio.playFlashlightClick();

    const modal = document.createElement('div');
    modal.className = 'noir-modal-backdrop';
    modal.id = 'loupe-inspect-modal';

    modal.innerHTML = `
      <div class="noir-modal-card comic-panel-noir p-4 max-w-3xl text-left relative">
        <button id="close-loupe-modal" class="absolute top-3 right-3 text-amber-500 hover:text-white font-pixel text-xs px-2 py-1 border-2 border-black bg-[#1f1910]">
          [X] CLOSE
        </button>

        <!-- Header -->
        <div class="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black">
          <i class="fa-solid fa-magnifying-glass text-amber-500 text-lg"></i>
          <div>
            <h2 class="font-pixel text-sm text-amber-400">${title}</h2>
            <p class="font-terminal text-xs text-amber-200/80">${caption}</p>
          </div>
        </div>

        <!-- Loupe Viewing Canvas Container -->
        <div id="loupe-stage-container" class="relative w-full h-80 bg-black border-3 border-black overflow-hidden cursor-none rounded select-none">
          <img id="loupe-target-image" src="${imageSrc}" class="w-full h-full object-cover select-none pointer-events-none" alt="Evidence" width="600" height="320"/>

          <!-- Loupe Lens Element -->
          <div id="forensic-loupe" class="loupe-glass pointer-events-none hidden">
            <div class="loupe-glare"></div>
            <div class="loupe-reticle"></div>
          </div>

          <!-- Discovered Hotspots Overlay -->
          ${hiddenClues.map((clue, idx) => `
            <div class="hidden-loupe-clue absolute w-8 h-8 rounded-full border-2 border-red-500 opacity-0 transition-opacity duration-300 flex items-center justify-center font-pixel text-[9px] text-red-400 bg-red-950/80" 
                 style="left: ${clue.x}%; top: ${clue.y}%; transform: translate(-50%, -50%);"
                 data-clue="${clue.label}">
              !
            </div>
          `).join('')}
        </div>

        <!-- Loupe Footer HUD -->
        <div class="mt-3 flex justify-between items-center bg-[#090b10] border-2 border-black p-2">
          <div class="flex items-center gap-2">
            <span class="font-pixel text-[10px] text-amber-400">MAGNIFICATION: 2.5X</span>
            <span class="font-terminal text-xs text-gray-400">| RESOLUTION: 300 DPI</span>
          </div>
          <div id="loupe-readout" class="font-terminal text-xs text-amber-300 font-bold">
            &gt; MOVE MOUSE ACROSS EVIDENCE TO SCAN
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const stage = modal.querySelector('#loupe-stage-container');
    const loupe = modal.querySelector('#forensic-loupe');
    const readout = modal.querySelector('#loupe-readout');
    const closeBtn = modal.querySelector('#close-loupe-modal');
    const clues = modal.querySelectorAll('.hidden-loupe-clue');

    closeBtn.addEventListener('click', () => modal.remove());

    stage.addEventListener('mouseenter', () => loupe.classList.remove('hidden'));
    stage.addEventListener('mouseleave', () => loupe.classList.add('hidden'));

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      loupe.style.left = `${x - 70}px`;
      loupe.style.top = `${y - 70}px`;

      // Check proximity to hidden clues
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;

      let found = false;
      clues.forEach(clueEl => {
        const clueText = clueEl.getAttribute('data-clue');
        const clueLeft = parseFloat(clueEl.style.left);
        const clueTop = parseFloat(clueEl.style.top);

        const dist = Math.hypot(pctX - clueLeft, pctY - clueTop);
        if (dist < 10) {
          clueEl.style.opacity = '1';
          readout.innerHTML = `<span class="text-red-400 font-pixel">&gt; CLUE DISCOVERED: ${clueText}</span>`;
          found = true;
          horrorAudio.playGeigerStatic(4, 0.2);
        } else {
          clueEl.style.opacity = '0';
        }
      });

      if (!found) {
        readout.textContent = `> COORD: [X:${Math.round(pctX)} Y:${Math.round(pctY)}] SCANNING...`;
      }
    });
  }

  /* ===========================================================================
     5. FLASHLIGHT MODE CONTROLLER (Pitch Black Exploration)
     =========================================================================== */
  function initFlashlightMode(containerElement) {
    if (!containerElement) return;

    let isActive = false;
    let overlay = containerElement.querySelector('.flashlight-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'flashlight-overlay';
      overlay.style.display = 'none';
      containerElement.appendChild(overlay);
    }

    const mouseHandler = (e) => {
      if (!isActive) return;
      const rect = containerElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      containerElement.style.setProperty('--mouse-x', `${x}px`);
      containerElement.style.setProperty('--mouse-y', `${y}px`);
    };

    containerElement.addEventListener('mousemove', mouseHandler);

    return {
      enable: () => {
        isActive = true;
        overlay.style.display = 'block';
        containerElement.classList.add('flashlight-active');
        horrorAudio.playFlashlightClick();
      },
      disable: () => {
        isActive = false;
        overlay.style.display = 'none';
        containerElement.classList.remove('flashlight-active');
        horrorAudio.playFlashlightClick();
      },
      toggle: () => {
        if (isActive) {
          this.disable();
        } else {
          this.enable();
        }
        return isActive;
      }
    };
  }

  /* ===========================================================================
     PUBLIC EXPORTS
     =========================================================================== */
  return {
    audio: horrorAudio,
    scenes: {
      getClassroomSceneSVG,
      getDarkroomSceneSVG,
      getNoirOfficeSceneSVG,
      getLibraryHorrorSVG,
      getLockerRowHorrorSVG,
      getLectureHallHorrorSVG,
      getScienceLabHorrorSVG,
      getElectricalBreakerSVG
    },
    decals: {
      getBloodSplatterDecal,
      getScratchMarksDecal,
      getCobwebDecal,
      getCrimeTapeDecal,
      getPolaroidFrameDecal
    },
    widgets: {
      openDarkroomDevelopingModal,
      openLoupeInspectionModal,
      initFlashlightMode
    }
  };
});
