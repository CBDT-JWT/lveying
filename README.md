# 晚会网站系统

一个功能完整的晚会互动网站系统，包含Guest端和Admin端，支持抽奖、弹幕、节目进度管理等功能。

## 功能特性

### Guest端（观众端）
- 🎨 **主页**：展示晚会海报，提供导航入口
- 🎁 **抽奖显示**：实时查看中奖号码
- 💬 **弹幕发送**：发送弹幕互动
- 📋 **节目进度**：查看节目单和当前进度
- 📱 **移动端适配**：完美支持手机访问

### Admin端（管理员端）
- 🔐 **安全登录**：密码认证 + JWT Token鉴权
- 📋 **节目管理**：管理节目单和进度
- 💬 **弹幕管理**：实时查看和管理弹幕
- 🎁 **抽奖管理**：配置抽奖参数并进行抽奖
- 🎲 **抽奖动画**：滚动数字动画效果

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **认证**: JWT + bcryptjs
- **存储**: JSON文件持久化存储

## 安装和运行

### 前提条件

确保已安装 Node.js 18+ 和 npm。

### 安装依赖

```bash
npm install
```

### 配置环境变量

编辑 `.env.local` 文件，设置管理员密码：

```bash
# 使用 bcrypt 生成密码哈希
# 默认密码: admin123
ADMIN_PASSWORD_HASH=$2a$10$YourHashHere
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 生成密码哈希

使用 Node.js 生成密码哈希：

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(console.log);"
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:3000`

### 生产构建

```bash
npm run build
npm start
```

## 使用指南

### Guest端访问

1. 访问主页: `http://localhost:3000`
2. 扫描二维码或直接访问以下页面：
   - 抽奖结果: `/lottery`
   - 发送弹幕: `/danmaku`
   - 节目进度: `/programs`

### Admin端访问

1. 访问管理员登录: `http://localhost:3000/admin`
2. 输入管理员密码（默认：admin123）
3. 进入控制台管理各项功能

## API接口

### 公开API

- `GET /api/programs` - 获取节目单
- `GET /api/lottery/result` - 获取抽奖结果
- `POST /api/danmaku` - 发送弹幕
   - 注意：每条弹幕会记录发送者的IP地址，用于审核与日志，默认不会在公开接口中展示。
      - 存储时会把一些代理返回的 IPv6 映射 IPv4（例如 `::ffff:1.2.3.4`）规范化为 `1.2.3.4`。

### 管理员API（需要Token）

- `POST /api/admin/login` - 管理员登录
- `POST /api/programs` - 更新节目单
- `PATCH /api/programs` - 更新节目状态
- `GET /api/danmaku` - 获取弹幕列表
   - 管理员接口返回的弹幕包含发送者的IP（仅供管理员审核与日志使用）。
   - 管理员可封禁 IP（`POST /api/admin/banned-ips` / `DELETE /api/admin/banned-ips`），被封禁的 IP 无法通过 `POST /api/danmaku` 发送弹幕。
      - 管理员可封禁 IP（`POST /api/admin/banned-ips` / `DELETE /api/admin/banned-ips`），被封禁的 IP 无法通过 `POST /api/danmaku` 发送弹幕。封禁会自动取消该 IP 已审核的历史弹幕（不再公开展示）。
- `DELETE /api/danmaku` - 清空弹幕
- `GET /api/lottery/config` - 获取抽奖配置
- `POST /api/lottery/config` - 更新抽奖配置
- `POST /api/lottery/result` - 发布抽奖结果

## 目录结构

```
lueying/
├── app/                      # Next.js App Router
│   ├── api/                  # API路由
│   │   ├── admin/            # 管理员相关API
│   │   ├── danmaku/          # 弹幕API
│   │   ├── lottery/          # 抽奖API
│   │   └── programs/         # 节目单API
│   ├── admin/                # Admin端页面
│   │   ├── dashboard/        # 控制台
│   │   ├── programs/         # 节目管理
│   │   ├── danmaku/          # 弹幕管理
│   │   └── lottery/          # 抽奖管理
│   ├── danmaku/              # Guest弹幕页面
│   ├── lottery/              # Guest抽奖页面
│   ├── programs/             # Guest节目页面
│   ├── layout.tsx            # 根布局
│   ├── page.tsx              # 主页
│   └── globals.css           # 全局样式
├── lib/                      # 工具库
│   ├── auth.ts               # 认证工具
│   └── dataStore.ts          # 数据存储
├── types/                    # TypeScript类型定义
│   └── index.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 安全建议

1. **修改默认密码**：首次部署前务必修改 `.env.local` 中的管理员密码
2. **JWT密钥**：使用强随机字符串作为JWT_SECRET
3. **HTTPS**：生产环境使用HTTPS
4. **数据库**：生产环境建议使用真实数据库替代内存存储

## 扩展建议

### 持久化存储

当前使用内存存储，重启后数据会丢失。建议集成：
- **SQLite**: 轻量级场景
- **PostgreSQL/MySQL**: 生产环境
- **MongoDB**: NoSQL方案

### 实时更新

集成WebSocket或Server-Sent Events实现：
- 弹幕实时推送
- 节目进度实时同步
- 抽奖结果实时通知

### 二维码生成

为Guest端页面生成二维码：

```bash
npm install qrcode
```

## License

MIT

## 作者

晚会网站系统 © 2025
