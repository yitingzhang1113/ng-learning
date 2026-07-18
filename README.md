# ng-learning

算法刷题路线图 + OOD 面试准备。

路线图结构参考 [labuladong 的算法路线](https://labuladong.online/zh/roadmap/algo/)。

**在线访问:** https://yitingzhang1113.github.io/ng-learning/

## 本地运行

```bash
npm install
npm run dev
```

笔记默认存浏览器 localStorage。想让笔记存进后端(`server/`,SQLite,换浏览器/设备也不丢)再开一个终端:

```bash
cd server
npm install
cp .env.example .env
npm run dev      # http://localhost:8787
```

后端连不上时不影响使用,自动退回本地存储。线上 GitHub Pages 版本默认没有配后端地址,同样只存本地;要接后端得单独部署 `server/` 并在 `.env` 里配 `VITE_API_URL`。

## 修改内容

- 题单/路线图:`src/data/roadmap.js`
- 教程链接/代码模板:`src/data/guides.js`
- 系统设计/OOD 真题:`src/data/prep.js`

改完 `git push`,网站自动更新。
