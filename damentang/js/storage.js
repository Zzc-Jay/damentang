// ===================== 存档管理器 =====================
class SaveManager {
  static KEY = 'damentang_save';
  static save(state) {
    const data = {
      scene: state.currentSceneId,
      inventory: state.inventory,
      collected: state.collectedElements,
      flags: state.flags,
      openingDone: state.openingDone,
      endingSeen: state.endingSeen || null,
      inventoryPage: state.inventoryPage || 0,
      time: Date.now()
    };
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
      return true;
    } catch (e) { return false; }
  }
  static load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }
  static delete() {
    try { localStorage.removeItem(this.KEY); } catch (e) { /* */ }
  }
}
