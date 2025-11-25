# 快速启动指南

## 📋 项目概述

这是一个完整的晚会互动网站系统，包含：
- **Guest端**（观众端）：主页、抽奖查询、弹幕发送、节目进度
- **Admin端**（管理员端）：节目管理、弹幕管理、抽奖管理

## 🚀 快速开始

### 1. 安装Node.js

如果还没安装Node.js，请先安装：
- 访问 https://nodejs.org/
- 下载并安装 LTS 版本（推荐18.x或以上）

### 2. 安装项目依赖

在项目根目录运行：

```bash
npm install
```

这将安装所有必需的依赖包。

### 3. 配置管理员密码

编辑 `.env.local` 文件，可以保持默认密码或生成新密码：

**默认密码：admin123**

如需修改密码，请：
1. 安装bcryptjs后运行以下命令生成密码哈希：

```bash
npm install
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-new-password', 10).then(hash => console.log('ADMIN_PASSWORD_HASH=' + hash));"
```

2. 将输出的哈希值替换到 `.env.local` 文件中

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动

## 📱 访问指南

### Guest端（观众端）

- **主页**: http://localhost:3000
  - 展示晚会海报
  - 提供三个功能入口

- **抽奖结果**: http://localhost:3000/lottery
  - 查看中奖号码
  - 自动刷新

- **弹幕发送**: http://localhost:3000/danmaku
  - 发送弹幕消息
  - 最多100个字符

- **节目进度**: http://localhost:3000/programs
  - 查看节目单
  - 实时进度更新

### Admin端（管理员端）

- **登录页**: http://localhost:3000/admin
  - 默认密码：admin123
  - 登录后获得管理权限

- **控制台**: http://localhost:3000/admin/dashboard
  - 管理功能导航

- **节目管理**: http://localhost:3000/admin/programs
  - 勾选完成的节目
  - 查看整体进度

- **弹幕管理**: http://localhost:3000/admin/danmaku
  - 实时查看弹幕
  - 一键复制弹幕
  - 清空弹幕列表

- **抽奖管理**: http://localhost:3000/admin/lottery
  - 配置抽奖参数（号码范围、数量）
  - 开始抽奖（滚动动画）
  - 自动发布结果

## 🎯 使用场景

### 晚会前准备

1. 管理员登录系统
2. 在节目管理中确认节目单
3. 在抽奖管理中配置抽奖参数

### 晚会进行中

1. **观众操作**：
   - 扫描二维码访问Guest端
   - 发送弹幕互动
   - 查看节目进度
   - 查看抽奖结果

2. **管理员操作**：
   - 随时更新节目进度
   - 查看并管理弹幕
   - 在抽奖环节进行抽奖
   - 抽奖结果自动同步到Guest端

## 📲 二维码分享

为了方便观众访问，可以：

1. 使用在线二维码生成器：
   - https://www.qr-code-generator.com/
   - 输入你的网站URL
   - 生成二维码并打印或投影

2. 或者集成二维码库（未来扩展）

## 🔧 常见问题

### Q: 如何修改海报内容？
A: 编辑 `app/page.tsx` 文件中的海报区域内容

### Q: 如何修改默认节目单？
A: 编辑 `lib/dataStore.ts` 文件中的 `programs` 初始数据

### Q: 数据会保存吗？
A: 当前使用内存存储，重启后数据会丢失。生产环境建议接入数据库。

### Q: 如何部署到服务器？
A: 
```bash
npm run build
npm start
```
然后使用nginx反向代理或部署到Vercel/Netlify

### Q: 手机访问样式不对？
A: 所有Guest端页面都已适配移动端，确保使用最新版浏览器

## 🎨 自定义

### 修改主题颜色

编辑 `tailwind.config.ts`：

```typescript
theme: {
  extend: {
    colors: {
      primary: '#8B5CF6',  // 修改为你的主色调
      secondary: '#EC4899', // 修改为你的辅助色
    },
  },
}
```

### 修改标题

编辑 `app/layout.tsx`：

```typescript
export const metadata: Metadata = {
  title: '你的晚会名称',
  description: '你的晚会描述',
}
```

## 📞 技术支持

遇到问题？
1. 查看 README.md 了解详细文档
2. 检查浏览器控制台错误信息
3. 确保Node.js版本正确（18+）

祝晚会圆满成功！🎉
