# Spec: 大门塘 素材全面替换（PNG 版）

> 版本：v2.0 | 日期：2026-05-15 | 状态：待审核

## 一、Objective

将《大门塘》全部视觉素材从 emoji 替换为定制手绘 PNG 图像。总需 **~80 张** PNG 图片。

## 二、PNG 尺寸规范

| 类别 | 推荐 PNG 尺寸 | CSS 实际渲染 | 说明 |
|------|--------------|-------------|------|
| 场景元素图标 | **200×200 px** | 56×56px（桌）/ 40×40px（移） | 透明背景，约 @3x 保证高清 |
| NPC 残影 | **180×180 px** | 48×48px | 半透明剪影效果 |
| 封印核心 | **280×280 px** | 80×80px | 中央封印专用，需更大 |
| 道具图标 | **256×256 px** | 44px（背包）/ 96px（详情） | 透明背景 |
| 场景背景 | **1920×1080 px** | 全屏 | 不透明，暗黑手绘风格 |
| UI 图标 | **128×128 px** | ~28px（实际渲染较小） | 透明背景，单色线稿 |

**通用要求：**
- 格式：PNG-24（支持半透明）
- 色彩空间：sRGB
- 命名：`snake_case.png`
- 色系：墨绿 / 暗棕 / 锈红 / 灰蓝（遵循需求文档 4.1）

---

## 三、完整图片清单

### 3.1 场景背景（6 张 · 1920×1080 px）

| 文件名 | 场景 | 画面描述 |
|--------|------|----------|
| `bg_village_entrance.png` | 村口 | 大门塘漆黑水面占据画面下方 1/3，水面冒气泡。左侧残破石牌坊刻"杨梅坑"。岸边老柳树挂纸灯笼，半沉木船搁浅淤泥中。远景枯树林 + 灰暗天空 |
| `bg_ancestral_hall.png` | 祠堂 | 昏暗祠堂室内。正面供台高三层，摆三排祖宗牌位。供台上方悬木匾（三兄弟名字）。供台两侧烛台，铜香炉居中。地面青砖，梁上挂小铜铃。门洞可见外面塘水 |
| `bg_study.png` | 书房 | 满墙书架塞满古籍手稿。中央书桌摊开发黄日记，桌上有木盒。窗外透入微弱冷光。墙角蛛网，地面散落纸张 |
| `bg_bedroom.png` | 卧室 | 整齐床铺蒙灰，雕花衣柜虚掩露出黑袍一角。梳妆镜蒙尘，红木座钟指针停在 12 点。窗外可见枯井+红布条。暗门在画面右侧 |
| `bg_dark_passage.png` | 暗道 | 极暗石壁通道，仅前方透微弱光。石壁上嵌古老铜镜若干面。岩缝渗出水滴。尽头隐约可见石门轮廓 |
| `bg_seal_chamber.png` | 封印之间 | 地下密室。中央巨大圆形封印散发暗红光芒。四根石柱围住封印，刻四元素符号。地面有裂纹。无数模糊人影围成圆圈 |

---

### 3.2 场景元素图标（54 张 · 200×200 px · 透明背景）

#### 3.2.1 村口 — 9 张

| 文件名 | 对应元素 | 图标内容 |
|--------|----------|----------|
| `sc_village_gate.png` | 石牌坊 | 残破石牌坊局部，风化刻字"杨梅坑" |
| `sc_lantern.png` | 纸灯笼 | 竹骨纸灯笼，暖黄微光，灯底穗子 |
| `sc_old_boat.png` | 旧木船 | 半沉淤泥中的破旧木船，船桨搁置 |
| `sc_dark_water.png` | 大门塘水面 | 漆黑水面，几个气泡冒出 |
| `sc_hall_door.png` | 祠堂大门 | 厚重木门，铜锁，门楣"曾氏宗祠"匾 |
| `sc_driftwood.png` | 浮木 | 泡黑的浮木，刻"曾建国/曾建业/曾建安" |
| `sc_letter_in_boat.png` | 油纸包信件 | 可复用道具图 `item_letter.png`（下面会定义） |
| `sc_hook_on_dock.png` | 船钩 | 可复用道具图 `item_boat_hook.png` |
| `sc_old_boat_detail.png` | 船舱油纸包 | 船底半露的油纸包裹 |

> 注：`letter_in_boat` 和 `hook_on_dock` 在 data.js 中已加 `img` 字段指向道具图，这两个可复用不需独立绘制

#### 3.2.2 祠堂 — 12 张

| 文件名 | 对应元素 | 图标内容 |
|--------|----------|----------|
| `sc_pond_view.png` | 从祠堂望塘水 | 门框前景 + 远景漆黑水面 |
| `sc_tablets.png` | 祖宗牌位 | 三排木牌，中间一块翻倒 |
| `sc_plaque.png` | 三兄弟木匾 | 古旧木匾，刻三个名字+九宫格图样 |
| `sc_candle_on_altar.png` | 蜡烛 | 可复用 `item_candle.png` |
| `sc_incense_burner.png` | 铜香炉 | 满刻小字的旧铜炉，半截残香 |
| `sc_hidden_inscription.png` | 墙上显现的符文 | 可复用 `item_ritual_note.png` |
| `sc_hidden_dagger.png` | 暗格中匕首 | 可复用 `item_dagger.png` |
| `sc_photo_frame.png` | 旧相框 | 可复用 `item_family_photo.png` |
| `sc_bell.png` | 梁上铜铃 | 小铜铃挂梁上，系红绳 |
| `sc_stove_switch.png` | 木柜机关 | 沉重雕花木柜，四个符文凹槽 |
| `sc_offering_table.png` | 供台 | 供台供果+烛台（背景装饰） |
| `sc_incense_smoke.png` | 香烟 | 青烟袅袅上升（可用 CSS 动画替代） |

#### 3.2.3 书房 — 10 张

| 文件名 | 对应元素 | 图标内容 |
|--------|----------|----------|
| `sc_bookshelf.png` | 书架 | 塞满老旧线装书的书架 |
| `sc_desk.png` | 书桌 | 摊开日记+墨迹+散落信纸 |
| `sc_sealed_box.png` | 木盒 | 刻"长幼尊卑"的陈旧印信盒 |
| `sc_desk_map.png` | 地下地图 | 可复用 `item_basement_map.png` |
| `sc_drawer.png` | 书桌抽屉 | 弹开的旧抽屉，里面是笔记 |
| `sc_three_house_puzzle.png` | 三房木格机关 | 墙面木格，三个可拖拽木牌 |
| `sc_bedroom_door.png` | 走廊门 | 嵌三房族徽的门，贴符纸 |
| `sc_inkstone.png` | 砚台 | 桌上石砚+墨条（装饰） |
| `sc_cobweb.png` | 蛛网 | 墙角蛛网（装饰） |
| `sc_candle_stub.png` | 残烛 | 桌上小半截蜡烛（装饰） |

#### 3.2.4 卧室 — 12 张

| 文件名 | 对应元素 | 图标内容 |
|--------|----------|----------|
| `sc_bed.png` | 床 | 整齐却蒙灰的床，枕头端正 |
| `sc_genealogy_page.png` | 族谱页 | 可复用 `item_torn_genealogy.png` |
| `sc_pillow_letter.png` | 枕头下信 | 可复用 `item_aunt_letter.png` |
| `sc_wardrobe.png` | 雕花衣柜 | 虚掩柜门，黑袍露出一角 |
| `sc_mirror.png` | 梳妆镜 | 椭圆形缠枝镜框，蒙尘镜面 |
| `sc_clock.png` | 座钟 | 红木座钟，指针 12:00，玻璃上刻字 |
| `sc_old_well.png` | 窗外枯井 | 枫树下枯井，铁链红布条 |
| `sc_basement_door.png` | 暗门 | 刻封印图案的厚重暗门 |
| `sc_rug.png` | 地毯 | 磨损的手织地毯一角掀开 |
| `sc_window.png` | 窗 | 卧室窗+窗外枫树枯枝（装饰） |
| `sc_robe.png` | 守门人黑袍 | 衣柜中黑袍+金线四符号（装饰） |
| `sc_floor_scratch.png` | 地板刻字 | 地板"我要出去"刻痕（装饰） |

#### 3.2.5 暗道 — 6 张

| 文件名 | 对应元素 | 图标内容 |
|--------|----------|----------|
| `sc_darkness.png` | 黑暗深处 | 浓稠黑暗中隐约通道轮廓 |
| `sc_mirror_puzzle.png` | 铜镜阵 | 石壁上嵌古老铜镜，光线折射 |
| `sc_wall_carving.png` | 石刻铭文 | 可复用 `item_ritual_text.png` |
| `sc_amulet_on_wall.png` | 壁上护符 | 可复用 `item_amulet.png` |
| `sc_seal_door.png` | 封印石门 | 刻四符号封印图案的石门，中央凹槽 |
| `sc_water_drip.png` | 水滴 | 岩缝渗出水滴将落未落 |

#### 3.2.6 封印之间 — 5 张

| 文件名 | 对应元素 | 图标内容 |
|--------|----------|----------|
| `sc_central_seal.png` | 中央封印 | 巨大圆形封印，暗红光芒，九个光点阵（280×280px） |
| `sc_four_pillars.png` | 四石柱 | 刻水/火/风/土符号的石柱 |
| `sc_ritual_altar.png` | 石台册子 | 石台上摊开的守门人之誓 |
| `sc_seal_crack.png` | 封印裂痕 | 封印表面旧裂痕（装饰） |
| `sc_dagger_slot.png` | 匕首凹槽 | 封印中心匕首形状凹槽 |

---

### 3.3 NPC 残影（6 张 · 180×180 px · 半透明）

NPC 图片渲染时 CSS 有 `opacity: 0.75` 和 `filter: drop-shadow(...)`，所以图片本身不必处理透明度，正常绘制即可。

| 文件名 | 对应元素 | 人物 | 画面描述 |
|--------|----------|------|----------|
| `npc_grandfather_dock.png` | 塘边祖父残影 | 祖父 | 苍老男性半身剪影，略微发光，抬手指向祠堂方向 |
| `npc_aunt_whisper.png` | 祠堂姑母烟雾 | 姑母 | 女性半身剪影，烟雾缠绕效果，表情焦虑摇头 |
| `npc_grandfather_study.png` | 书房祖父幻影 | 祖父 | 苍老男性坐姿剪影，低头书写，暖黄残影光晕 |
| `npc_mugen.png` | 卧室村长木根 | 木根 | 干瘦老人剪影，背对站立，微微驼背 |
| `npc_aunt_bedroom.png` | 卧室姑母写信 | 姑母 | 女性坐姿剪影，在镜前低头写信 |
| `npc_keepers.png` | 守门人集体 | 历代守门人 | 多个模糊半透明人影围成圆圈，俯视视角 |

---

### 3.4 道具图标（16 张 · 256×256 px · 透明背景）

#### 3.4.1 已有 emoji 参考但需重新绘制（16 张）

| 文件名 | 道具名 | emoji 参考 | 画面描述 |
|--------|--------|-----------|----------|
| `item_letter.png` | 泛黄的信件 | 📜 | 泛黄折痕信纸，潦草字迹，落款祖父 |
| `item_rusty_key.png` | 生锈的钥匙 | 🔑 | 老旧铁钥匙，沾黑色黏液，柄刻"祠"字 |
| `item_boat_hook.png` | 船钩 | 🪝 | 竹竿长船钩，竿身腐朽，铁钩生锈 |
| `item_candle.png` | 半截蜡烛 | 🕯️ | 白蜡烛燃烧一半，烛泪堆积如人脸 |
| `item_family_photo.png` | 家族合照 | 🖼️ | 发黄旧照片，人脸涂黑只留祖父，右缘撕裂痕 |
| `item_ritual_note.png` | 祭祀符文 | 📿 | 墙面显现的符文刻字"子丑寅卯/水火木金" |
| `item_dagger.png` | 祭祀匕首 | 🗡️ | 青铜匕首，刀刃刻四元素符号🜂🜄🜁🜃，握柄光滑 |
| `item_seal_token.png` | 青铜令牌 | 🏷️ | 刻封印图案的青铜令牌，背面"持此令者可入封印之间" |
| `item_basement_map.png` | 地下室地图 | 🗺️ | 手绘地下通道地图，标注路线+红色警告符号 |
| `item_amulet.png` | 守门人护符 | 🧿 | 古老护符，四符号排列成圆形，历代守门人佩戴 |
| `item_ritual_text.png` | 石刻铭文 | 📜 | 石壁刻字——上半工整誓约，下半潦草愤怒的揭露 |
| `item_aunt_letter.png` | 姑母的警告信 | ✉️ | 泛黄信纸，潦草急切字迹，左缘撕裂痕，落款姑母 |
| `item_ancestral_ward.png` | 祖祠护符 | 🔖 | 朱砂符纸，枫叶+流水+山形三族徽交织，背面"知先后者门自会开" |
| `item_hidden_truth.png` | 隐藏的真相 | 📝 | 两张纸拼合后浮现的隐藏文字——"封印不是守护是囚禁" |
| `item_torn_genealogy.png` | 撕裂的族谱页 | 📄 | 半页泛黄族谱，撕裂边缘，母亲字迹+黑色指纹 |
| `item_pattern_clue.png` | 符阵图 | 🗺️ | 四象归一符阵手绘稿——九宫格连线图+祖父注解 |

---

### 3.5 UI 图标（7 张 · 128×128 px · 透明背景）

| 文件名 | 用途 | 当前 | 设计建议 |
|--------|------|------|----------|
| `ui_hint.png` | 提示按钮 | 💡 | 灯笼/火苗线稿图标（与场景纸灯笼呼应） |
| `ui_save.png` | 存档按钮 | 💾 | 毛笔/墨迹线稿图标 |
| `ui_notes.png` | 笔记按钮 | 📓 | 打开的书册线稿图标 |
| `ui_menu.png` | 菜单按钮 | ⚙️ | 三横线（≡）或八卦符线稿 |
| `ui_arrow_left.png` | 左导航箭头 | ◂ | 向左三角箭头 |
| `ui_arrow_right.png` | 右导航箭头 | ▸ | 向右三角箭头 |
| `ui_arrow_down.png` | 返回/向下箭头 | ▾ | 向下三角箭头 |

---

### 3.6 数量汇总

| 类别 | 数量 | 尺寸 | 预估单张大小 | 总估算 |
|------|------|------|-------------|--------|
| 场景背景 | 6 | 1920×1080 | ~500KB-1MB | ~4MB |
| 场景元素 | 54 | 200×200 | ~30-60KB | ~2.5MB |
| NPC 残影 | 6 | 180×180 | ~25-50KB | ~250KB |
| 道具图标 | 16 | 256×256 | ~40-80KB | ~1MB |
| UI 图标 | 7 | 128×128 | ~10-20KB | ~100KB |
| **合计** | **~89** | | | **~8MB** |

---

## 四、Implementation Plan

### Phase 1 — PNG 生成后即可无缝替换

当前 data.js 已为 10 个场景 collectible 元素配置好 `img` 字段。渲染引擎 `else { div.textContent = el.emoji }` 的回退逻辑保证：PNG 生成到哪个，哪个就立刻生效。

### Phase 2 — 递进式替换

1. **道具图标** 16 张先出 → 场景 collectible + 背包 + 详情弹窗全面替换
2. **场景背景** 6 张 → 视觉效果最大提升
3. **场景热点/NPC** 60 张 → 逐场景补齐
4. **UI 图标** 7 张 → 需要额外修改 HTML（当前 emoji 硬编码在 `<button>` 标签内）

### Phase 3 — 更新 data.js

每完成一批 PNG，在 data.js 对应 element/ITEM 中添加 `img` 字段指向 PNG 文件路径。

---

## 五、已复用的道具图（data.js 已配置）

以下场景元素已设置 `img` 指向道具 PNG，出图即生效：

| 场景 | 元素 ID | 指向文件 |
|------|---------|----------|
| 村口 | letter_in_boat | `items/item_letter.png` |
| 村口 | hook_on_dock | `items/item_boat_hook.png` |
| 祠堂 | candle_on_altar | `items/item_candle.png` |
| 祠堂 | hidden_inscription | `items/item_ritual_note.png` |
| 祠堂 | hidden_dagger | `items/item_dagger.png` |
| 祠堂 | photo_frame | `items/item_family_photo.png` |
| 书房 | desk_map | `items/item_basement_map.png` |
| 卧室 | pillow_letter | `items/item_aunt_letter.png` |
| 暗道 | wall_carving | `items/item_ritual_text.png` |
| 暗道 | amulet_on_wall | `items/item_amulet.png` |

---

## 六、文件目录结构

```
damentang/images/
  bg/                          ← 场景背景 (6 张, 1920×1080)
    bg_village_entrance.png
    bg_ancestral_hall.png
    bg_study.png
    bg_bedroom.png
    bg_dark_passage.png
    bg_seal_chamber.png
  sc/                          ← 场景元素 (54 张, 200×200)
    sc_village_gate.png
    sc_lantern.png
    ...（全部以 sc_ 前缀命名）
  npc/                         ← NPC 残影 (6 张, 180×180)
    npc_grandfather_dock.png
    npc_aunt_whisper.png
    npc_grandfather_study.png
    npc_mugen.png
    npc_aunt_bedroom.png
    npc_keepers.png
  items/                       ← 道具图标 (16 张, 256×256)
    item_letter.png
    item_rusty_key.png
    ...（全部以 item_ 前缀命名）
  ui/                          ← UI 图标 (7 张, 128×128)
    ui_hint.png
    ui_save.png
    ...
```

---

## 七、Open Questions

1. **美术来源**：画师手绘 vs AI 生成（Midjourney/Stable Diffusion）后修图？不同来源影响风格统一度和交付周期
2. **背景风格**：纯手绘插画 vs 照片处理+滤镜（后者更快但可能风格不统一）
3. **道具细节度**：256×256 是否足够在详情弹窗中清晰展示文字细节（如信件上的字迹）？可能需要 512×512
4. **交付节奏**：是否接受分批交付（先 16 道具 + 6 背景上线，场景元素后续补齐）？
5. **NPC 半透明**：PNG 自带透明度 + CSS 动画叠加是否 OK？还是需要额外效果（发光/烟雾）？
