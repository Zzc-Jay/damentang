// ===================== 顺序谜题引擎 =====================
class SequencePuzzle {
  constructor(container, config, onSolve) {
    this.container = container;
    this.items = config.items || [];
    this.answer = config.answer || [];
    this.onSolve = onSolve;
    this.selected = [];
    // 只在构造时打乱一次，避免错误后重新排列
    this._shuffled = this.items.map((item, i) => ({ ...item, origIdx: i }));
    for (let i = this._shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._shuffled[i], this._shuffled[j]] = [this._shuffled[j], this._shuffled[i]];
    }
  }

  render() {
    this.container.innerHTML = '';
    const self = this;

    const clue = document.createElement('p');
    clue.style.cssText = 'color:var(--text-dim);text-align:center;margin-bottom:12px;font-size:0.85rem;';
    clue.textContent = '按正确顺序依次点击';
    this.container.appendChild(clue);

    const grid = document.createElement('div');
    grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;';

    this._shuffled.forEach(item => {
      const btn = document.createElement('button');
      btn.style.cssText = 'padding:10px 16px;background:var(--bg-dark);border:2px solid var(--border);color:var(--text);border-radius:6px;cursor:pointer;font-size:1rem;min-width:60px;transition:all 0.2s;';
      btn.textContent = item.emoji + ' ' + item.label;
      btn.addEventListener('click', () => {
        if (self.selected.includes(item.origIdx)) return;
        self.selected.push(item.origIdx);
        btn.style.borderColor = 'var(--gold)';
        btn.style.color = 'var(--gold)';
        if (self.audio) self.audio.sfxClick();

        // 检查是否正确
        const pos = self.selected.length - 1;
        if (self.selected[pos] !== self.answer[pos]) {
          // 错误 → 闪烁红色
          btn.style.borderColor = '#c44';
          btn.style.color = '#c44';
          setTimeout(() => {
            self.selected = [];
            self.render();
          }, 600);
        } else if (self.selected.length === self.answer.length) {
          // 全部正确
          setTimeout(() => self.onSolve(), 350);
        }
      });
      grid.appendChild(btn);
    });
    this.container.appendChild(grid);

    // 当前顺序指示
    const indicator = document.createElement('p');
    indicator.style.cssText = 'color:var(--gold);text-align:center;margin-top:10px;min-height:1.5em;font-size:0.85rem;';
    if (this.selected.length > 0) {
      indicator.textContent = '已选：' + this.selected.map(i => this.items[i].label).join(' → ');
    }
    this.container.appendChild(indicator);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'puzzle-reset-btn';
    resetBtn.textContent = '重置';
    resetBtn.addEventListener('click', () => {
      this.selected = [];
      this.render();
    });
    this.container.appendChild(resetBtn);
  }
}

// ===================== 光线反射谜题引擎 =====================
class LightPuzzle {
  constructor(container, config, onSolve) {
    this.container = container;
    this.size = config.size || 4;
    this.mirrors = config.mirrors || [];
    this.source = config.source || { row: 0, col: 0, dir: 'E' };
    this.target = config.target || { row: 3, col: 3 };
    this.onSolve = onSolve;
    // 随机化初始镜面方向，确保初始状态不可直达终点
    this.current = this._randomUnsolvedConfig();
    this._initialState = this.current.map(m => ({ ...m }));
  }

  _randomOrientation() {
    const dirs = ['NE', 'NW', 'SW', 'SE'];
    return dirs[Math.floor(Math.random() * 4)];
  }

  _randomUnsolvedConfig() {
    for (let attempt = 0; attempt < 200; attempt++) {
      const config = this.mirrors.map(m => ({
        ...m,
        orientation: this._randomOrientation()
      }));
      this.current = config;
      if (!this._simulate()) return config;
    }
    // 200 次均碰巧可解 → 将所有镜面旋转 1 步作为兜底
    const fallback = this.mirrors.map(m => ({
      ...m,
      orientation: this._nextOrientation(m.orientation)
    }));
    this.current = fallback;
    return fallback;
  }

  _nextOrientation(ori) {
    const dirs = ['NE', 'NW', 'SW', 'SE'];
    return dirs[(dirs.indexOf(ori) + 1) % 4];
  }

  _rotate(row, col) {
    const m = this.current.find(m => m.row === row && m.col === col);
    if (!m) return;
    const dirs = ['NE', 'NW', 'SW', 'SE'];
    const idx = dirs.indexOf(m.orientation);
    m.orientation = dirs[(idx + 1) % 4];
  }

  _reflect(dir, mirrorOrientation) {
    // 镜子方向 '/' = NE/SW, '\' = NW/SE
    const type = (mirrorOrientation === 'NE' || mirrorOrientation === 'SW') ? '/' : '\\';
    if (type === '/') {
      const map = { N: 'E', E: 'N', S: 'W', W: 'S' };
      return map[dir];
    } else {
      const map = { N: 'W', W: 'N', S: 'E', E: 'S' };
      return map[dir];
    }
  }

  _simulate() {
    // 从光源出发追踪光线路径
    const path = [];
    const visited = new Set();
    let { row, col } = this.source;
    let dir = this.source.dir || 'E';
    const dirs = { N: [-1, 0], S: [1, 0], E: [0, 1], W: [0, -1] };

    for (let step = 0; step < 40; step++) {
      const key = `${row},${col},${dir}`;
      if (visited.has(key)) break;
      visited.add(key);
      path.push({ row, col });

      // 检查是否到达目标
      if (row === this.target.row && col === this.target.col) return path;

      // 检查当前位置是否有镜子
      const mirror = this.current.find(m => m.row === row && m.col === col);
      if (mirror && (row !== this.source.row || col !== this.source.col || step > 0)) {
        dir = this._reflect(dir, mirror.orientation);
      }

      // 移动到下一个格子
      const [dr, dc] = dirs[dir];
      row += dr;
      col += dc;

      // 越界
      if (row < 0 || row >= this.size || col < 0 || col >= this.size) break;
    }
    return null;
  }

  render() {
    this.container.innerHTML = '';
    const self = this;

    const clue = document.createElement('p');
    clue.style.cssText = 'color:var(--text-dim);text-align:center;margin-bottom:8px;font-size:0.85rem;';
    clue.textContent = '点击镜子旋转方向，让光线到达目标';
    this.container.appendChild(clue);

    const grid = document.createElement('div');
    grid.style.cssText = `display:grid;grid-template-columns:repeat(${this.size}, 54px);gap:3px;justify-content:center;margin:10px 0;`;

    const path = this._simulate();
    const pathSet = new Set(path ? path.map(p => `${p.row},${p.col}`) : []);

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cell = document.createElement('div');
        cell.style.cssText = 'width:54px;height:54px;background:#111;border:1px solid #333;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;cursor:default;position:relative;transition:box-shadow 0.3s;';

        // 光源
        if (r === this.source.row && c === this.source.col) {
          cell.textContent = '💡';
          cell.style.background = '#221100';
        }
        // 目标
        else if (r === this.target.row && c === this.target.col) {
          cell.textContent = '🎯';
          cell.style.background = '#001100';
        }
        // 镜子 — 用斜线段表示，方向仅取决于 \ 或 / 类型
        const mirror = this.current.find(m => m.row === r && m.col === c);
        if (mirror) {
          const mirrorType = (mirror.orientation === 'NE' || mirror.orientation === 'SW') ? '/' : '\\';
          cell.textContent = '';
          const line = document.createElement('span');
          const deg = mirrorType === '/' ? -45 : 45;
          line.style.cssText = 'display:block;width:70%;height:2px;background:#c4a35a;transform:rotate(' + deg + 'deg);border-radius:1px;pointer-events:none;';
          cell.appendChild(line);
          cell.style.cursor = 'pointer';
          cell.title = '铜镜 (点击旋转 90°)';
          cell.style.transform = '';
          cell.addEventListener('click', () => {
            self._rotate(r, c);
            self.render();
          });
        }

        // 高亮光线路径
        if (pathSet.has(`${r},${c}`)) {
          cell.style.boxShadow = 'inset 0 0 10px rgba(200,180,100,0.5)';
          cell.style.borderColor = '#866';
        }

        grid.appendChild(cell);
      }
    }
    this.container.appendChild(grid);

    // 状态指示
    const status = document.createElement('p');
    status.style.cssText = 'color:var(--gold);text-align:center;font-size:0.85rem;min-height:1.2em;';
    status.textContent = path && path.some(p => p.row === this.target.row && p.col === this.target.col)
      ? '✓ 光线到达了目标！'
      : (path ? '光线尚未到达目标……' : '光线迷失在黑暗中……');
    this.container.appendChild(status);

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;justify-content:center;';

    const resetBtn = document.createElement('button');
    resetBtn.className = 'puzzle-reset-btn';
    resetBtn.textContent = '重置';
    resetBtn.addEventListener('click', () => {
      this.current = this._initialState.map(m => ({ ...m }));
      this.render();
    });
    btnRow.appendChild(resetBtn);

    if (path && path.some(p => p.row === this.target.row && p.col === this.target.col)) {
      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'puzzle-reset-btn';
      confirmBtn.style.cssText = 'border-color:var(--gold);color:var(--gold);';
      confirmBtn.textContent = '确认';
      confirmBtn.addEventListener('click', () => self.onSolve());
      btnRow.appendChild(confirmBtn);
    }

    this.container.appendChild(btnRow);
  }
}

// ===================== 滑动拼图引擎 =====================
// 当前第一章无场景使用（厨房场景 v0.7 移除），保留供后续章节复用
class SlidingPuzzle {
  constructor(container, config, onSolve) {
    this.container = container;
    this.size = config.size || 3;
    this.goal = [...config.goal];
    this.onSolve = onSolve;
    this.moves = 0;
    this.tiles = [];
    this.emptyIdx = -1;
    this._flashing = false;
    this._build([...config.goal]);
  }

  _build(tiles) {
    this.tiles = tiles;
    this.emptyIdx = this.tiles.indexOf(null);
    if (this.emptyIdx === -1) this.emptyIdx = tiles.length - 1;
  }

  _getNeighbors() {
    const r = Math.floor(this.emptyIdx / this.size);
    const c = this.emptyIdx % this.size;
    const n = [];
    if (r > 0) n.push(this.emptyIdx - this.size);
    if (r < this.size - 1) n.push(this.emptyIdx + this.size);
    if (c > 0) n.push(this.emptyIdx - 1);
    if (c < this.size - 1) n.push(this.emptyIdx + 1);
    return n;
  }

  _swap(idx) {
    const t = this.tiles[this.emptyIdx];
    this.tiles[this.emptyIdx] = this.tiles[idx];
    this.tiles[idx] = t;
    this.emptyIdx = idx;
  }

  // 闪现目标排列
  flashGoal(duration = 1200) {
    if (this._flashing) return;
    this._flashing = true;
    const saved = [...this.tiles];
    const savedEmpty = this.emptyIdx;
    this._build([...this.goal]);
    this.render();
    const self = this;
    setTimeout(() => {
      self._build(saved);
      self.emptyIdx = savedEmpty;
      self.render();
      self._flashing = false;
    }, duration);
  }

  shuffle(moves) {
    moves = moves || 80 + Math.floor(Math.random() * 40);
    for (let k = 0; k < moves; k++) {
      const nb = this._getNeighbors();
      this._swap(nb[Math.floor(Math.random() * nb.length)]);
    }
    this.moves = 0;
    this.render();
  }

  move(idx) {
    if (this._flashing) return false;
    if (!this._getNeighbors().includes(idx)) return false;
    this._swap(idx);
    this.moves++;
    this.render();
    if (this._checkWin()) {
      const self = this;
      setTimeout(() => self.onSolve(self.moves), 280);
    }
    return true;
  }

  _checkWin() {
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i] !== this.goal[i]) return false;
    }
    return true;
  }

  render() {
    this.container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'puzzle-grid';
    grid.style.gridTemplateColumns = 'repeat(' + this.size + ', 1fr)';

    this.tiles.forEach((tile, i) => {
      const cell = document.createElement('div');
      cell.className = 'puzzle-tile';
      if (tile === null) {
        cell.classList.add('empty');
      } else {
        cell.textContent = tile;
        if (!this._flashing && tile === this.goal[i]) cell.classList.add('correct');
        const self = this;
        cell.addEventListener('click', function () { self.move(i); });
      }
      grid.appendChild(cell);
    });

    const info = document.createElement('div');
    info.className = 'puzzle-info';
    info.textContent = '移动次数: ' + this.moves;

    const resetBtn = document.createElement('button');
    resetBtn.className = 'puzzle-reset-btn';
    resetBtn.textContent = '重置';
    const self = this;
    resetBtn.addEventListener('click', function () {
      self._build([...self.goal]);
      self.shuffle(60 + Math.floor(Math.random() * 30));
    });

    this.container.appendChild(grid);
    this.container.appendChild(info);
    this.container.appendChild(resetBtn);
  }
}

// ===================== 画符阵谜题引擎 =====================
class PatternPuzzle {
  constructor(container, config, onSolve) {
    this.container = container;
    this.size = config.size || 3;
    this.pattern = config.pattern || [0, 1, 2];
    this.onSolve = onSolve;
    this.selected = [];
  }

  render() {
    this.container.innerHTML = '';
    const self = this;

    const clue = document.createElement('p');
    clue.style.cssText = 'color:var(--text-dim);text-align:center;margin-bottom:8px;font-size:0.85rem;';
    clue.textContent = '按正确顺序点击圆点，画出符阵';
    this.container.appendChild(clue);

    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;width:240px;height:240px;margin:0 auto;';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '240');
    svg.setAttribute('height', '240');
    svg.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;';

    // 画已连接的线
    for (let i = 1; i < this.selected.length; i++) {
      const from = this.selected[i - 1];
      const to = this.selected[i];
      const fr = Math.floor(from / this.size);
      const fc = from % this.size;
      const tr = Math.floor(to / this.size);
      const tc = to % this.size;
      const x1 = 30 + fc * 90;
      const y1 = 30 + fr * 90;
      const x2 = 30 + tc * 90;
      const y2 = 30 + tr * 90;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1); line.setAttribute('y1', y1);
      line.setAttribute('x2', x2); line.setAttribute('y2', y2);
      line.setAttribute('stroke', '#c4a35a');
      line.setAttribute('stroke-width', '3');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', '0.8');
      svg.appendChild(line);
    }
    wrapper.appendChild(svg);

    // 点阵
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const idx = r * this.size + c;
        const dot = document.createElement('div');
        dot.style.cssText = `position:absolute;width:32px;height:32px;border-radius:50%;background:#1a1a2e;border:2px solid #555;top:${14 + r * 90}px;left:${14 + c * 90}px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;`;
        dot.textContent = '·';
        dot.style.color = '#555';
        dot.style.fontSize = '1.5rem';
        dot.style.lineHeight = '1';

        if (this.selected.includes(idx)) {
          dot.style.background = '#2a2010';
          dot.style.borderColor = 'var(--gold)';
          dot.style.boxShadow = '0 0 10px rgba(196,163,90,0.5)';
          dot.style.color = 'var(--gold)';
          const order = this.selected.indexOf(idx) + 1;
          dot.textContent = order;
          dot.style.fontSize = '0.9rem';
          dot.style.fontWeight = 'bold';
        }

        dot.addEventListener('click', () => {
          if (self.selected.includes(idx)) return;
          self.selected.push(idx);
          if (self.audio) self.audio.sfxClick();
          self.render();

          if (self.selected.length === self.pattern.length) {
            const match = self.selected.every((v, i) => v === self.pattern[i]);
            if (match) {
              setTimeout(() => self.onSolve(), 400);
            } else {
              setTimeout(() => {
                self.selected = [];
                self.render();
              }, 700);
            }
          }
        });
        wrapper.appendChild(dot);
      }
    }
    this.container.appendChild(wrapper);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'puzzle-reset-btn';
    resetBtn.textContent = '重置';
    resetBtn.addEventListener('click', () => {
      this.selected = [];
      this.render();
    });
    this.container.appendChild(resetBtn);
  }
}

