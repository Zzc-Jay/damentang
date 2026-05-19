/* ===================================================================
   大门塘 (Damentang) — Game Engine v0.9
   HTML5 + Emoji 点触解谜游戏
   第一章：杨梅坑三房叙事、6场景、7种谜题、NPC残影、双结局
   =================================================================== */

// ===================== 音频管理器 =====================
class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this._masterVol = 0.7;
    this._sfxVol = 0.7;
    this._cache = {};          // 音频缓存
    this._ambient = null;      // 当前环境音
    this._ambientVol = 0.5;
    this._useRealAudio = true; // 文件加载失败时回退到合成音
    this._audioPath = 'audio/';
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._masterVol;
      this.masterGain.connect(this.ctx.destination);
      // iOS Safari 挂起 AudioContext，需用户交互后恢复
      if (this.ctx.state === 'suspended') {
        const self = this;
        const resume = function () {
          if (self.ctx && self.ctx.state === 'suspended') self.ctx.resume();
        };
        document.addEventListener('click', resume, { once: true });
        document.addEventListener('touchstart', resume, { once: true });
        document.addEventListener('keydown', resume, { once: true });
      }
    } catch (e) { /* 静默降级 */ }
  }

  // 确保 AudioContext 处于运行状态
  _ensureCtx() {
    if (this.ctx && this.ctx.state === 'suspended') {
      try { this.ctx.resume(); } catch (e) { /* */ }
    }
  }

  // ---- 音量控制 ----
  setMasterVolume(v) {
    this._masterVol = v;
    if (this.masterGain) this.masterGain.gain.value = v;
  }
  setSfxVolume(v) { this._sfxVol = v; }
  getMasterVolume() { return this._masterVol; }
  getSfxVolume() { return this._sfxVol; }

  // ---- 加载/播放真实音频 ----
  _loadAudio(name) {
    if (this._cache[name]) return this._cache[name];
    try {
      const audio = new Audio(this._audioPath + name + '.mp3');
      audio.preload = 'auto';
      audio.volume = this._sfxVol;
      this._cache[name] = audio;
      return audio;
    } catch (e) {
      this._useRealAudio = false;
      return null;
    }
  }

  _playAudio(name) {
    if (!this._useRealAudio) return false;
    try {
      const audio = this._loadAudio(name);
      if (audio) {
        audio.volume = this._sfxVol;
        audio.currentTime = 0;
        // 播放可能被浏览器拦截，用 catch 静默处理
        const promise = audio.play();
        if (promise) promise.catch(function () {});
        return true;
      }
    } catch (e) { /* fallback */ }
    this._useRealAudio = false;
    return false;
  }

  // ---- Web Audio 合成音（回退） ----
  _synth(freq, dur, type, vol, delay) {
    this._ensureCtx();
    if (!this.ctx || !this.masterGain) return;
    delay = delay || 0;
    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    const v = (vol || 0.08) * this._sfxVol;
    gain.gain.setValueAtTime(v, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + dur);
  }

  // ---- 音效方法（真实文件优先，失败回退合成音） ----
  sfxClick() {
    if (!this._playAudio('sfx_click'))
      this._synth(900, 0.06, 'square', 0.06);
  }
  sfxCollect() {
    if (!this._playAudio('sfx_collect')) {
      this._synth(1100, 0.12, 'sine', 0.08);
      setTimeout(() => this._synth(1500, 0.1, 'sine', 0.06), 80);
    }
  }
  sfxUse() {
    if (!this._playAudio('sfx_use')) {
      this._synth(600, 0.15, 'triangle', 0.07);
      setTimeout(() => this._synth(800, 0.1, 'triangle', 0.05), 100);
    }
  }
  sfxSolve() {
    if (!this._playAudio('sfx_solve')) {
      this._synth(523, 0.18, 'sine', 0.07);
      setTimeout(() => this._synth(659, 0.18, 'sine', 0.06), 150);
      setTimeout(() => this._synth(784, 0.25, 'sine', 0.07), 300);
    }
  }
  sfxDoor()       { if (!this._playAudio('sfx_door_open')) { this._synth(150, 0.5, 'sawtooth', 0.06); setTimeout(() => this._synth(200, 0.4, 'sawtooth', 0.05), 200); } }
  sfxLock()       { if (!this._playAudio('sfx_lock_unlock')) this._synth(300, 0.3, 'square', 0.05); }
  sfxMechanism()  { if (!this._playAudio('sfx_mechanism')) this._synth(200, 0.5, 'triangle', 0.05); }
  sfxSealBreak()  { if (!this._playAudio('sfx_seal_break')) { this._synth(80, 1.0, 'sawtooth', 0.06); setTimeout(() => this._synth(60, 1.5, 'sine', 0.08), 300); } }
  sfxReveal() {
    if (!this._playAudio('sfx_reveal')) {
      this._synth(400, 0.3, 'sine', 0.05);
      setTimeout(() => this._synth(600, 0.4, 'sine', 0.06), 200);
      setTimeout(() => this._synth(900, 0.5, 'sine', 0.05), 400);
    }
  }
  sfxDark() {
    if (!this._playAudio('sfx_dark')) {
      this._synth(80, 0.8, 'sine', 0.06);
      setTimeout(() => this._synth(60, 1.0, 'sine', 0.07), 300);
    }
  }
  sfxEnding() {
    if (!this._playAudio('sfx_ending')) {
      this._synth(200, 0.6, 'triangle', 0.06);
      setTimeout(() => this._synth(150, 1.0, 'triangle', 0.07), 400);
      setTimeout(() => this._synth(100, 1.5, 'sine', 0.08), 800);
    }
  }
  sfxSave() {
    if (!this._playAudio('sfx_save')) {
      this._synth(1000, 0.08, 'sine', 0.06);
      setTimeout(() => this._synth(1300, 0.08, 'sine', 0.05), 70);
    }
  }

  // ---- 环境音 ----
  playAmbient(sceneId) {
    const name = 'amb_village';
    switch (sceneId) {
      case 'village_entrance': name = 'amb_village';   break;
      case 'ancestral_hall':   name = 'amb_hall';       break;
      case 'study':            name = 'amb_study';      break;
      case 'bedroom':          name = 'amb_bedroom';    break;
      case 'dark_passage':     name = 'amb_passage';    break;
      case 'seal_chamber':     name = 'amb_seal';       break;
    }
    this._crossfadeAmbient(name);
  }

  _crossfadeAmbient(name) {
    if (this._ambientName === name) return;
    this._ambientName = name;
    try {
      const next = this._loadAudio(name);
      if (!next) return;
      next.loop = true;
      next.volume = 0;

      const prev = this._ambient;
      this._ambient = next;

      next.currentTime = 0;
      const p = next.play();
      if (p) p.catch(function () {});

      // 渐入 1.5s
      const self = this;
      const steps = 15;
      const step = 0;
      const iv = setInterval(function () {
        step++;
        const vol = Math.min(self._ambientVol, self._ambientVol * (step / steps));
        next.volume = vol * self._masterVol;
        if (prev && step <= steps) {
          prev.volume = Math.max(0, self._ambientVol * (1 - step / steps)) * self._masterVol;
        }
        if (step >= steps) {
          clearInterval(iv);
          if (prev) { prev.pause(); prev.currentTime = 0; }
        }
      }, 100);
    } catch (e) { /* */ }
  }

  stopAmbient() {
    if (this._ambient) {
      this._ambient.pause();
      this._ambient.currentTime = 0;
      this._ambient = null;
      this._ambientName = null;
    }
  }
}
