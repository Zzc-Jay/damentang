// ===================== 开场叙事 =====================
const OPENING = [
  '杨梅坑——一个地图上几乎找不到的村子。\n\n村里所有人都姓曾，\n据说是三兄弟的后代，分成了长房、二房、三房。\n\n你的祖父是长房的最后一任守门人。',
  '三个月前，祖父失踪了。\n\n你收到了一封没有邮戳的信，\n信上只有一行字：\n「塘底的约定，该你赴了。」\n\n你不记得自己什么时候离开过杨梅坑，\n也不记得为什么离开。\n只记得村口那片黑色的水塘，\n和祖父沉默的背影。',
  '母亲从不提起杨梅坑。\n族谱上那一页被撕掉了。\n但你隐约记得一些不该记得的东西——\n水面下的呼吸声，\n镜子里不合时宜的微笑，\n烛火在无风时摇曳。\n\n小时候听大人说，\n每到月圆之夜，\n大门塘底下就会传来痛哭的声音。\n像是有什么东西困在了下面。',
  '长途跋涉之后，你终于回到了这里。\n\n村口的灯笼还亮着，\n却空无一人。\n竹椅上还搭着半件没补完的衣服，\n灶台里的柴火还没熄。\n\n每个人都像是刚刚才离开——\n又像是从来没有存在过。\n\n空气中有股淡淡的腥甜。\n是塘水的味道。',
  '——找出真相，\n或者成为秘密的一部分。'
];

// ===================== 道具定义 =====================
const ITEMS = {
  letter: {
    id: 'letter', name: '泛黄的信件', emoji: '📜', img: 'images/items/item_letter.png',
    desc: '一封字迹潦草的信，落款是祖父的名字。信中反复提到"塘底的约定"和"时辰"。末尾有一行小字："钥匙我留在了老地方，用船钩就能够到。"',
    isDocument: true
  },
  rusty_key: {
    id: 'rusty_key', name: '生锈的钥匙', emoji: '🔑', img: 'images/items/item_rusty_key.png',
    desc: '一把老旧的铁钥匙，刚从塘水里捞出来，还滴着黑水。钥匙柄上刻着一个"祠"字。'
  },
  boat_hook: {
    id: 'boat_hook', name: '船钩', emoji: '🪝', img: 'images/items/item_boat_hook.png',
    desc: '一根长长的竹竿船钩，竿身已经有些腐朽，但捞个东西应该没问题。'
  },
  candle: {
    id: 'candle', name: '半截蜡烛', emoji: '🕯️', img: 'images/items/item_candle.png',
    desc: '一根燃烧了一半的白蜡烛，放在长房的灯台上。烛泪凝固成的形状像一张扭曲的脸，烛火在无风时微微颤抖——仿佛在等待被用在某个地方。'
  },
  family_photo: {
    id: 'family_photo', name: '家族合照', emoji: '🖼️', img: 'images/items/item_family_photo.png',
    desc: '一张发黄的老照片。上面的人脸都被墨水涂黑了，只有一个人的脸还清晰——那应该是年轻时的祖父。照片背面写着一行字："长幼有序，尊卑有别"。\n\n照片的右边缘有一道不规则的撕裂痕迹——像是有人把一张完整的纸撕成了两半。另一半会在哪里？',
    isDocument: true
  },
  ritual_note: {
    id: 'ritual_note', name: '祭祀符文', emoji: '📿', img: 'images/items/item_ritual_note.png',
    desc: '香烟散开后，墙上的刻字显示了出来：\n\n"子 · 丑 · 寅 · 卯"\n"水 · 火 · 木 · 金"\n\n似乎是某种顺序的暗示……与牌位的生辰对应。',
    isDocument: true
  },
  dagger: {
    id: 'dagger', name: '祭祀匕首', emoji: '🗡️', img: 'images/items/item_dagger.png',
    desc: '藏在香炉暗格中的青铜匕首。刀刃上刻着四个古老符号：🜂 火 🜄 水 🜁 风 🜃 土。握柄已经被无数代守门人的手磨得光滑。它就是封印的钥匙——也是打破封印的工具。'
  },
  seal_token: {
    id: 'seal_token', name: '青铜令牌', emoji: '🏷️', img: 'images/items/item_seal_token.png',
    desc: '一块刻着封印图案的青铜令牌。握在手中时，能感到一阵轻微的震动——像是来自塘底的心跳。令牌背面刻着："持此令者，可入封印之间"。'
  },
  basement_map: {
    id: 'basement_map', name: '地下室地图', emoji: '🗺️', img: 'images/items/item_basement_map.png',
    desc: '手绘的地下通道地图，标注了从书房穿过厨房和卧室、经过暗门通往塘底的完整路线。途中画了一个红色警告符号——"勿扰其眠"。',
    isDocument: true
  },
  amulet: {
    id: 'amulet', name: '守门人护符', emoji: '🧿', img: 'images/items/item_amulet.png',
    desc: '在暗道石壁上发现的古老护符。上面刻着与匕首相同的四个符号，排列成圆形——象征着封印的循环。历代守门人都佩戴过它。',
    isDocument: true
  },

  aunt_letter: {
    id: 'aunt_letter', name: '姑母的警告信', emoji: '✉️', img: 'images/items/item_aunt_letter.png',
    desc: '一封藏在枕头下的信，字迹潦草而急切。\n\n"不要回来。不要继承这个诅咒。\n趁还来得及，离开大门塘。\n\n我会去塘底——这是唯一的路。\n塘底之物在梦中找到了我们每一个人。\n但我不会再逃了。\n\n它在水中，在镜中，在烛火中。\n它无处不在——\n但我找到了它的弱点。"\n\n落款是姑母的名字。日期是二十年前。\n信的末尾有一行被划掉的字，像是最后的犹豫——\n"如果我没能回来……"\n\n信的左边缘有不规则的撕裂痕迹。\n这封信从未被寄出。你猜她是故意留下的。',
    isDocument: true
  },
  ancestral_ward: {
    id: 'ancestral_ward', name: '祖祠护符', emoji: '🔖', img: 'images/items/item_ancestral_ward.png',
    desc: '从书房木柜暗格中取出的符纸，用朱砂画着三房融合的守护图案——长房的枫叶、二房的流水、三房的山形交织在一起。符纸摸起来还有余温。\n\n背面写着："知先后者，门自会开。"'
  },
  hidden_truth: {
    id: 'hidden_truth', name: '隐藏的真相', emoji: '📝', img: 'images/items/item_hidden_truth.png',
    desc: '从照片和信件的夹层中发现的隐藏文字：\n\n"封印不是守护，是囚禁。\n塘底之物并非恶物——\n它是被初代守门人囚禁的河神。\n\n姑母没有逃，她去了塘底。\n带着打破封印的决心。"\n\n——原来你一直弄错了立场。',
    isDocument: true
  },
  torn_genealogy: {
    id: 'torn_genealogy', name: '撕裂的族谱页', emoji: '📄', img: 'images/items/item_torn_genealogy.png',
    desc: '你在床板夹层里找到了半页族谱——已经发黄变脆。\n\n这一页记载着长房第十五代之后的子嗣。\n你看到了自己的名字——旁边是一个空白的方框。\n\n方框旁是母亲的字迹：\n"我的孩子不属于这里。"\n\n她把你的名字写在了族谱上——\n然后又撕掉了这一页。\n\n你终于明白了：母亲知道一切。\n她带年幼的你离开杨梅坑，\n不是为了逃避——\n是为了让你活成第一个不必站在封印前的人。\n\n但你还是回来了。\n\n族谱的空白框旁有一个隐约的指纹——\n是母亲沾了塘水按上去的。\n塘水留下了一道黑色的痕，\n像是某种祝福，也像是某种诅咒。',
    isDocument: true
  },
  pattern_clue: {
    id: 'pattern_clue', name: '符阵图', emoji: '🗺️', img: 'images/items/item_pattern_clue.png',
    desc: '从衣柜暗格中找到的一张泛黄纸片，上面是祖父手绘的符阵解锁图案：\n\n  💧(水)──●──🔥(火)\n  │  ╲    │    ╱  │\n  ●────●────●\n  │  ╱    │    ╲  │\n  💨(风)──●──🪨(土)\n\n祖父的字迹：\n"封印之间的最后一道锁。\n水(左上)→火(右上)→风(左下)→土(右下)→归一(中心)。\n四象归位，封印自解。"',
    isDocument: true
  }
};

// ===================== 道具组合配方 =====================
const COMBINATIONS = [
  {
    items: ['family_photo', 'aunt_letter'],
    result: 'hidden_truth',
    dialog: '你将家族合照和姑母的信并排放在灯下。\n\n照片背面"长幼有序，尊卑有别"八个字，\n对应着信中对"它在水中，在镜中，在烛火中"的恐惧——\n以及那句被划掉的"如果我没能回来"。\n\n你突然注意到：两张纸的边缘都有细微的撕裂痕迹，\n形状完全吻合——它们曾经是同一张纸的一部分。\n\n当两张纸拼在一起时，\n夹层中隐藏的文字浮现了出来……\n\n姑母不是疯子，也不是叛逃者——\n她是第一个看穿真相的人。\n\n（合照和信件已合并为一份新的文档，可在笔记中查看。）'
  }
];

// ===================== 场景定义 =====================
const SCENES = {

  // ========== 村口 ==========
  village_entrance: {
    id: 'village_entrance', name: '村  口',
    hint: '仔细观察村口的每一个角落。\n塘边的船里也许有线索……\n漆黑的水面下似乎沉着什么东西，\n也许需要工具才能捞上来。',
    bgImage: 'images/bg/bg_village_entrance.png',
    bgWidth: 1920, bgHeight: 1080,
    bgGradient: 'radial-gradient(ellipse at 50% 65%, #141428 0%, #0a0a18 60%, #050510 100%)',
    connections: {
      left: null,
      right: { id: 'ancestral_hall', locked: true, unlockFlag: 'ancestral_door_open',
        lockedText: '祠堂的大门紧锁着。一把老旧的铜锁挂在门上，门上刻着"曾氏宗祠"四个字。需要钥匙才能打开。' }
    },
    elements: [
      { id: 'village_gate', type: 'hotspot', emoji: '⛩️', x: 200, y: 100, bgOverlay: { w: 360, h: 600 },
        text: '村口的石牌坊已经残破不堪，上面的字被风雨侵蚀得只剩笔画。你仔细辨认——「杨梅坑」。下方还有一行小字：「曾氏三房，同气连枝」。' },
      { id: 'lantern', type: 'hotspot', emoji: '🏮', x: 1420, y: 300, bgOverlay: { w: 80, h: 100 },
        text: '村口木桩上挂着一盏纸灯笼，里面的蜡烛还在燃烧。微弱的光在一片漆黑中显得格外刺眼——有人刚刚在这里。竹椅上还搭着一件缝了一半的衣服，针还别在上面。' },
      // { id: 'old_boat', type: 'hotspot', emoji: '🚣', x: 1000, y: 1000, bgOverlay: { w: 180, h: 70 },
      //   text: '一艘老旧的小木船半沉在塘边的淤泥里，船底积了一层黑色的水。船桨还搁在原位。船舱里似乎有什么东西——一个油纸包裹。' },
      { id: 'letter_in_boat', type: 'collectible', itemId: 'letter', emoji: '📜', img: 'images/items/item_letter.png', x: 1300, y: 720, bgOverlay: { w: 80, h: 80 },
        text: '油纸包里是一封泛黄的信件。信是祖父写给你的——落款是三个月前。信中反复提到"塘底的约定"和"时辰"，末尾有一行小字："钥匙我留在了老地方，用塘边的船钩就能够到。"' },
      { id: 'hook_on_dock', type: 'collectible', itemId: 'boat_hook', emoji: '🪝', img: 'images/items/item_boat_hook.png', x: 1500, y: 400, bgOverlay: { w: 260, h: 320 },
        text: '一把长长的竹竿船钩靠在塘边的老柳树旁，看起来还能用。柳树的根扎进塘水里，树皮上刻满了歪歪扭扭的字——都是"曾"字。' },
      { id: 'dark_water', type: 'hotspot', emoji: '🌊', x: 100, y: 800, bgOverlay: { w: 800, h: 150 },
        text: '大门塘——塘水漆黑如墨，深不见底。水面偶尔冒出几个气泡，带着一股若有若无的腥甜气味。\n\n你想起小时候听过的传说：每到月圆之夜，塘底会传来痛哭的声音。大人说那是淹死在塘里的冤魂。但现在你知道——那不是冤魂。',
        useItem: { boat_hook: {
          dialog: '你把船钩伸入漆黑的大门塘水中……\n\n钩到了什么东西！\n你用力一提——一把生锈的铁钥匙被捞了上来。\n\n钥匙上沾着的不是水，是一种黏稠的黑色液体，\n在空气中缓慢地冒着细小的气泡。',
          giveItem: 'rusty_key', setFlag: 'key_retrieved', removeItem: true
        }}
      },
      { id: 'hall_door', type: 'door', emoji: '🚪', x: 1050, y: 360, bgOverlay: { w: 130, h: 200 },
        text: '祠堂就在大门塘的正前方——一扇厚重的木门，门楣上悬着"曾氏宗祠"的匾额。门上的铜锁锈迹斑斑。',
        useItem: { rusty_key: {
          dialog: '钥匙在锁孔里艰难地转了两圈……\n"咔嗒"一声，锁簧弹开了。\n\n祠堂的门缓缓打开，一股陈旧的檀香味裹着塘水的腥甜飘了出来。\n\n门后黑暗的深处，似乎有什么东西轻轻叹了口气。',
          setFlag: 'ancestral_door_open', removeItem: true
        }}
      },
      { id: 'driftwood', type: 'decoration', emoji: '🪵', x: 1500, y: 800, bgOverlay: { w: 400, h: 120 },
        text: '一块被塘水泡得发黑的浮木搁在岸边，表面刻着歪歪扭扭的几个字——"曾建国"、"曾建业"、"曾建安"。三个名字。三兄弟。三房的始祖。\n\n最下面还有一行更小的字，像是后来刻上去的：\n「发誓同生共死，永不负约。」' },    ]
  },

  // ========== 祠堂 ==========
  ancestral_hall: {
    id: 'ancestral_hall', name: '曾氏宗祠',
    hint: '试试把蜡烛用在香炉上。\n别忘了检查供台下面。\n匕首也许能打开什么东西。\n\n木匾上刻着三兄弟守护的顺序——\n注意看谁先谁后。\n牌位上的生辰和五行对应关系，\n或许书房木盒的符文顺序会用到。',
    bgImage: 'images/bg/bg_ancestral_hall.png',
    bgWidth: 1920, bgHeight: 1080,
    bgGradient: 'radial-gradient(ellipse at 50% 50%, #1a1410 0%, #0e0a08 60%, #050302 100%)',
    connections: {
      left: { id: 'village_entrance', locked: false },
      right: { id: 'study', locked: true, unlockFlag: 'study_unlocked',
        lockedText: '通往书房的走廊被一个沉重的木柜挡住了。也许祠堂里有什么机关可以移开它……' }
    },
    elements: [
      { id: 'return_ancestral_to_village', type: 'return', emoji: '🚪', x: 20, y: 160, bgOverlay: { w: 240, h: 700 } },
      // { id: 'pond_view', type: 'hotspot', emoji: '🌊', x: 480, y: 842, bgOverlay: { w: 260, h: 140 },
      //   text: '祠堂的门正对着大门塘。从门槛望出去——漆黑的水面泛着微弱的月光。\n\n小时候听老人说，月圆之夜塘底会传来哭声。但此刻你站在这里，离塘水只有几步之遥，却什么都听不到。\n\n太安静了。安静得像是塘底的东西在屏住呼吸。' },
      // { id: 'ancestral_tablets', type: 'hotspot', emoji: '🏛️', x: 960, y: 324, bgOverlay: { w: 240, h: 180 },
      //   text: '祖宗牌位分成三排，对应曾氏三房——长房、二房、三房。长房最中间的一块被翻倒了，上面刻着祖父的名字：曾守仁。' },
      { id: 'three_brothers_plaque', type: 'hotspot', emoji: '📜', x: 600, y: 260, bgOverlay: { w: 650, h: 140 },
        text: '供台最高处挂着一块老旧的木匾，按守护先后刻着三兄弟的名字：\n曾建安（三房）→ 曾建业（二房）→ 曾建国（长房）。\n\n下方一行小字——「三房为始，长房为终。兄弟同心，共守此塘。」\n\n匾额右角微微翘起，背面似乎刻着什么……' },
      { id: 'plaque_hidden_engraving', type: 'hotspot', emoji: '🔍', x: 1060, y: 420, bgOverlay: { w: 120, h: 200 },
        text: '你翻开木匾——背面果然刻着字。\n\n"守"字被人刮掉了半边，旁边有人用炭笔补了一个字——"囚"。守护的时间顺序被刻意篡改过。\n\n下方还刻着一幅九宫格图样：\n上排：枫叶 · 流水 · 山形\n中排：水纹 · 火焰 · 风纹\n下排：土纹 · 归一 · (空)\n\n旁注：「三房在上，四象居中，归一为底。」' },
      { id: 'candle_on_altar', type: 'collectible', itemId: 'candle', emoji: '🕯️', img: 'images/items/item_candle.png', x: 540, y: 454, bgOverlay: { w: 60, h: 120 },
        text: '供桌边缘放着半截白蜡烛，属于长房的灯台。烛泪堆积成了奇怪的形状，像一张无声尖叫的脸。它居然还在燃烧——也许是祖父离开前点燃的。' },
      { id: 'incense_burner', type: 'hotspot', emoji: '🪔', x: 850, y: 540, bgOverlay: { w: 160, h: 130 },
        text: '铜香炉很旧了，炉身密密麻麻刻着小字。仔细辨认——是曾氏三房历代守门人的名字，按辈分排列。炉里还有半截未燃尽的香。\n\n也许可以用火点燃它……',
        useItem: { candle: {
          dialog: '你用长房灯台上的蜡烛点燃了香炉中的残香。\n\n青烟缓缓升起，在空气中扭成了奇怪的形状——\n像是三个纠缠在一起的人影。\n\n蜡烛在香炉中燃尽了最后一滴烛泪。\n\n烟雾散开之后——\n供台后面的墙面上显出了之前看不到的文字！\n香炉底部也弹开了一个暗格……',
          setFlag: 'incense_lit', revealElements: ['hidden_inscription', 'hidden_dagger'], consumeItem: true
        }}
      },
      { id: 'hidden_inscription', type: 'collectible', itemId: 'ritual_note', emoji: '📿', img: 'images/items/item_ritual_note.png', x: 700, y: 600, bgOverlay: { w: 80, h: 80 },
        text: '墙上的刻字显示了出来：\n\n"子 · 丑 · 寅 · 卯"\n"水 · 火 · 木 · 金"\n\n长房子年属水，二房丑年属火，三房寅年属木，四代轮回归长房卯年属金——\n似是某种顺序的暗示，与三房轮值的次序呼应。',
        visibleWhen: { flag: 'incense_lit' } },
      { id: 'hidden_dagger', type: 'collectible', itemId: 'dagger', emoji: '🗡️', img: 'images/items/item_dagger.png', x: 1200, y: 600, bgOverlay: { w: 80, h: 60 },
        text: '香炉底部有一个暗格，香烟飘过后自动弹开了。里面藏着一把青铜匕首，刀刃上刻着四个古老符号：🜂 火 · 🜄 水 · 🜁 风 · 🜃 土。\n\n握柄已经被无数代守门人的手磨得光滑——曾氏三房，每一代都有人握过这把匕首。',
        visibleWhen: { flag: 'incense_lit' } },
      { id: 'photo_frame', type: 'collectible', itemId: 'family_photo', emoji: '🖼️', img: 'images/items/item_family_photo.png', x: 800, y: 800, bgOverlay: { w: 240, h: 140 },
        text: '供台下方藏着一个旧相框。是一张三房家族的合照——长房居中，二房三房分列左右。\n\n大部分人的脸都被墨水涂掉了，只留下一个人——那应该是祖父。\n\n翻过照片，背面写着八个字：\n"长幼有序，尊卑有别。\n 塘底之约，世代不违。"' },
      { id: 'small_bell', type: 'hotspot', emoji: '🔔', x: 910, y: 10, bgOverlay: { w: 80, h: 160 },
        text: '一只小铜铃挂在梁上。你轻轻摇了摇——铃声在空荡的祠堂里回荡了很久。\n\n从大门塘的方向，传来了一声低沉的回应——\n嗡——嗡——嗡——\n\n然后，水面下似乎有东西翻了个身。' },
      { id: 'stove_switch', type: 'door', emoji: '🗄️', x: 1450, y: 370, bgOverlay: { w: 450, h: 550 },
        text: '走廊入口被一个沉重的木柜挡住了。木柜上刻着四个符号槽，分别对应匕首上的四个符文：🜂 火、🜄 水、🜁 风、🜃 土。\n\n每个槽似乎都能插入，但只有正确的那个能打开三房共守的通道。你想起牌位上"长幼有序"的法则——也许不是靠蛮力，而是靠传承的次序。',
        useItem: { dagger: {
          dialog: '你深吸一口气，将匕首对准四个符号槽，逐一试探。\n\n🜂 (火)的槽——不动。二房的符号。\n🜄 (水)的槽——不动。三房的符号。\n🜁 (风)的槽——匕首插入后发出了轻微的嗡鸣！\n\n长房的符号。你的家族。\n\n🜃 (土)的槽——也是死路。\n\n只有长房的"风"能打开。风吹过的地方，门自然会开——\n这是三兄弟立下的法则：只有长房守门人能开启密道。\n\n木柜发出一声闷响，缓缓移开了。',
          setFlag: 'study_unlocked'
        }}
      },    ]
  },

  // ========== 书房 ==========
  study: {
    id: 'study', name: '书  房',
    hint: '书桌上的木盒需要密码，祠堂牌位的符文记载了线索。\n打开木盒后，抽屉也会随之解锁。\n\n墙上的木格机关要求排列三房顺序——\n书架上的《三房纪事》记载了守护先后。\n解出后可获得打开走廊门的符纸。',
    bgImage: 'images/bg/bg_study.png',
    bgWidth: 1920, bgHeight: 1080,
    bgGradient: 'radial-gradient(ellipse at 50% 55%, #14181a 0%, #0a0e10 60%, #040608 100%)',
    connections: {
      left: { id: 'ancestral_hall', locked: false },
      right: { id: 'bedroom', locked: true, unlockFlag: 'study_bedroom_open',
        lockedText: '通往卧室的走廊门上嵌着三个可旋转的木牌，分别刻着"长房""二房""三房"。门楣上刻着一行字：「守此塘者，有先有后。」\n\n需要按守护的先后顺序排列三房木牌才能打开……' }
    },
    elements: [
      { id: 'return_study_to_hall', type: 'return', emoji: '🚪',x: 406, y: 266, bgOverlay: { w: 274, h: 436 } },
      { id: 'bookshelf', type: 'hotspot', emoji: '📚', x: 22, y: 178, bgOverlay: { w: 284, h: 608 },
        text: '书架塞满了曾氏三房历代守门人的手稿。长房的族谱、二房的阵法图、三房的水文记录——三兄弟的后代各司其职。\n\n有一卷泛黄的《三房纪事》引起了你的注意——\n上面记载着初代三兄弟结义之后，\n最先守护大门塘的是三房曾建安，\n其次二房曾建业，\n最后才是长房曾建国。\n\n旁边用小字标注：「三房为始，长房为终。」' },
      { id: 'desk', type: 'hotspot', emoji: '📝', x: 788, y: 704, bgOverlay: { w: 440, h: 158 },
        text: '书桌上摊开着一本祖父的日记。最后一篇的日期就是他失踪的那一天。\n\n上面只写了一行字：\n"时辰到了。塘底的封印需要新的守门人。长房轮到我了。"\n\n往前翻几页，笔迹变得潦草：\n"三兄弟的约定不对。\n我翻遍了二房和三房的旧档——\n他们在塘底困住的不是恶物。\n是初代三兄弟背叛了它。\n如果封印是守护，为什么需要血来维持？"\n\n这一页被撕掉了大半。下面压着一张泛黄的地图。\n\n书桌抽屉里还有一本更旧的笔记——署名是曾木根。\n笔迹歪歪扭扭，像是在黑暗里写的：\n\n"守仁兄是对的。\n我也查到了三兄弟的真相。\n但我没有勇气打开这扇门。\n我在这里坐了六十年，\n看着一代又一代守门人走进塘底。\n我是最后一个曾氏族人——\n也是最懦弱的一个。\n如果她还活着，替我告诉她：对不起。"' },
      { id: 'sealed_box', type: 'hotspot', emoji: '📦', x: 464, y: 712, bgOverlay: { w: 230, h: 110 },
        text: '书桌上有一个上了锁的木盒。盒盖上刻着四个字："长幼尊卑"。\n\n这是三房共用的印信盒——需要按照长幼顺序排列四块符文才能打开。\n祠堂牌位的生辰和墙上的符文也许能帮你找到正确顺序。',
        useItem: { ritual_note: {
          dialog: '你对照符文仔细研究——\n\n"子、丑、寅、卯"是三房先祖轮值的生辰地支，\n"水、火、木、金"是它们对应的五行属性。\n\n子属水（长房）· 丑属火（二房）· 寅属木（三房）· 卯属金（轮回至长房）\n\n按照"长幼有序"的祖训，\n你在木盒上将符文排成了：水 · 火 · 木 · 金\n\n木盒应声而开！\n里面是一块刻着封印图案的青铜令牌，和一张地下通道的地图。',
          setFlag: 'box_opened', giveItem: 'seal_token', revealElements: ['desk_map'], removeItem: true
        }}
      },
      { id: 'desk_map', type: 'collectible', itemId: 'basement_map', emoji: '🗺️', img: 'images/items/item_basement_map.png', x: 970, y: 616, bgOverlay: { w: 120, h: 100 },
        text: '一张手绘的地下通道地图，标注着从书房穿过走廊、绕过枫树下旧址、通往塘底封印之间的路线。途中画了一个红色警告符号——"三房共守，勿扰其眠"。',
        visibleWhen: { flag: 'box_opened' } },
      { id: 'study_drawer', type: 'hotspot', emoji: '🗄️', img: 'images/sc/sc_study_drawer.png', x: 1400, y: 950, bgOverlay: { w: 272, h: 88 },
        text: '木盒打开的同时，书桌抽屉的锁扣也应声弹开了——它们共用同一套符文机关。\n\n抽屉里是祖父的研究笔记，他用了大半辈子追溯三房的历史。\n\n笔记最后一页写道：\n"结义→封印→质疑→警告——这是我们的时间线。\n初代三兄弟结义时是真心的，但封印之后一切都变了。\n姑母是第一个看清楚的人。她会去塘底，不是逃跑——是赎罪。"\n\n——这篇笔记与姑母的信和家族合照放在一起，\n或许能拼凑出某个被刻意隐藏的真相。',
        visibleWhen: { flag: 'box_opened' } },
      { id: 'three_house_puzzle', type: 'door', emoji: '🧩', x: 822, y: 374, bgOverlay: { w: 428, h: 160 },
        text: '墙上嵌着一个陈旧的木格机关。三个木牌分别刻着"长房""二房""三房"，可以拖拽排序。机关上方刻着一行字：「守此塘者，有先有后。」\n\n——暗示需要按守护大门塘的先后顺序排列。',
        cssClass: 'collectible',
        puzzle: {
          title: '🏛️ 三房守护之序',
          type: 'sequence',
          items: [
            { emoji: '🍂', label: '长房' },
            { emoji: '🌊', label: '二房' },
            { emoji: '⛰️', label: '三房' }
          ],
          answer: [2, 1, 0],
          reward: {
            dialog: '木牌按三房→二房→长房的顺序排列到位——\n\n机关发出一声沉闷的响声，\n暗格弹开，里面是一枚用朱砂绘制的符纸。\n\n三房的族徽——枫叶、流水、山形——交织在一起。\n背面写着：「知先后者，门自会开。」\n\n——这应该就是打开走廊门的钥匙。',
            giveItem: 'ancestral_ward', setFlag: 'three_house_puzzle_solved', hideElement: 'three_house_puzzle'
          }
        }
      },
      { id: 'bedroom_door_study', type: 'door', emoji: '🚪', x: 1402, y: 256, bgOverlay: { w: 250, h: 486 },
        text: '通往卧室的走廊门。门楣上刻着三房族徽——枫叶、流水、山形。门把手上没有锁孔，但门框上贴着一张褪色的符纸，纹路泛着暗淡的红光。',
        useItem: { ancestral_ward: {
          dialog: '你将祖祠护符贴在门框上……\n\n两张符纸产生了共鸣——旧符纸上的红光褪去，新符纸发出一阵温热的光芒。\n\n门缓缓打开了。通往卧室的走廊里飘出一股陈旧的尘埃味，\n夹杂着枫叶腐朽的甜香。',
          setFlag: 'study_bedroom_open', removeItem: true
        }}
      },    ]
  },

  // ========== 卧室 ==========
  bedroom: {
    id: 'bedroom', name: '卧  室',
    hint: '枕头下面似乎藏着什么东西。\n衣柜背板上有一个九宫格拼图——\n滑动木块拼成正确的排列。\n祠堂的木匾上似乎刻着排列线索……\n解开后或许能得到重要的线索。\n\n如果你有令牌——试试暗门上的封印。',
    bgImage: 'images/bg/bg_bedroom.png',
    bgWidth: 1920, bgHeight: 1080,
    bgGradient: 'radial-gradient(ellipse at 50% 55%, #181415 0%, #0e0a0b 60%, #050303 100%)',
    connections: {
      left: { id: 'study', locked: false },
      right: { id: 'dark_passage', locked: true, unlockFlag: 'basement_unlocked',
        lockedText: '卧室的尽头是一扇暗门，上面画着一个复杂的封印图案。需要对应的令牌才能打开……' }
    },
    elements: [
      { id: 'return_bedroom_to_study', type: 'return', emoji: '🚪', x: 12, y: 152, bgOverlay: { w: 154, h: 714 } },
      { id: 'bed', type: 'hotspot', emoji: '🛏️', x: 674, y: 614, bgOverlay: { w: 390, h: 136 },
        text: '一张收拾得整整齐齐的床，却蒙着厚厚的灰尘。\n\n被褥叠得一丝不苟，枕头也端端正正——住在这里的人离开时很从容。\n\n或者说……是再也没打算回来。\n\n床板的夹层似乎有什么东西……' },
      { id: 'genealogy_page', type: 'collectible', itemId: 'torn_genealogy', emoji: '📄', x: 653, y: 818, bgOverlay: { w: 156, h: 84 },
        text: '你在床板夹层里找到了半页族谱——已经发黄变脆。这一页记载着长房第十五代之后的子嗣。\n\n你的名字旁边有一个空白的方框。方框旁是母亲的字迹——\n"我的孩子不属于这里。"\n\n你终于明白了：母亲知道一切。她带年幼的你离开杨梅坑，不是为了逃避——是为了让你活成第一个不必站在封印前的人。\n\n但你还是回来了。' },
      { id: 'pillow_letter', type: 'collectible', itemId: 'aunt_letter', emoji: '✉️', img: 'images/items/item_aunt_letter.png', x: 541, y: 569, bgOverlay: { w: 92, h: 60 },
        text: '枕头下面露出一角泛黄的信纸。\n\n你轻轻抽出来——是一封信，上面的字迹潦草而急切。这是姑母的笔迹。\n\n她曾试图警告下一任继承人……但信从未被寄出。',
        setFlag: 'aunt_letter_found' },
      { id: 'wardrobe', type: 'door', emoji: '🚪', x: 1438, y: 268, bgOverlay: { w: 160, h: 488 },
        text: '一个老旧的雕花衣柜，门虚掩着。里面空荡荡的，只剩下一件黑色的长袍孤零零地挂着。\n\n那是守门人的礼服。衣领内侧用金线绣着四个符号：🜄 🜂 🜁 🜃\n\n长袍的左袖口有一片暗色的污渍——已经干涸了很久。是血。\n\n衣柜背板上嵌着一块九宫格木盘，格子里散落着刻有符文的小木块。似乎需要将它们拼成正确的排列——祠堂里或许有线索。',
        cssClass: 'collectible',
        puzzle: {
          title: '🧩 符文拼图',
          type: 'sliding',
          size: 3,
          goal: ['🍂', '🌊', '⛰️', '🜄', '🜂', '🜁', '🜃', '✧', null],
          reward: {
            dialog: '木块拼成了正确的排列——衣柜背板发出一声轻响，弹开了一个暗格。\n\n里面是一张泛黄的纸，上面画着一个符阵图案：\n\n  💧(水)──●──🔥(火)\n  │  ╲    │    ╱  │\n  ●────●────●\n  │  ╱    │    ╲  │\n  💨(风)──●──🪨(土)\n\n旁边有一行祖父的字迹：\n"封印之间的最后一道锁。\n水(左上)→火(右上)→风(左下)→土(右下)→归一(中心)。\n四象归位，封印自解。"\n\n——这就是封印之间中央封印的符阵解锁图案。\n符阵图已收入背包，可随时在笔记中查看。',
            setFlag: 'wardrobe_pattern_found', hideElement: 'wardrobe', giveItem: 'pattern_clue'
          }
        }
      },
      { id: 'mirror', type: 'hotspot', emoji: '🪞', x: 298, y: 436, bgOverlay: { w: 114, h: 130 },
        text: '一面蒙尘的梳妆镜，边框是缠枝花纹。\n\n你用手擦了擦镜面——镜中的自己看起来有些陌生。脸上的表情不太对。\n\n也许只是光线的问题。\n\n你又看了一眼。镜中的你正在微笑。但你并没有笑。\n\n你迅速移开了视线。' },
      { id: 'clock', type: 'hotspot', emoji: '🕰️', x: 1254, y: 261, bgOverlay: { w: 102, h: 464 },
        text: '一座老式红木座钟，指针停在午夜十二点整。\n\n你伸手碰了碰钟摆——冰冷刺骨，像摸到了一块冰。钟面的玻璃上有人用指甲刻了一行歪歪扭扭的字：\n\n"时间到了。"\n\n旁边还刻着四个更小的字——几乎看不清楚——\n"该你了。"' },      { id: 'old_well_decor', type: 'decoration', emoji: '🕳️', x: 990, y: 411, bgOverlay: { w: 180, h: 138 },
        text: '卧室窗外能看到枫树下旧址——那棵老枫树已经枯死了，树下有一口被封住的枯井。铁链上挂满了褪色的红布条，每一条上都写着一个曾氏族人的名字。\n\n最下面一条的颜色还鲜红，上面写着你的名字。' },
      { id: 'basement_door_bedroom', type: 'door', emoji: '🚪', x: 1738, y: 272, bgOverlay: { w: 168, h: 534 },
        text: '卧室尽头的一扇暗门，门上刻着复杂的封印图案——与令牌上的纹路完全一致。图案中央有一个凹槽。\n\n这就是通往地下室的路。',
        useItem: { seal_token: {
          dialog: '你将青铜令牌嵌入了暗门的凹槽。\n\n封印图案突然绽放出刺眼的暗红色光芒——\n然后缓缓裂开，像一道愈合了太久又重新撕开的伤口。\n\n门后传来低沉的轰鸣声，整个房间都在微微颤抖。\n\n——通往塘底的路，终于打开了。',
          setFlag: 'basement_unlocked', removeItem: true
        }}
      },
      { id: 'rug', type: 'decoration', emoji: '🧶', x: 1022, y: 902, bgOverlay: { w: 342, h: 98 },
        text: '一张手工编织的地毯，边缘已经磨损得厉害。掀开一角——地板上有人用指甲刻了四个歪歪扭扭的字："我要出去"。' },    ]
  },
  // ========== 暗道 ===========
  dark_passage: {
    id: 'dark_passage', name: '暗  道',
    hint: '石壁上的铜镜可以旋转——\n点击铜镜改变方向，让光线在镜面之间反弹，\n最终汇聚到目标的凹槽上。\n\n解开光线谜题后，护符和石门就会显现。',
    bgImage: 'images/bg/bg_dark_passage.png',
    bgWidth: 1920, bgHeight: 1080,
    bgGradient: 'radial-gradient(ellipse at 50% 60%, #050508 0%, #020203 60%, #000 100%)',
    connections: {
      left: { id: 'bedroom', locked: false },
      right: { id: 'seal_chamber', locked: true, unlockFlag: 'seal_door_open',
        lockedText: '一扇古老的石门挡住了去路。门上雕刻着与护符相同的符号。将护符嵌入凹槽也许能打开它……' }
    },
    elements: [
      { id: 'return_passage_to_bedroom', type: 'return', emoji: '🚪', x: 56, y: 410, bgOverlay: { w: 266, h: 592 } },
      { id: 'darkness', type: 'hotspot', emoji: '🕳️', x: 1450, y: 510, bgOverlay: { w: 280, h: 426 },
        text: '前方被浓得化不开的黑暗完全吞没。\n\n你隐约能感觉到——黑暗的尽头似乎有一扇门，但光靠肉眼根本看不清。\n\n如果能利用石壁上的铜镜，将光线反射过来……',
        visibleWhen: { notFlag: 'mirror_aligned' } },
      { id: 'mirror_puzzle', type: 'door', emoji: '🪞', x: 880, y: 284, bgOverlay: { w: 332, h: 416 },
        text: '石壁上镶嵌着几面古老的铜镜，排列成奇特的阵型。微弱的光线在镜面之间折射变幻——旋转它们，让光线汇聚到前方石门的凹槽上。',
        cssClass: 'collectible',
        puzzle: {
          title: '🪞 反射之光',
          type: 'light',
          size: 4,
          source: { row: 0, col: 0, dir: 'E' },
          target: { row: 3, col: 3 },
          mirrors: [
            { row: 0, col: 1, orientation: 'NW' },
            { row: 1, col: 1, orientation: 'NW' },
            { row: 1, col: 2, orientation: 'NW' },
            { row: 2, col: 2, orientation: 'NW' },
            { row: 2, col: 3, orientation: 'SE' }
          ],
          reward: {
            dialog: '铜镜旋转到位——\n\n微弱的光线在镜面之间反弹了五次，最终汇聚成一束明亮的光柱，\n照亮了石壁上之前被黑暗遮蔽的凹槽。\n\n一枚古老的护符嵌在其中，\n而护符正对着的——是一扇刻满封印符文的石门。',
            setFlag: 'mirror_aligned', revealElements: ['amulet_on_wall', 'seal_door'], hideElement: 'mirror_puzzle'
          }
        }
      },
      { id: 'wall_carving', type: 'hotspot', emoji: '📜', x: 386, y: 188, bgOverlay: { w: 384, h: 686 },
        text: '石壁上刻满了古老的文字。分成了两个部分——\n\n上半部分的字迹工整庄重，是三兄弟的结义誓约：\n\n"曾建安、曾建业、曾建国，\n三人结为兄弟。\n有福同享，有难同当。\n若有背叛，塘底为证。"\n\n下半部分字迹潦草愤怒，年代更晚，像是被人用匕首一刀一刀刻上去的：\n\n"我们骗了后人。\n\n塘底的河神不是恶物——\n它是杨梅坑的守护灵，\n庇佑此地不知多少代人。\n\n但初代三兄弟发现——\n河神的力量能让田地丰收、让血脉延续。\n三房联手，趁月食之夜将它囚禁在塘底，\n立下血契——每代守门人以血加固封印，\n从河神身上榨取力量。\n\n这就是大门塘真正的秘密。\n不是守护，是囚禁。\n不是牺牲，是偷窃。\n\n——这笔迹我认得，是姑母。"' },
      { id: 'amulet_on_wall', type: 'collectible', itemId: 'amulet', emoji: '🧿', img: 'images/items/item_amulet.png', x: 1172, y: 726, bgOverlay: { w: 80, h: 80 },
        text: '一枚古老的护符嵌在石壁的凹槽中，上面刻着与匕首相同的四个符号：🜂 🜄 🜁 🜃。这是历代守门人的信物。',
        visibleWhen: { flag: 'mirror_aligned' } },
      { id: 'seal_door', type: 'door', emoji: '🚪', img: 'images/sc/sc_seal_door.png', x: 1450, y: 510, bgOverlay: { w: 288, h: 432 },
        text: '一扇古老的石门，上面刻着四个符号组成的封印图案。门的中央有一个护符形状的凹槽。',
        visibleWhen: { flag: 'mirror_aligned' },
        useItem: { amulet: {
          dialog: '你将守门人护符嵌入石门的凹槽……\n\n四个符号依次亮起——🜄 水 · 🜂 火 · 🜁 风 · 🜃 土——\n石门缓缓打开了。\n\n一股陈腐的腥味扑面而来，伴着低沉的、像是心跳的震动。\n\n——封印之间就在前方。',
          setFlag: 'seal_door_open', removeItem: true
        }}
      },
      { id: 'water_drip', type: 'decoration', emoji: '💧', x: 962, y: 866, bgOverlay: { w: 588, h: 176 },
        text: '水滴从岩缝中渗出，滴落在脚边的石板上——然后消失。没有水花，没有水迹。它就这么不见了，像是被黑暗本身喝掉了。' }
    ]
  },

  // ========== 封印之间 ==========
  seal_chamber: {
    id: 'seal_chamber', name: '封印之间',
    hint: '封印表面覆盖着符阵锁——\n九个光点排成方形，需要用正确的顺序描画。\n线索藏在祖宅的某个角落……\n\n解开符阵后，用祭祀匕首插入封印——\n做出最终的选择。',
    bgImage: 'images/bg/bg_seal_chamber.png',
    bgWidth: 1920, bgHeight: 1080,
    bgGradient: 'radial-gradient(ellipse at 50% 55%, #1a1015 0%, #0a0508 60%, #030102 100%)',
    connections: {
      left: { id: 'dark_passage', locked: false },
      right: null
    },
    elements: [
      { id: 'return_seal_to_passage', type: 'return', emoji: '🚪', x: 182, y: 382, bgOverlay: { w: 130, h: 200 } },
      { id: 'central_seal', type: 'door', emoji: '🔴', x: 838, y: 678, bgOverlay: { w: 284, h: 140 },
        text: '房间的中央是一道巨大的圆形封印，散发着微弱的暗红色光芒。\n\n封印由四个同心圆环组成，每个环上都刻满了密密麻麻的古老文字。封印的表面覆盖着一层半透明的符阵——九个光点在暗红色光膜上排列成方形。\n\n符阵下方，封印的中心有一个匕首形状的凹槽——与你的祭祀匕首完全吻合。\n\n你能感觉到——封印之下，有什么东西在缓慢地、沉重地呼吸。\n\n这就是祖父在信中提到的"塘底的约定"。\n但首先……你需要解开封印上的符阵。',
        cssClass: 'seal-core',
        puzzle: {
          title: '✧ 四象归一符阵',
          type: 'pattern',
          size: 3,
          pattern: [0, 2, 6, 8, 4],
          reward: {
            dialog: '符阵画完了——水→火→风→土→归一。\n\n封印上的符文锁发出一声嗡鸣，暗红色的光芒闪了闪，\n保护层裂开了。\n\n现在……你可以用祭祀匕首插入封印，做出最终的选择。',
            setFlag: 'seal_pattern_solved'
          }
        },
        useItem: { dagger: {
          requireFlag: 'seal_pattern_solved',
          requireFlagText: '封印表面覆盖着一层符阵——九个光点排列成方形。需要先画出正确的符阵图案才能解除保护层。\n\n也许卧室里那个雕花衣柜的符文配对机关藏着线索……',
          dialog: null,
          setFlag: 'dagger_placed',
          triggerChoice: true
        }}
      },
      { id: 'four_pillars', type: 'hotspot', emoji: '🗿', x: 446, y: 224, bgOverlay: { w: 122, h: 362 },
        text: '四根石柱围绕着中央封印，每根柱子上都刻着一个符号：\n🜄 水 · 🜂 火 · 🜁 风 · 🜃 土\n\n柱子表面有深深的磨损痕迹——是无数代守门人的手抚摸所致。' },
      { id: 'ritual_altar', type: 'hotspot', emoji: '🗿', x: 1638, y: 762, bgOverlay: { w: 220, h: 76 },
        text: '封印正前方有一个石台，上面放着一本已经翻阅过无数遍的册子。\n\n第一页写着：\n"守门人之誓"\n"以血为契，以命为锁。塘底之物，永世不出。"\n\n你翻到最后一页——上面列出了两种选择。但在选择的旁边，有人用颤抖的笔迹加了一行批注：\n\n"不是守护，是囚禁。\n第一代守门人撒了谎。"\n\n——与你在照片和信中发现的隐藏文字一模一样。\n看来姑母也曾站在这里。' },
      { id: 'npc_keepers', type: 'npc', emoji: '👥', img: 'images/npc/npc_keepers.png', x: 970, y: 470, bgOverlay: { w: 612, h: 300 },
        cssClass: 'npc',
        text: '历代守门人的残影围在封印四周，一圈又一圈。\n\n姑母曾秀兰站在圈外。\n封印上那道旧裂痕是她二十年前留下的——\n她没有失败，只是不够强。\n\n她看着你，无声地说：\n『轮到你了。』\n\n——下一道锁，还是第一把钥匙？',
        visibleWhen: { flag: 'seal_pattern_solved' } }
    ]
  }
};

// ===================== 结局文本 =====================
const ENDING_A = {  // 加固封印
  title: '—— 守 门 人 ——',
  titleClass: 'alt',
  lines: [
    '你将匕首插入封印的中央，\n按照守门人的誓言——以血为契，以命为锁。',
    '封印的四个圆环开始缓缓转动……\n暗红色的光芒逐渐稳定下来，变得明亮而温暖。',
    '塘底的震动停止了。\n水面恢复了平静——至少在你这一代。',
    '你成为了新的守门人。\n大门塘的秘密将继续沉睡，直到下一个继承人到来。',
    '祖父的声音仿佛在耳边响起：\n"做得对，孩子。这是我们的宿命。"',
    '你望着黑色的塘水，\n第一次感到了一种奇异的平静。',
    '—— 大门塘 · 守护结局 ——\n\n"有些秘密，值得用一生去守护。"'
  ],
  endingClass: 'ending-light'
};

const ENDING_B = {  // 打破封印
  title: '—— 破 封 ——',
  titleClass: '',
  lines: [
    '你握紧匕首，用力划破了封印的中央。',
    '封印发出一声刺耳的尖啸——\n四个圆环开始反向旋转，暗红色的光芒变成了漆黑。',
    '塘底的水开始沸腾。\n石柱崩塌，地面裂开……\n有什么巨大的东西正在从封印下方升起。',
    '你看到了它——只一瞬间——\n那个被封印了无数代人的"东西"。\n它不可名状，不可理解，不可直视。',
    '你听到了祖父的叹息，\n听到了历代守门人的哀鸣，\n听到了大门塘的哭泣。',
    '然后，一切归于寂静。\n水面上只剩下一个巨大的、不断扩大的漩涡。\n而你已经不在那里了。',
    '—— 大门塘 · 破封结局 ——\n\n"有些秘密，一旦打开，就再也关不上了。"'
  ],
  endingClass: 'ending-dark'
};
