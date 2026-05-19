// ===================== 启动 =====================
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/damentang/sw.js', { scope: '/damentang/' })
      .catch(() => { /* offline not available */ });
  }
});
