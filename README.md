# 🧭 我的算法题单(仿 labuladong 可交互路线图)

用 **React + [React Flow](https://reactflow.dev)** 做的可交互算法学习路线图,沿用 labuladong 的结构:
根「数据结构与算法」→ **数组 / 链表** 两大分支,下挂「数组操作」「基础数据结构」「高级数据结构」等分组盒子。

顶部导航栏有四个页面:**路线图**(这张导图)、**我的笔记**(汇总所有写过笔记的题)、**系统设计**、**OOD**;右上角有 **中 / EN 语言切换按钮**,一键切换全站中英文(选择会记住)。System Design 和 OOD 是开放式题单(没有 LeetCode 链接),同样支持每题写笔记/代码/视频。数据分别在 `src/data/roadmap.js` 和 `src/data/prep.js`。

功能:

- **中英文双语**:每个板块、每道题都有中文 + 英文。
- **美区 LeetCode**:所有题目链接指向 `leetcode.com`(美国站会员可用)。
- **三态打卡**:每题可点 未开始 ○ → 尝试中 ◐ → 已解决 ✓,进度存浏览器本地。
- **打卡面板**:左上角圆环显示 已解决/总数 + Attempting,右侧 Easy / Med. / Hard 分档(仿 LeetCode)。
- **每题笔记卡片**:每道题点右侧 📝 展开,可写①思路笔记 ②代码块(多个,带语言选择 + 一键复制)③视频(参考解法链接 / 自己录的讲解,**直接在笔记里播放**,支持 YouTube / Bilibili / Loom / Vimeo / .mp4 直链)。板块底部另有一个整体笔记(经典 OOD 如停车场/电梯没有链接,写这里)。自动保存到后端(`server/`,SQLite),同时缓存一份在浏览器本地;后端没启动时仍可离线使用本地缓存,顶部会有 ⚠️ 提示未同步。
- **OOD 模块**:在「基础数据结构」里的「设计 · OOD」板块。
- **区间**:归入「其他算法」分组。
- 整张图**完全由一个数据文件驱动**,加题、加板块、加分组都只改数据。

---

## 🚀 本地运行

需要 [Node.js](https://nodejs.org)(推荐 20+,后端用到了 `--env-file`)。分两部分:前端(本目录)+ 后端(`server/`,负责把笔记存进 SQLite)。

**1. 启动后端**(新开一个终端):

```bash
cd server
npm install                          # 只需第一次
cp .env.example .env                 # 只需第一次,本地开发默认不需要改
npm run dev                          # http://localhost:8787,数据存在 server/data.sqlite
```

**2. 启动前端**:

```bash
npm install      # 只需第一次
npm run dev      # 启动开发服务器(通常 http://localhost:5173)
npm run build    # 打包,产物在 dist/
```

前端默认连 `http://localhost:8787`。如果后端地址不一样,复制根目录的 `.env.example` 为 `.env` 并改 `VITE_API_URL`。

后端没启动或连不上时,页面顶部会显示「⚠️ 未连接后端(仅本地)」,笔记仍会存在浏览器 localStorage 里,后端恢复后刷新页面会重新拉取。

---

## ✏️ 加题目

打开 **`src/data/roadmap.js`**,找到对应板块的 `problems`,加一行(用 `p()` 帮助函数):

```js
// p(英文名, 中文名, 难度, leetcode 的 slug) —— 难度用 'Easy' / 'Medium' / 'Hard'
p('Trapping Rain Water', '接雨水', 'Hard', 'trapping-rain-water'),
```

slug 就是 LeetCode 链接 `leetcode.com/problems/<slug>/` 里的那段。保存后页面自动刷新。

## ➕ 加一个板块(卡片)

在 `src/data/roadmap.js` 的 `NODES` 里加一个 `topic` 节点,`group` 指向它所属的分组盒:

```js
{
  id: 'string-algo', kind: 'topic', group: 'others',   // 放进「其他算法」盒子
  zh: '字符串算法', en: 'String',
  problems: [
    p('Longest Palindromic Substring', '最长回文子串', 'Medium', 'longest-palindromic-substring'),
  ],
},
```

## 📦 加一个分组盒子

1. 在 `NODES` 里加一个 `group` 节点:
   ```js
   { id: 'stringgroup', kind: 'group', zh: '字符串专题', en: 'String', cols: 1 },
   ```
2. 把若干 `topic` 的 `group` 指向 `'stringgroup'`。
3. 在 `EDGES` 里连线,让它挂到某个节点下,例如:
   ```js
   ['array', 'stringgroup'],           // 实线
   ['array', 'stringgroup', 'dashed'], // 虚线
   ```
   布局(dagre)会自动重新排布,不用手摆坐标。
   > 想让某个盒子像「其他算法」那样独立浮在左下角、不连线,把它的 id 加进 `FLOATING` 数组即可。

## 🧩 里程碑节点 / 难度颜色

- 独立的大节点(数组、链表、二叉树…)是 `kind: 'milestone'`,写法和 topic 一样,只是不放进分组盒。
- 状态点颜色:绿=全做完,黄=进行中,灰=未开始(见文件顶部 `STATUS_DOT`)。
- 难度颜色见顶部 `DIFF`。

---

## 🌐 部署到 GitHub Pages

1. GitHub 新建仓库,比如 `algo-roadmap`。
2. 打开 `vite.config.js`,把 `base` 改成 `'/仓库名/'`(如 `base: '/algo-roadmap/'`);
   若仓库是 `用户名.github.io` 根仓库,保持 `'/'`。
3. 推代码:
   ```bash
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<用户名>/algo-roadmap.git
   git push -u origin main
   ```
4. 一键发布(已内置 `gh-pages`):
   ```bash
   npm run deploy
   ```
5. 仓库 Settings → Pages,Source 选 `gh-pages` 分支,访问
   `https://<用户名>.github.io/algo-roadmap/`。

GitHub Pages 只能托管静态文件,后端(`server/`)需要单独找个能长期跑 Node 进程的地方部署(比如 Render / Railway / Fly.io,或自己的服务器/NAS)。部署后端时:

- 设一个 `API_TOKEN`(随机字符串),别留空 —— 公网上没有 token 校验等于任何人都能读写你的笔记。
- `ALLOWED_ORIGIN` 填你的 GitHub Pages 地址,如 `https://<用户名>.github.io`。
- 回到前端项目根目录的 `.env`,把 `VITE_API_URL` 改成后端的公网地址,`VITE_API_TOKEN` 填和后端一致的 token,再 `npm run deploy`。

---

## 📁 结构

```
src/
  data/roadmap.js        ← 你平时唯一要改的文件(NODES 板块 + EDGES 连线)
  layout.js              ← 分组盒排版 + dagre 自动布局
  App.jsx                ← 主界面 + 打卡统计
  components/
    MilestoneNode.jsx    ← 里程碑节点
    TopicCard.jsx        ← 分组盒里的板块卡片
    GroupNode.jsx        ← 分组盒子外框
    SidePanel.jsx        ← 右侧题目面板(双语 + 三态 + 笔记)
    ProgressPanel.jsx    ← 左上打卡面板(圆环 + 难度分档)
  hooks/useStore.js      ← 进度/笔记存取(后端优先,localStorage 兜底缓存)
server/
  index.js               ← Express API(GET/PUT /api/state),单用户 key-value
  data.sqlite             ← SQLite 数据文件(不进 git)
```

技术栈:前端 Vite + React 18 + @xyflow/react(React Flow v12)+ @dagrejs/dagre;后端 Express + better-sqlite3。
