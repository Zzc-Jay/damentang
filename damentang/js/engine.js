// ===================== 游戏引擎 =====================
class GameEngine {
  constructor() {
    this.audio = new AudioManager();
    this.state = {
      phase: 'opening',         // 'opening' | 'playing' | 'ending'
      openingStep: 0,
      currentSceneId: 'village_entrance',
      inventory: [],
      collectedElements: {},
      flags: {},
      selectedItem: null,
      openingDone: false,
      endingSeen: null,
      inventoryPage: 0,
      settings: {
        masterVolume: 0.7,
        sfxVolume: 0.7
      }
    };
    this._clickTimer = null;
    this.cacheDom();
    this.startOpening();
  }

  // ===================== DOM 缓存 =====================
  cacheDom() {
    this.$overlay      = document.getElementById('overlay-screen');
    this.$overlayTitle = document.getElementById('overlay-title');
    this.$overlayText  = document.getElementById('overlay-text');
    this.$overlayBtn   = document.getElementById('overlay-btn');
    this.$overlayBtn2  = document.getElementById('overlay-btn2');

    this.$container    = document.getElementById('game-container');
    this.$bg           = document.getElementById('scene-background');
    this.$elements     = document.getElementById('scene-elements');
    this.$title        = document.getElementById('scene-title');
    this.$navLeft      = document.getElementById('nav-left');
    this.$navRight     = document.getElementById('nav-right');
    this.$navDown      = document.getElementById('nav-down');
    this.$holding      = document.getElementById('holding-indicator');
    this.$slots        = document.getElementById('inventory-slots');
    this.$invPrev      = document.getElementById('inv-prev');
    this.$invNext      = document.getElementById('inv-next');
    this.$invPageInd   = document.getElementById('inv-page-indicator');
    this.$dialog       = document.getElementById('dialog-box');
    this.$dialogText   = document.getElementById('dialog-text');
    this.$dialogClose  = document.getElementById('dialog-close');
    this.$choiceA      = document.getElementById('dialog-choice-a');
    this.$choiceB      = document.getElementById('dialog-choice-b');
    this.$itemDetail   = document.getElementById('item-detail');
    this.$itemDetailEmoji = document.getElementById('item-detail-emoji');
    this.$itemDetailName  = document.getElementById('item-detail-name');
    this.$itemDetailDesc  = document.getElementById('item-detail-desc');
  }

  // ===================== 开场叙事 =====================
  startOpening() {
    this.state.phase = 'opening';
    this.$overlay.classList.remove('fade-out', 'ending-dark', 'ending-light');
    this.$overlayTitle.className = '';
    this.$overlayTitle.textContent = '大 门 塘';
    this.$overlayBtn2.classList.add('hidden');
    this.$container.classList.add('hidden');
    this.state.openingStep = 0;
    // 步骤 0 仅展示标题，不展示背景文本
    this.$overlayText.classList.remove('visible');
    this.$overlayText.textContent = '';

    // 检测存档，有则显示「继续游戏」
    const saved = SaveManager.load();
    if (saved) {
      this.$overlayBtn.textContent = '点击任意位置开始';
      this.$overlayBtn2.classList.remove('hidden');
      this.$overlayBtn2.textContent = '继续游戏';
      this.$overlayBtn2.onclick = (e) => { e.stopPropagation(); this.continueGame(saved); };
    } else {
      this.$overlayBtn.textContent = '点击任意位置开始';
    }

    // 点击任意位置推进
    this._onOverlayClick = () => this.advanceOpening();
    this.$overlay.addEventListener('click', this._onOverlayClick);

    this._onKeyOpening = (e) => {
      if (this.state.phase === 'opening') {
        e.preventDefault();
        this.advanceOpening();
      }
    };
    document.addEventListener('keydown', this._onKeyOpening);
  }

  showOpeningLine() {
    const i = this.state.openingStep;
    if (i === 0) {
      // 标题画面，不显示文本
      this.$overlayText.classList.remove('visible');
      this.$overlayText.textContent = '';
      this.$overlayBtn.textContent = '点击任意位置开始';
      return;
    }
    const lineIdx = i - 1;
    if (lineIdx < OPENING.length) {
      this.$overlayText.classList.remove('visible');
      setTimeout(() => {
        this.$overlayText.textContent = OPENING[lineIdx];
        this.$overlayText.classList.add('visible');
      }, 300);
      this.$overlayBtn.textContent = lineIdx < OPENING.length - 1 ? '点击任意位置继续' : '点击进入游戏';
    }
  }

  advanceOpening() {
    this.state.openingStep++;
    // 第一次点击：隐藏标题和继续按钮，开始显示背景文本
    if (this.state.openingStep === 1) {
      this.$overlayBtn2.classList.add('hidden');
      this.$overlayTitle.classList.add('hidden');
    }
    if (this.state.openingStep > OPENING.length) {
      this.$overlay.removeEventListener('click', this._onOverlayClick);
      this.finishOpening();
    } else {
      this.showOpeningLine();
    }
  }

  finishOpening() {
    document.removeEventListener('keydown', this._onKeyOpening);
    this.state.phase = 'playing';
    this.state.openingDone = true;
    this.$overlay.classList.add('fade-out');
    this.$container.classList.remove('hidden');
    this.audio.init();
    this.loadSettings();
    this.bindGameEvents();

    this.renderInventory();
    this.loadScene('village_entrance');
  }

  continueGame(save) {
    document.removeEventListener('keydown', this._onKeyOpening);
    this.$overlay.removeEventListener('click', this._onOverlayClick);
    this.state.phase = 'playing';
    this.state.openingDone = true;
    this.$overlay.classList.add('fade-out');
    this.$container.classList.remove('hidden');
    this.audio.init();
    this.loadSettings();
    this.bindGameEvents();

    this.loadGame(save);
  }

  // ===================== 结局系统 =====================
  showEnding(endingKey) {
    this.state.phase = 'ending';
    const ending = endingKey === 'A' ? ENDING_A : ENDING_B;
    this.state.endingSeen = endingKey;
    SaveManager.delete();
    this.audio.stopAmbient();

    this.$container.classList.add('hidden');
    this.$overlay.classList.remove('fade-out');
    this.$overlay.className = ending.endingClass;
    this.$overlayTitle.className = 'ending-title' + (ending.titleClass ? ' alt' : '');
    this.$overlayTitle.textContent = ending.title;
    this.$overlayBtn2.classList.add('hidden');
    this.$overlayBtn.textContent = '……';

    this.audio.sfxEnding();

    // 如果发现了隐藏真相，在结局中插入特殊内容
    var hasTruth = this.state.inventory.includes('hidden_truth');
    var lines = [...ending.lines];
    if (hasTruth && endingKey === 'A') {
      // 加固封印 + 知道真相 → 苦涩的守护
      lines.splice(lines.length - 1, 0,
        '你说服自己：这是最好的选择。\n大门塘的平静，值得一个谎言。\n\n但姑母的声音偶尔会在梦中响起——\n"封印不是守护，是囚禁。"\n\n而你学会了假装听不到。'
      );
    } else if (hasTruth && endingKey === 'B') {
      // 打破封印 + 知道真相 → 正义的解放
      lines.splice(lines.length - 1, 0,
        '姑母没有做到的事，你做到了。\n封印破碎的那一刻，\n你听见了河神的低语——\n那不是愤怒，是感激。\n\n二十年前，姑母带着真相走进了塘底。\n今天，你带着真相走了出来。'
      );
    }

    let lineIdx = 0;
    const showNextLine = () => {
      if (lineIdx < lines.length) {
        this.$overlayText.classList.remove('visible');
        setTimeout(() => {
          this.$overlayText.textContent = lines[lineIdx];
          this.$overlayText.classList.add('visible');
          lineIdx++;
          if (lineIdx < lines.length) {
            this.$overlayBtn.textContent = '继续';
          } else {
            // 最后一行已显示 → 直接进入终态
            this.$overlayBtn.textContent = '返回标题画面';
            this.$overlayBtn.onclick = () => location.reload();
            this.$overlayBtn2.classList.remove('hidden');
            this.$overlayBtn2.textContent = '选择另一个结局';
            this.$overlayBtn2.onclick = () => {
              const alt = endingKey === 'A' ? 'B' : 'A';
              this.showEnding(alt);
            };
          }
        }, 400);
      }
    };

    this.$overlayBtn.onclick = showNextLine;
    showNextLine();
  }

  // ===================== 事件绑定 =====================
  bindGameEvents() {
    this.$navLeft.addEventListener('click', () => this.tryNavigate('left'));
    this.$navRight.addEventListener('click', () => this.tryNavigate('right'));
    this.$navDown.addEventListener('click', () => this.tryNavigate('down'));

    this.$dialogClose.addEventListener('click', () => this.hideDialog());
    this.$choiceA.addEventListener('click', () => this.handleChoice('A'));
    this.$choiceB.addEventListener('click', () => this.handleChoice('B'));

    document.getElementById('item-detail-close').addEventListener('click', () => this.hideItemDetail());
    this.$itemDetail.addEventListener('click', (e) => {
      if (e.target === this.$itemDetail) this.hideItemDetail();
    });

    this.$elements.addEventListener('click', (e) => {
      if (e.target === this.$elements && this.state.selectedItem) this.deselectItem();
    });

    this._onKeyGame = (e) => {
      if (this.state.phase !== 'playing') return;
      // 1-0 快捷键选择/使用背包道具
      if (e.key >= '0' && e.key <= '9') {
        const idx = e.key === '0' ? 9 : parseInt(e.key) - 1;
        const globalIdx = this.state.inventoryPage * 10 + idx;
        if (globalIdx < this.state.inventory.length) {
          const itemId = this.state.inventory[globalIdx];
          if (this.state.selectedItem !== itemId) {
            this.selectInventoryItem(itemId);
          } else {
            this.deselectItem();
          }
        }
        return;
      }
      switch (e.key) {
        case 'ArrowLeft':  this.tryNavigate('left'); break;
        case 'ArrowRight': this.tryNavigate('right'); break;
        case 'ArrowDown':  this.tryNavigate('down'); break;
        case 'Escape':
          if (document.getElementById('puzzle-overlay')) {
            document.getElementById('puzzle-overlay').remove();
          } else if (this.state.selectedItem) this.deselectItem();
          else { this.hideDialog(); this.hideItemDetail(); }
          break;
      }
    };
    document.addEventListener('keydown', this._onKeyGame);

    document.getElementById('btn-menu').addEventListener('click', () => {
      this.showMenuDialog();
    });

    document.getElementById('btn-hint').addEventListener('click', () => {
      const hints = {
        village_entrance: '仔细观察村口的每一个角落。\n塘边的船里也许有线索……\n漆黑的水面下似乎沉着什么东西，\n也许需要工具才能捞上来。',
        ancestral_hall: '试试把蜡烛用在香炉上。\n别忘了检查供台下面。\n匕首也许能打开什么东西。\n\n木匾上刻着三兄弟守护的顺序——\n注意看谁先谁后。\n牌位上的生辰和五行对应关系，\n或许书房木盒的符文顺序会用到。',
        study: '书桌上的木盒需要密码，祠堂牌位的符文记载了线索。\n打开木盒后，抽屉也会随之解锁。\n\n墙上的木格机关要求排列三房顺序——\n书架上的《三房纪事》记载了守护先后。\n解出后可获得打开走廊门的符纸。',
        bedroom: '枕头下面似乎藏着什么东西。\n衣柜背板上有一个九宫格拼图——\n滑动木块拼成正确的排列。\n祠堂的木匾上似乎刻着排列线索……\n解开后或许能得到重要的线索。\n\n如果你有令牌——试试暗门上的封印。',
        dark_passage: '石壁上的铜镜可以旋转——\n点击铜镜改变方向，让光线在镜面之间反弹，\n最终汇聚到目标的凹槽上。\n\n解开光线谜题后，护符和石门就会显现。',
        seal_chamber: '封印表面覆盖着符阵锁——\n九个光点排成方形，需要用正确的顺序描画。\n线索藏在祖宅的某个角落……\n\n解开符阵后，用祭祀匕首插入封印——\n做出最终的选择。'
      };
      this.showDialog(hints[this.state.currentSceneId] || '四处看看，也许会有发现。');
    });

    document.getElementById('btn-save').addEventListener('click', () => {
      if (SaveManager.save(this.state)) {
        this.audio.sfxSave();
        this.showToast('存档成功');
      } else {
        this.showToast('存档失败');
      }
    });

    document.getElementById('btn-notes').addEventListener('click', () => this.showNotes());
  }

  // ===================== 存档 =====================
  loadGame(save) {
    var sceneId = save.scene || 'village_entrance';
    // 兼容旧存档：移除的场景重定向
    if (sceneId === 'kitchen' || sceneId === 'maple_tree') sceneId = 'study';
    this.state.currentSceneId = sceneId;
    this.state.inventory = save.inventory || [];
    // 兼容旧道具ID
    var idx = this.state.inventory.indexOf('kitchen_talisman');
    if (idx >= 0) this.state.inventory[idx] = 'ancestral_ward';
    this.state.collectedElements = save.collected || {};
    this.state.flags = save.flags || {};
    this.state.openingDone = save.openingDone || false;
    this.state.endingSeen = save.endingSeen || null;
    this.state.inventoryPage = save.inventoryPage || 0;

    this.renderInventory();
    this.loadScene(this.state.currentSceneId);

    const scene = SCENES[this.state.currentSceneId];
    if (scene) this.updateNavArrows(scene);

    this.showDialog('存档已加载。\n\n欢迎回到大门塘。');
  }

  // ===================== Toast 提示 =====================
  showToast(msg) {
    const old = document.querySelector('.save-toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = 'save-toast';
    toast.textContent = msg;
    document.getElementById('scene-wrapper').appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // ===================== 场景管理 =====================
  loadScene(sceneId) {
    const scene = SCENES[sceneId];
    if (!scene) return;

    this.deselectItem();
    this.state.currentSceneId = sceneId;

    // 暗道始终使用深处模式
    if (scene.id === 'dark_passage') {
      this.$title.textContent = '通道深处';
      this.$bg.style.background = 'radial-gradient(ellipse at 50% 60%, #020203 0%, #000 80%, #000 100%)';
    } else {
      this.$title.textContent = scene.name;
      if (scene.bgGradient) this.$bg.style.background = scene.bgGradient;
    }

    // 场景 class（用于特殊动画）
    this.$elements.parentElement.className = '';
    if (scene.id === 'seal_chamber') this.$elements.parentElement.className = 'scene-seal_chamber';
    if (scene.id === 'dark_passage') this.$elements.parentElement.className = 'scene-dark_passage';

    this.updateNavArrows(scene);
    this.renderScene(scene);

    // 切换环境音
    this.audio.playAmbient(scene.id);

    // 墨水晕染转场
    var ink = document.createElement('div');
    ink.id = 'ink-overlay';
    this.$elements.parentElement.appendChild(ink);
    setTimeout(function () { ink.remove(); }, 600);
    this.$elements.classList.remove('scene-transition');
    void this.$elements.offsetWidth;
    this.$elements.classList.add('scene-transition');

    // 自动存档
    SaveManager.save(this.state);
  }

  updateNavArrows(scene) {
    if (scene.id === 'dark_passage') {
      // 暗道：始终深处模式，左箭头隐藏，右箭头发光后显示
      this.$navLeft.style.visibility = 'hidden';
      if (this.state.flags['seal_door_open']) {
        this.$navRight.style.visibility = 'visible';
        this.$navRight.classList.remove('locked');
      } else {
        this.$navRight.style.visibility = 'hidden';
      }
      this.$navDown.classList.remove('hidden');
      this.$navDown.classList.toggle('locked', false);
    } else {
      this.$navDown.classList.add('hidden');
      ['left', 'right'].forEach(dir => {
        const conn = scene.connections[dir];
        const $arrow = dir === 'left' ? this.$navLeft : this.$navRight;
        if (!conn) { $arrow.style.visibility = 'hidden'; return; }
        $arrow.style.visibility = 'visible';
        $arrow.classList.toggle('locked', conn.locked && !this.state.flags[conn.unlockFlag]);
      });
    }
  }

  renderScene(scene) {
    this.$elements.innerHTML = '';
    scene.elements.forEach(el => {
      // 可见性检查
      if (el.visibleWhen) {
        if (el.visibleWhen.flag && !this.state.flags[el.visibleWhen.flag]) return;
        if (el.visibleWhen.notFlag && this.state.flags[el.visibleWhen.notFlag]) return;
      }
      // 已收集的不显示
      if ((el.type === 'collectible' || el.type === 'door') && this.state.collectedElements[el.id]) return;

      const div = document.createElement('div');
      div.className = 'scene-element ' + (el.type || '');
      if (el.cssClass) div.classList.add(el.cssClass);
      div.dataset.elementId = el.id;
      div.dataset.type = el.type;
      if (el.itemId) div.dataset.itemId = el.itemId;
      // 图片优先，emoji 作为回退
      if (el.img) {
        const img = document.createElement('img');
        img.src = el.img;
        img.alt = el.emoji || '';
        img.className = 'scene-img';
        img.draggable = false;
        div.appendChild(img);
      } else {
        div.textContent = el.emoji;
      }
      div.style.left = el.x + '%';
      div.style.top  = el.y + '%';
      if (el.puzzle) {
        div.dataset.hasPuzzle = '1';
        div.dataset.puzzleRewardDialog = el.puzzle.reward.dialog || '';
        div.dataset.puzzleRewardGiveItem = el.puzzle.reward.giveItem || '';
        div.dataset.puzzleRewardSetFlag = el.puzzle.reward.setFlag || '';
        div.dataset.puzzleRewardHideElement = el.puzzle.reward.hideElement || '';
      }

      if (el.visibleWhen && this.state.flags[el.visibleWhen.flag]) {
        div.classList.add('revealed');
      }

      div.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.sfxClick();
        this.handleElementClick(el);
      });
      this.$elements.appendChild(div);
    });
  }

  // ===================== 导航 =====================
  tryNavigate(direction) {
    const scene = SCENES[this.state.currentSceneId];
    // 暗道：向下箭头返回上一个场景
    if (direction === 'down') {
      if (scene.id === 'dark_passage') {
        this.loadScene('bedroom');
        return;
      }
      return;
    }
    const conn = direction === 'left' ? scene.connections.left : scene.connections.right;
    if (!conn) return;
    if (conn.locked && !this.state.flags[conn.unlockFlag]) {
      this.showDialog(conn.lockedText || '此路不通。');
      return;
    }
    this.loadScene(typeof conn === 'string' ? conn : conn.id);
  }

  // ===================== 元素交互 =====================
  handleElementClick(el) {
    if (this.state.selectedItem) {
      this.tryUseItem(el);
      return;
    }
    if (el.puzzle) {
      // 谜题已解开则不再重复打开
      const rewardFlag = el.puzzle.reward && el.puzzle.reward.setFlag;
      if (!rewardFlag || !this.state.flags[rewardFlag]) {
        this.openPuzzle(el.puzzle, el.id);
        return;
      }
    }
    switch (el.type) {
      case 'collectible': this.collectItem(el); break;
      case 'hotspot':
      case 'door':
      case 'npc':
        if (el.id === 'ritual_altar') {
          var hasTruth = this.state.inventory.includes('hidden_truth');
          this.showDialog(hasTruth ? el.text :
            '封印正前方有一个石台，上面放着一本已经翻阅过无数遍的册子。\n\n第一页写着：\n"守门人之誓"\n"以血为契，以命为锁。塘底之物，永世不出。"\n\n最后一页列出了两种选择。\n旁边有人用颤抖的笔迹添了一行批注——\n但字迹被水渍模糊了，只看得到最后几个字：\n\n"……是囚禁。"\n\n也许还有别的线索能帮你还原被隐藏的真相。');
        } else if (el.id === 'central_seal' && this.state.flags['seal_pattern_solved']) {
          this.showDialog('封印表面的符阵已经解开——暗红色的保护层褪去了。\n\n封印中央露出了匕首形状的凹槽，与你的祭祀匕首完全吻合。\n封印之下传来沉重而缓慢的心跳声。\n\n——是时候使用祭祀匕首，做出最终的选择了。');
        } else {
          this.showDialog(el.text);
        }
        break;
      case 'decoration':
        if (el.text) this.showDialog(el.text); break;
    }
  }

  collectItem(el) {
    if (this.state.collectedElements[el.id]) return;

    // 飞入背包动画
    const domEl = this.$elements.querySelector('[data-element-id="' + el.id + '"]');
    if (domEl) {
      const fromRect = domEl.getBoundingClientRect();
      const invBar = document.getElementById('inventory-bar');
      const toRect = invBar.getBoundingClientRect();
      const clone = domEl.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.left = fromRect.left + 'px';
      clone.style.top = fromRect.top + 'px';
      clone.style.width = fromRect.width + 'px';
      clone.style.height = fromRect.height + 'px';
      clone.style.zIndex = '200';
      clone.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      clone.style.margin = '0';
      clone.style.transform = 'translate(0,0)';
      clone.style.pointerEvents = 'none';
      document.body.appendChild(clone);

      var self = this;
      requestAnimationFrame(function () {
        clone.style.left = (toRect.left + toRect.width / 2 - fromRect.width / 2) + 'px';
        clone.style.top = (toRect.top + toRect.height / 2 - fromRect.height / 2) + 'px';
        clone.style.opacity = '0.4';
        clone.style.transform = 'scale(0.4)';
      });
      setTimeout(function () {
        clone.remove();
      }, 420);
    }

    this.state.collectedElements[el.id] = true;
    if (el.setFlag) this.state.flags[el.setFlag] = true;
    const item = ITEMS[el.itemId];
    if (item && !this.state.inventory.includes(item.id)) {
      this.state.inventory.push(item.id);
    }
    this.audio.sfxCollect();
    // 延迟渲染让动画先开始
    var self = this;
    setTimeout(function () {
      self.renderInventory();
      self.renderScene(SCENES[self.state.currentSceneId]);
    }, 100);
    this.showDialog('「' + (item ? item.name : '物品') + '」\n已收入背包。\n\n' + (el.text || ''));
  }

  tryUseItem(el) {
    const itemId = this.state.selectedItem;
    const item = ITEMS[itemId];
    if (!item) return;

    if (!el.useItem || !el.useItem[itemId]) {
      this.showDialog('「' + item.name + '」在这里派不上用场。');
      return;
    }

    const action = el.useItem[itemId];

    // 检查是否需要先解锁
    if (action.requireFlag && !this.state.flags[action.requireFlag]) {
      this.showDialog(action.requireFlagText || '现在还无法使用。');
      return;
    }

    // 特殊：触发选择
    if (action.triggerChoice) {
      this.deselectItem();
      if (action.setFlag) this.state.flags[action.setFlag] = true;
      if (action.hideElement) this.state.collectedElements[action.hideElement] = true;
      this.audio.sfxReveal();
      this.renderScene(SCENES[this.state.currentSceneId]);
      this.showChoiceDialog();
      return;
    }

    this.deselectItem();
    this.audio.sfxUse();

    if (action.dialog) this.showDialog(action.dialog);
    if (action.setFlag) this.state.flags[action.setFlag] = true;
    if (action.giveItem) {
      const ni = ITEMS[action.giveItem];
      if (ni && !this.state.inventory.includes(ni.id)) {
        this.state.inventory.push(ni.id);
        this.renderInventory();
      }
    }
    if (action.consumeItem || action.removeItem) {
      const idx = this.state.inventory.indexOf(itemId);
      if (idx >= 0) this.state.inventory.splice(idx, 1);
      this.renderInventory();
      if (action.consumeItem) this.audio.sfxReveal();
    }
    if (action.hideElement) this.state.collectedElements[action.hideElement] = true;

    setTimeout(() => {
      this.renderScene(SCENES[this.state.currentSceneId]);
      this.updateNavArrows(SCENES[this.state.currentSceneId]);
    }, action.revealElements ? 600 : 300);
  }

  // ===================== 选择对话框 =====================
  showChoiceDialog() {
    var hasTruth = this.state.inventory.includes('hidden_truth');

    this.$dialogText.textContent =
      '匕首完美地嵌入了封印的中央。\n\n刃上的四个符文——🜂 火 · 🜄 水 · 🜁 风 · 🜃 土——逐一发出微光。\n\n你想起祖父日记中的话：\n"如果封印是守护，\n为什么需要血来维持？"\n\n你握紧匕首，割破了掌心。\n血沿着刀刃滴落——\n落在封印上时，发出了一声低沉的回响。\n\n塘底的东西醒了。\n它在听。\n\n封印开始剧烈地震动——\n四个圆环全部亮起，整个房间都在颤抖。\n\n一个声音在你脑海中响起：\n\n"守门人的后代，做出你的选择。"' +
      (hasTruth ?
        '\n\n你紧紧握着从照片和信件中发现的真相——\n封印不是守护，是囚禁。\n历代守门人守护的不是家园，\n而是一个谎言。' :
        '\n\n祖父用一生守护这个秘密，\n姑母用一生逃避它。\n而现在，轮到你了。') +
      '\n\n"加固封印——成为新的守门人，\n以你的余生延续这个循环。"\n\n"打破封印——释放塘底之物，\n让大门塘的秘密重见天日。"\n\n——你的选择将永远改变一切。';

    this.$dialogClose.classList.add('hidden');
    this.$choiceA.classList.remove('hidden');
    this.$choiceB.classList.remove('hidden');
    this.$choiceA.textContent = '加固封印 🔒';
    this.$choiceB.textContent = '打破封印 💔';
    this.$dialog.classList.remove('hidden');

    this._pendingChoice = true;
  }

  handleChoice(choice) {
    if (!this._pendingChoice) return;
    this._pendingChoice = false;

    this.$choiceA.classList.add('hidden');
    this.$choiceB.classList.add('hidden');
    this.$dialogClose.classList.remove('hidden');
    this.hideDialog();

    this.audio.sfxSolve();
    setTimeout(() => this.showEnding(choice), 600);
  }

  // ===================== 背包系统 =====================
  selectInventoryItem(itemId) {
    // 已有选中的道具 → 尝试组合
    if (this.state.selectedItem && this.state.selectedItem !== itemId) {
      const combo = this.findCombination(this.state.selectedItem, itemId);
      if (combo) {
        this.executeCombination(combo);
        return;
      }
      // 无法组合，切换选中
      this.state.selectedItem = itemId;
      this.renderInventory();
      this.updateHoldingIndicator();
      return;
    }
    if (this.state.selectedItem === itemId) { this.deselectItem(); return; }
    this.state.selectedItem = itemId;
    this.renderInventory();
    this.updateHoldingIndicator();
  }

  findCombination(itemA, itemB) {
    return COMBINATIONS.find(c =>
      (c.items[0] === itemA && c.items[1] === itemB) ||
      (c.items[0] === itemB && c.items[1] === itemA)
    );
  }

  executeCombination(combo) {
    this.audio.sfxSolve();
    // 移除两个原料
    this.state.inventory = this.state.inventory.filter(
      id => id !== combo.items[0] && id !== combo.items[1]
    );
    // 添加结果
    const resultItem = ITEMS[combo.result];
    if (resultItem && !this.state.inventory.includes(resultItem.id)) {
      this.state.inventory.push(resultItem.id);
    }
    this.state.selectedItem = null;
    this.renderInventory();
    this.updateHoldingIndicator();
    this.showDialog(combo.dialog);
  }

  deselectItem() {
    this.state.selectedItem = null;
    this.renderInventory();
    this.updateHoldingIndicator();
  }

  updateHoldingIndicator() {
    if (this.state.selectedItem) {
      const item = ITEMS[this.state.selectedItem];
      this.$holding.textContent = '使用 ' + item.emoji + ' ' + item.name + ' — 点击目标，再次点击取消';
      this.$holding.classList.remove('hidden');
    } else {
      this.$holding.classList.add('hidden');
    }
  }

  renderInventory() {
    this.$slots.innerHTML = '';
    const totalItems = this.state.inventory.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / 10));
    const page = Math.min(this.state.inventoryPage, totalPages - 1);
    this.state.inventoryPage = page;
    const startIdx = page * 10;

    for (let i = 0; i < 10; i++) {
      const slot = document.createElement('div');
      slot.className = 'inventory-slot';
      // 快捷键提示
      const keyHint = document.createElement('span');
      keyHint.style.cssText = 'position:absolute;top:2px;left:5px;font-size:0.55rem;color:var(--text-dim);opacity:0.5;pointer-events:none;';
      keyHint.textContent = i === 9 ? '0' : (i + 1);
      slot.appendChild(keyHint);
      const itemIdx = startIdx + i;
      if (itemIdx < totalItems) {
        const itemId = this.state.inventory[itemIdx];
        const item = ITEMS[itemId];
        if (item) {
          // 道具栏使用 emoji 与场景保持一致，SVG 图片仅在详情弹窗中展示
          slot.appendChild(document.createTextNode(item.emoji));
          slot.title = item.name;
          if (itemId === this.state.selectedItem) slot.classList.add('selected');
          slot.addEventListener('click', () => {
            if (this._clickTimer) {
              clearTimeout(this._clickTimer);
              this._clickTimer = null;
              this.showItemDetail(itemId);
            } else {
              this._clickTimer = setTimeout(() => {
                this._clickTimer = null;
                this.selectInventoryItem(itemId);
              }, 180);
            }
          });
        }
      } else {
        slot.classList.add('empty');
      }
      this.$slots.appendChild(slot);
    }

    // 翻页按钮
    const $prev = document.getElementById('inv-prev');
    const $next = document.getElementById('inv-next');
    if ($prev && $next) {
      $prev.classList.toggle('hidden', totalPages <= 1);
      $next.classList.toggle('hidden', totalPages <= 1);
      $prev.onclick = () => { this.state.inventoryPage = Math.max(0, page - 1); this.renderInventory(); };
      $next.onclick = () => { this.state.inventoryPage = Math.min(totalPages - 1, page + 1); this.renderInventory(); };
    }
    if (this.$invPageInd) {
      if (totalPages <= 1) {
        this.$invPageInd.classList.add('hidden');
      } else {
        this.$invPageInd.classList.remove('hidden');
        this.$invPageInd.textContent = (page + 1) + ' / ' + totalPages + ' 页';
      }
    }
  }

  // ===================== 道具详情 / 笔记 =====================
  showItemDetail(itemId) {
    const item = ITEMS[itemId];
    if (!item) return;
    this.$itemDetailEmoji.innerHTML = '';
    if (item.img) {
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.emoji || '';
      img.className = 'detail-img';
      img.draggable = false;
      this.$itemDetailEmoji.appendChild(img);
    } else {
      this.$itemDetailEmoji.textContent = item.emoji;
    }
    this.$itemDetailName.textContent  = item.name;
    this.$itemDetailDesc.textContent  = item.desc;
    this.$itemDetail.classList.remove('hidden');
  }

  hideItemDetail() { this.$itemDetail.classList.add('hidden'); }

  openPuzzle(config, elementId) {
    if (document.getElementById('puzzle-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'puzzle-overlay';
    overlay.id = 'puzzle-overlay';

    const box = document.createElement('div');
    box.className = 'puzzle-box';

    const title = document.createElement('h3');
    title.className = 'puzzle-title';
    title.textContent = config.title || '🔮 机关拼图';
    box.appendChild(title);

    const area = document.createElement('div');
    area.className = 'puzzle-area';
    box.appendChild(area);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'puzzle-close-btn';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', function () { overlay.remove(); });
    box.appendChild(closeBtn);

    overlay.appendChild(box);
    this.$container.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });

    const self = this;
    const onSolve = function () {
      setTimeout(function () {
        overlay.remove();
        self.audio.sfxSolve();

        const reward = config.reward;
        if (reward.dialog) self.showDialog(reward.dialog);
        if (reward.setFlag) self.state.flags[reward.setFlag] = true;
        if (reward.giveItem) {
          var item = ITEMS[reward.giveItem];
          if (item && self.state.inventory.indexOf(item.id) === -1) {
            self.state.inventory.push(item.id);
            self.renderInventory();
          }
        }
        if (reward.hideElement) self.state.collectedElements[reward.hideElement] = true;

        setTimeout(function () {
          self.renderScene(SCENES[self.state.currentSceneId]);
          self.updateNavArrows(SCENES[self.state.currentSceneId]);
        }, 300);
      }, 350);
    };

    if (config.type === 'sequence') {
      const puzzle = new SequencePuzzle(area, config, onSolve);
      puzzle.audio = self.audio;
      puzzle.render();
    } else if (config.type === 'light') {
      const puzzle = new LightPuzzle(area, config, onSolve);
      puzzle.render();
    } else if (config.type === 'pattern') {
      const puzzle = new PatternPuzzle(area, config, onSolve);
      puzzle.audio = self.audio;
      puzzle.render();
    } else if (config.type === 'sliding') {
      const puzzle = new SlidingPuzzle(area, config, onSolve);
      puzzle.shuffle();
      puzzle.render();
    } else {
      const puzzle = new SlidingPuzzle(area, config, onSolve);
      puzzle.shuffle();
      puzzle.render();
    }
  }

  showNotes() {
    const old = document.getElementById('notes-panel');
    if (old) old.remove();
    const panel = document.createElement('div');
    panel.id = 'notes-panel';
    let html = '<div id="notes-content"><h3>📓 笔  记</h3>';
    let hasDoc = false;
    this.state.inventory.forEach(itemId => {
      const item = ITEMS[itemId];
      if (item && item.isDocument) {
        hasDoc = true;
        html += '<div class="note-entry" data-item="' + itemId + '">';
        html += '<span class="note-emoji">';
        if (item.img) {
          html += '<img src="' + item.img + '" alt="' + (item.emoji || '') + '" class="note-img" draggable="false">';
        } else {
          html += item.emoji;
        }
        html += '</span>';
        html += '<span class="note-title">' + item.name + '</span></div>';
      }
    });
    if (!hasDoc) html += '<p style="color:var(--text-dim);text-align:center;padding:20px;">还没有收集到文档。</p>';
    html += '<button id="notes-close">关闭</button></div>';
    panel.innerHTML = html;
    this.$container.appendChild(panel);
    panel.querySelector('#notes-close').addEventListener('click', () => panel.remove());
    panel.addEventListener('click', (e) => { if (e.target === panel) panel.remove(); });
    panel.querySelectorAll('.note-entry').forEach(entry => {
      entry.addEventListener('click', () => {
        const id = entry.dataset.item;
        panel.remove();
        this.showItemDetail(id);
      });
    });
  }

  // ===================== 对话框 =====================
  showDialog(text) {
    this.$dialogText.textContent = text;
    this.$dialogClose.classList.remove('hidden');
    this.$choiceA.classList.add('hidden');
    this.$choiceB.classList.add('hidden');
    this.$dialog.classList.remove('hidden');
    this._pendingChoice = false;
  }

  hideDialog() {
    this.$dialogClose.textContent = '继续';
    this.$dialog.classList.add('hidden');
  }

  // ===================== 辅助 =====================
  // ===================== 菜单 / 重新开始 =====================
  showMenuDialog() {
    this.$dialogText.textContent = '—— 大门塘 ——\n\n第一章：归乡\n第二章：封印\n\n进度：' + this.getProgress();
    this.$dialogClose.classList.remove('hidden');
    this.$dialogClose.textContent = '重新开始';
    this.$choiceA.classList.remove('hidden');
    this.$choiceB.classList.remove('hidden');
    this.$choiceA.textContent = '继续游戏';
    this.$choiceB.textContent = '设置';
    this.$dialog.classList.remove('hidden');
    this._pendingChoice = false;
    var self = this;
    this.$choiceA.onclick = function () { self.hideDialog(); };
    this.$choiceB.onclick = function () { self.hideDialog(); self.showSettings(); };
    this.$dialogClose.onclick = function () { self.showRestartConfirm(); };
  }

  showRestartConfirm() {
    this.$dialogText.textContent = '⚠️ 确定要重新开始吗？\n\n所有游戏进度将会丢失，无法恢复。';
    this.$choiceA.textContent = '取消';
    this.$choiceB.textContent = '确认重新开始';
    const self = this;
    this.$choiceA.onclick = function () { self.hideDialog(); };
    this.$choiceB.onclick = function () { self.restartGame(); };
  }

  restartGame() {
    SaveManager.delete();
    localStorage.removeItem('damentang_settings');
    location.reload();
  }

  // ===================== 设置面板 =====================
  showSettings() {
    const old = document.getElementById('notes-panel');
    if (old) old.remove();
    const panel = document.createElement('div');
    panel.id = 'notes-panel';
    let html = '<div id="notes-content"><h3>⚙️ 设  置</h3>';

    html += '<div style="margin-bottom:18px;">';
    html += '<p style="color:var(--text-dim);margin-bottom:6px;">主音量</p>';
    html += '<input type="range" id="set-master-vol" min="0" max="100" value="' + Math.round(this.audio.getMasterVolume() * 100) + '" style="width:100%;accent-color:var(--gold);">';
    html += '</div>';

    html += '<div style="margin-bottom:18px;">';
    html += '<p style="color:var(--text-dim);margin-bottom:6px;">音效音量</p>';
    html += '<input type="range" id="set-sfx-vol" min="0" max="100" value="' + Math.round(this.audio.getSfxVolume() * 100) + '" style="width:100%;accent-color:var(--gold);">';
    html += '</div>';

    html += '<button id="notes-close">关闭</button></div>';
    panel.innerHTML = html;
    this.$container.appendChild(panel);

    var self = this;
    panel.querySelector('#set-master-vol').addEventListener('input', function () {
      var v = parseInt(this.value) / 100;
      self.audio.setMasterVolume(v);
      self.state.settings.masterVolume = v;
      self.saveSettings();
    });
    panel.querySelector('#set-sfx-vol').addEventListener('input', function () {
      var v = parseInt(this.value) / 100;
      self.audio.setSfxVolume(v);
      self.state.settings.sfxVolume = v;
      self.saveSettings();
    });
    panel.querySelector('#notes-close').addEventListener('click', function () { panel.remove(); });
    panel.addEventListener('click', function (e) { if (e.target === panel) panel.remove(); });
  }

  saveSettings() {
    try {
      localStorage.setItem('damentang_settings', JSON.stringify(this.state.settings));
    } catch (e) { /* */ }
  }

  loadSettings() {
    try {
      var raw = localStorage.getItem('damentang_settings');
      if (raw) {
        var s = JSON.parse(raw);
        this.state.settings = s;
        this.audio.setMasterVolume(s.masterVolume || 0.7);
        this.audio.setSfxVolume(s.sfxVolume || 0.7);
      }
    } catch (e) { /* */ }
  }

  getProgress() {
    let total = 0, found = 0;
    Object.values(SCENES).forEach(scene => {
      scene.elements.forEach(el => {
        if (el.type === 'collectible') { total++; if (this.state.collectedElements[el.id]) found++; }
      });
    });
    return found + ' / ' + total + ' 关键道具已收集';
  }
}
