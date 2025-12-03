# 掠影 - 电子系第27届学生节晚会互动系统

掠影是一个专为清华大学电子系第27届学生节打造的全功能晚会互动网站系统。该系统包含观众端和管理端两个部分，为现场观众和后台工作人员提供了完整的互动体验。观众可以通过网站实时查看节目进度、参与弹幕互动、查看抽奖结果，而管理员则可以通过后台系统管理节目单、审核弹幕、配置和执行抽奖等操作。整个系统基于 Next.js 14 构建，采用现代化的技术栈，提供了流畅的用户体验和强大的管理功能。效果可以参考[Demo](https://www.lveying.live)。

![alt text](assets/image.jpeg)

## 核心功能

本系统分为观众端和管理端两大模块，为不同角色提供针对性的功能支持。

观众端为现场参与晚会的观众提供了丰富的互动功能。主页以精美的海报形式展示晚会信息，并提供清晰的导航入口。抽奖功能让观众能够实时查看中奖号码，每次抽奖都配有完整的历史记录和精美的背景图片。弹幕系统允许观众发送互动消息，每条弹幕经过审核后会在大屏幕上展示，营造热烈的现场氛围。节目进度页面实时显示当前正在进行的节目，观众可以查看完整的节目单和详细的演职人员信息。整个观众端完美适配移动设备，观众可以通过手机随时参与互动。

管理端为晚会工作人员提供了完善的后台管理功能。系统采用密码认证和 JWT Token 双重鉴权机制，确保管理功能的安全性。节目管理模块支持实时更新节目单、标记当前进行的节目、管理演职人员信息。弹幕管理功能让管理员能够实时查看所有弹幕，审核通过或拒绝特定弹幕，并可以封禁发送不当内容的 IP 地址。抽奖管理模块功能强大，管理员可以配置不同等级的奖项、设置中奖人数范围、上传背景图片，并使用专业的全屏抽奖页面进行抽奖，抽奖动画采用滚动数字效果，增强现场互动氛围。抽奖系统还具备离线队列功能，即使网络中断也能确保中奖结果不会丢失。

![](assets/mac.jpeg)
## 技术架构

本系统采用现代化的前端技术栈构建。框架选用 Next.js 14，使用最新的 App Router 架构，充分利用服务端渲染和客户端渲染的优势。整个项目使用 TypeScript 编写，提供完整的类型安全保障。样式系统基于 Tailwind CSS，实现了响应式设计和美观的用户界面。用户认证采用 JWT 令牌机制，密码通过 bcryptjs 进行加密存储。数据持久化使用 JSON 文件存储方案，简单可靠，适合中小型晚会场景。系统还集成了 Markdown 渲染和 KaTeX 数学公式支持，可以展示格式丰富的内容。

## 快速开始

在开始使用之前，请确保您的开发环境已安装 Node.js 18 或更高版本以及 npm 包管理器。首先克隆项目仓库到本地，然后在项目根目录下运行 `npm install` 安装所有依赖包。安装完成后，需要配置管理员密码。您可以使用 Node.js 命令生成密码哈希值：`node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(console.log);"`。将生成的哈希值和一个随机的 JWT 密钥添加到 `.env.local` 文件中。配置完成后，运行 `npm run dev` 启动开发服务器，访问 `http://localhost:8880` 即可看到系统主页。

对于生产环境部署，首先运行 `npm run build` 构建项目，然后使用 `npm start` 启动生产服务器。

## 使用指南

观众通过访问系统主页可以看到晚会海报和导航菜单。点击"节目进度"可以查看当前正在进行的节目和完整节目单，每个节目可以展开查看详细的演职人员信息。点击"抽奖"可以查看所有抽奖历史和中奖号码，每个奖项都有独立的展示页面。点击"弹幕"可以发送弹幕消息，输入限制为20个字符，每条弹幕都会记录发送者的 IP 地址用于审核，通过审核的弹幕会在大屏幕上实时展示。

管理员需要先访问 `/admin` 登录页面，输入管理员密码后进入控制台。控制台提供了前往各个管理模块的快捷入口。在节目管理页面，管理员可以添加新节目、编辑现有节目信息、标记当前正在进行的节目。在弹幕管理页面，可以查看所有待审核的弹幕，批量通过或拒绝弹幕，封禁发送不当内容的 IP。在抽奖管理页面，可以配置抽奖参数，如奖项名称、中奖人数范围、背景图片等，配置完成后可以打开全屏抽奖页面进行抽奖。抽奖页面支持键盘快捷键，按空格键开始抽奖，按数字键可以快速设置常用抽奖配置（0为特等奖1个，1为一等奖3个，2为二等奖10个，3为三等奖15个），按回车键确认中奖结果。系统会自动保存所有中奖记录，即使遇到网络问题也不会丢失数据。

## API 接口说明

系统提供了丰富的 RESTful API 接口，分为公开接口和管理员接口两类。

### 公开接口

以下接口无需认证，观众端可以直接调用。

#### 获取节目单

- **方法**: `GET`
- **路径**: `/api/programs`
- **参数**: 无
- **返回**: `{ programs: Program[] }`
- **示例**:
  ```bash
  curl http://localhost:8880/api/programs
  ```

#### 获取抽奖结果

- **方法**: `GET`
- **路径**: `/api/lottery/result`
- **参数**: 无
- **返回**: `{ results: LotteryResult[] }`
- **示例**:
  ```bash
  curl http://localhost:8880/api/lottery/result
  ```

#### 获取已审核的弹幕

- **方法**: `GET`
- **路径**: `/api/danmaku/censored` 或 `/api/danmaku/public`
- **参数**: 无
- **返回**: `{ danmakus: Danmaku[] }` (不含 IP 地址，仅返回最新20条)
- **说明**: 两个路径功能相同，都是获取已通过审核的弹幕
- **示例**:
  ```bash
  curl http://localhost:8880/api/danmaku/censored
  # 或
  curl http://localhost:8880/api/danmaku/public
  ```

#### 发送弹幕

- **方法**: `POST`
- **路径**: `/api/danmaku`
- **参数**: `{ content: string }` (最大20个字符)
- **返回**: `{ success: boolean, message: string }`
- **说明**: 自动记录发送者 IP，需审核后才公开展示
- **示例**:
  ```bash
  curl -X POST http://localhost:8880/api/danmaku \
    -H "Content-Type: application/json" \
    -d '{"content":"精彩的节目！"}'
  ```

**注意**：弹幕接口会记录发送者的 IP 地址用于审核和日志记录。系统会自动将 IPv6 映射的 IPv4 地址（如 `::ffff:1.2.3.4`）规范化为标准格式（`1.2.3.4`）。

### 管理员接口

以下接口需要在请求头中携带 JWT Token 进行认证（`Authorization: Bearer <token>`）。

#### 管理员登录

- **方法**: `POST`
- **路径**: `/api/admin/login`
- **参数**: `{ password: string }`
- **返回**: `{ token: string }`
- **示例**:
  ```bash
  curl -X POST http://localhost:8880/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"password":"your-password"}'
  ```

#### 修改管理员密码

- **方法**: `POST`
- **路径**: `/api/admin/change-password`
- **参数**: `{ currentPassword: string, newPassword: string }`
- **返回**: `{ success: boolean, message: string }`
- **说明**: 修改管理员密码，需要提供当前密码验证，新密码长度不少于6位
- **示例**:
  ```bash
  curl -X POST http://localhost:8880/api/admin/change-password \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"currentPassword":"old-password","newPassword":"new-password"}'
  ```

#### 添加节目

- **方法**: `POST`
- **路径**: `/api/programs/add`
- **参数**: `{ title: string, performers?: [string, string[]][], band_name?: string, ... }`
- **返回**: `{ success: boolean, program: Program }`
- **示例**:
  ```bash
  curl -X POST http://localhost:8880/api/programs/add \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"title":"开场舞","band_name":"舞蹈团"}'
  ```

#### 更新节目状态

- **方法**: `POST`
- **路径**: `/api/programs`
- **参数**: `{ programs: Program[] }`
- **返回**: `{ success: boolean }`
- **说明**: 用于批量更新所有节目（替换整个节目列表）
- **示例**:
  ```bash
  curl -X POST http://localhost:8880/api/programs \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"programs":[...]}'
  ```

#### 更新单个节目状态

- **方法**: `PATCH`
- **路径**: `/api/programs`
- **参数**: `{ id: string, completed: boolean }`
- **返回**: `{ success: boolean }`
- **说明**: 标记单个节目为已完成或未完成
- **示例**:
  ```bash
  curl -X PATCH http://localhost:8880/api/programs \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"id":"program-1","completed":true}'
  ```

#### 更新节目详情

- **方法**: `PUT`
- **路径**: `/api/programs`
- **参数**: `{ id: string, title?: string, performers?: [string, string[]][], band_name?: string, order?: number, parentId?: string, subOrder?: number }`
- **返回**: `{ success: boolean }`
- **说明**: 更新单个节目的详细信息
- **示例**:
  ```bash
  curl -X PUT http://localhost:8880/api/programs \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"id":"program-1","title":"新标题","order":1}'
  ```

#### 删除节目

- **方法**: `DELETE`
- **路径**: `/api/programs?id=<program-id>`
- **参数**: 查询参数 `id` (节目 ID)
- **返回**: `{ success: boolean }`
- **示例**:
  ```bash
  curl -X DELETE "http://localhost:8880/api/programs?id=program-1" \
    -H "Authorization: Bearer <token>"
  ```

#### 获取所有弹幕

- **方法**: `GET`
- **路径**: `/api/danmaku`
- **参数**: 无
- **返回**: `{ danmakus: Danmaku[] }` (含 IP 地址)
- **说明**: 包含所有弹幕，含待审核和已审核的，用于管理员审核
- **示例**:
  ```bash
  curl http://localhost:8880/api/danmaku \
    -H "Authorization: Bearer <token>"
  ```

#### 审核弹幕

- **方法**: `POST`
- **路径**: `/api/danmaku/censored`
- **参数**: `{ danmakuIds: string[], censor: boolean }`
- **返回**: `{ success: boolean }`
- **说明**: 批量通过或拒绝弹幕，`censor: true` 为通过，`false` 为拒绝
- **示例**:
  ```bash
  curl -X POST http://localhost:8880/api/danmaku/censored \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"danmakuIds":["id1","id2"],"censor":true}'
  ```

#### 清空弹幕

- **方法**: `DELETE`
- **路径**: `/api/danmaku`
- **参数**: 无
- **返回**: `{ success: boolean }`
- **示例**:
  ```bash
  curl -X DELETE http://localhost:8880/api/danmaku \
    -H "Authorization: Bearer <token>"
  ```

#### 获取封禁 IP 列表

- **方法**: `GET`
- **路径**: `/api/admin/banned-ips`
- **参数**: 无
- **返回**: `{ ips: string[] }`
- **示例**:
  ```bash
  curl http://localhost:8880/api/admin/banned-ips \
    -H "Authorization: Bearer <token>"
  ```

#### 封禁 IP

- **方法**: `POST`
- **路径**: `/api/admin/banned-ips`
- **参数**: `{ ip: string }`
- **返回**: `{ success: boolean, ip: string, affected: number }`
- **说明**: 被封禁的 IP 无法发送弹幕，其已审核的历史弹幕也会被取消。返回受影响的弹幕数量
- **示例**:
  ```bash
  curl -X POST http://localhost:8880/api/admin/banned-ips \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"ip":"192.168.1.100"}'
  ```

#### 解封 IP

- **方法**: `DELETE`
- **路径**: `/api/admin/banned-ips`
- **参数**: `{ ip: string }` (如果不提供 ip，则清空所有封禁)
- **返回**: `{ success: boolean, ip?: string }`
- **示例**:
  ```bash
  # 解封特定 IP
  curl -X DELETE http://localhost:8880/api/admin/banned-ips \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"ip":"192.168.1.100"}'
  
  # 清空所有封禁
  curl -X DELETE http://localhost:8880/api/admin/banned-ips \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{}'
  ```

#### 获取抽奖配置

- **方法**: `GET`
- **路径**: `/api/lottery/config`
- **参数**: 无
- **返回**: `{ config: LotteryConfig }`
- **示例**:
  ```bash
  curl http://localhost:8880/api/lottery/config \
    -H "Authorization: Bearer <token>"
  ```

#### 更新抽奖配置

- **方法**: `POST`
- **路径**: `/api/lottery/config`
- **参数**: `{ title: string, minNumber: number, maxNumber: number, count: number, backgroundImage?: string }`
- **返回**: `{ success: boolean }`
- **示例**:
  ```bash
  curl -X POST http://localhost:8880/api/lottery/config \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"title":"一等奖","minNumber":1,"maxNumber":100,"count":3}'
  ```

#### 保存抽奖结果

- **方法**: `POST`
- **路径**: `/api/lottery/result`
- **参数**: `{ title: string, numbers: number[] }`
- **返回**: `{ success: boolean }`
- **示例**:
  ```bash
  curl -X POST http://localhost:8880/api/lottery/result \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"title":"一等奖","numbers":[15,42,88]}'
  ```

#### 获取抽奖历史

- **方法**: `GET`
- **路径**: `/api/lottery/history`
- **参数**: 无
- **返回**: `{ history: LotteryResult[] }`
- **说明**: 公开接口，无需认证
- **示例**:
  ```bash
  curl http://localhost:8880/api/lottery/history
  ```

#### 清空抽奖历史

- **方法**: `DELETE`
- **路径**: `/api/lottery/history`
- **参数**: 无
- **返回**: `{ success: boolean }`
- **说明**: 删除所有抽奖历史记录
- **示例**:
  ```bash
  curl -X DELETE http://localhost:8880/api/lottery/history \
    -H "Authorization: Bearer <token>"
  ```

**认证说明**：所有管理员接口都需要有效的 JWT Token。Token 通过登录接口获取，有效期为 7 天。未授权的请求会返回 401 错误。

## 项目结构

项目采用 Next.js 14 的 App Router 架构组织代码，以下是详细的目录和文件说明：

```
lueying/
├── app/                              # Next.js App Router 根目录
│   ├── globals.css                   # 全局样式文件，包含 Tailwind CSS 指令和自定义样式
│   ├── layout.tsx                    # 根布局组件，定义页面的基础 HTML 结构和元数据
│   ├── page.tsx                      # 首页（主页），展示晚会海报和介绍信息
│   │
│   ├── api/                          # API 路由目录
│   │   ├── admin/                    # 管理员相关 API
│   │   │   ├── login/route.ts        # 管理员登录接口
│   │   │   ├── change-password/route.ts  # 修改管理员密码接口
│   │   │   └── banned-ips/route.ts   # IP 封禁管理接口（GET/POST/DELETE）
│   │   │
│   │   ├── danmaku/                  # 弹幕相关 API
│   │   │   ├── route.ts              # 弹幕管理接口（GET 所有/POST 发送/DELETE 清空）
│   │   │   ├── censored/route.ts     # 弹幕审核接口（GET 已审核/POST 审核操作）
│   │   │   └── public/route.ts       # 公开弹幕接口（GET 已审核弹幕，与 censored 相同）
│   │   │
│   │   ├── lottery/                  # 抽奖相关 API
│   │   │   ├── config/route.ts       # 抽奖配置接口（GET/POST）
│   │   │   ├── result/route.ts       # 保存抽奖结果接口（POST）
│   │   │   └── history/route.ts      # 抽奖历史接口（GET 公开/DELETE 清空）
│   │   │
│   │   └── programs/                 # 节目相关 API
│   │       ├── route.ts              # 节目管理接口（GET/POST/PATCH/PUT/DELETE）
│   │       └── add/route.ts          # 添加节目接口（POST）
│   │
│   ├── admin/                        # 管理员后台页面
│   │   ├── page.tsx                  # 管理员登录页面
│   │   ├── change-password/page.tsx  # 修改密码页面
│   │   ├── dashboard/page.tsx        # 管理员控制台（主菜单）
│   │   ├── programs/page.tsx         # 节目管理页面
│   │   ├── danmaku/page.tsx          # 弹幕审核和管理页面
│   │   └── lottery/                  # 抽奖管理模块
│   │       ├── page.tsx              # 抽奖管理主页（重定向到配置页）
│   │       ├── config/page.tsx       # 抽奖配置页面
│   │       └── display/page.tsx      # 全屏抽奖展示页面（含动画效果）
│   │
│   ├── credits/                      # 演职人员名单页面
│   │   └── page.tsx                  # 从 credits.md 渲染演职人员名单
│   │
│   ├── danmaku/                      # 观众端弹幕页面
│   │   └── page.tsx                  # 弹幕发送和展示页面
│   │
│   ├── display/                      # 大屏幕展示页面
│   │   └── page.tsx                  # 弹幕大屏展示（带动画效果）
│   │
│   ├── lottery/                      # 观众端抽奖页面
│   │   └── page.tsx                  # 抽奖结果展示页面
│   │
│   └── programs/                     # 观众端节目页面
│       └── page.tsx                  # 节目单和进度展示页面
│
├── components/                       # 可复用的 React 组件
│   ├── BuildTime.tsx                 # 构建时间显示组件（已弃用）
│   ├── GuestNavBar.tsx               # 观众端导航栏组件
│   ├── MarkdownRenderer.tsx          # Markdown 渲染组件（支持 KaTeX 数学公式）
│   ├── ProgramPerformersDisplay.tsx  # 节目演职人员展示组件
│   ├── TitleManager.tsx              # 页面标题管理组件
│   ├── PerformersEditor.tsx          # 演职人员编辑器（v1，旧版）
│   ├── PerformersEditor-v2.tsx       # 演职人员编辑器（v2）
│   └── PerformersEditor-v3.tsx       # 演职人员编辑器（v3，当前版本）
│
├── lib/                              # 工具函数库
│   ├── auth.ts                       # JWT 认证工具（生成/验证 Token）
│   ├── buildTime.ts                  # 构建时间工具（已弃用）
│   ├── dataStore.ts                  # 数据存储管理（JSON 文件读写）
│   └── userManager.ts                # 用户管理（密码验证和修改）
│
├── types/                            # TypeScript 类型定义
│   └── index.ts                      # 全局类型定义（Program, Danmaku, LotteryConfig 等）
│
├── data/                             # 数据存储目录（JSON 文件）
│   └── store.json                    # 主数据文件（节目、弹幕、抽奖等数据）
│
├── public/                           # 静态资源目录
│   ├── favicon-16.png                # 16x16 网站图标
│   ├── favicon-32.png                # 32x32 网站图标
│   ├── favicon-48.png                # 48x48 网站图标
│   ├── favicon.jpg                   # 原始网站图标
│   ├── apple-touch-icon.png          # iOS 主屏幕图标
│   │
│   ├── poster.png                    # 晚会主海报
│   ├── guestbg.png                   # 观众端背景图
│   ├── danmakubg.png                 # 弹幕展示页背景图
│   ├── lotterybg.jpg                 # 抽奖页面背景图
│   ├── credits.jpg                   # 演职人员页背景图
│   │
│   ├── max1.jpg                      # 抽奖背景图 1（特等奖）
│   ├── max2.jpg                      # 抽奖背景图 2（一等奖）
│   ├── max3.jpg                      # 抽奖背景图 3（二等奖）
│   ├── max4.jpg                      # 抽奖背景图 4（三等奖）
│   │
│   ├── home.png                      # 导航图标 - 首页
│   ├── programs.png                  # 导航图标 - 节目
│   ├── lottery.png                   # 导航图标 - 抽奖
│   ├── chat.png                      # 导航图标 - 弹幕
│   ├── badge.png                     # 导航图标 - 演职人员
│   │
│   ├── play.png                      # 控制图标 - 播放
│   ├── refresh.png                   # 控制图标 - 刷新
│   ├── return.png                    # 控制图标 - 返回
│   ├── rewind.png                    # 控制图标 - 后退
│   ├── send.png                      # 控制图标 - 发送
│   ├── shutter.png                   # 控制图标 - 快门
│   │
│   ├── server.png                    # 服务器图标（彩蛋）
│   ├── gongpai-2.png                 # 工牌图片
│   ├── shutter.mp3                   # 快门音效
│   │
│   ├── credits.md                    # 演职人员名单 Markdown 文件
│   ├── bfb255e05904cc53e855cf4aacc37ef4.txt  # 域名验证文件
│   └── df3715c85e00567bd33c37b1c22cfaab.txt  # 域名验证文件
│
├── scripts/                          # 构建和部署脚本
│   └── set-build-time.js             # 设置构建时间脚本（已弃用）
│
├── package.json                      # npm 项目配置文件
├── tsconfig.json                     # TypeScript 配置文件
├── next.config.js                    # Next.js 配置文件
├── tailwind.config.ts                # Tailwind CSS 配置文件
├── postcss.config.js                 # PostCSS 配置文件
├── .eslintrc.json                    # ESLint 代码检查配置
├── .gitignore                        # Git 忽略文件配置
├── .env.local                        # 环境变量文件（本地，不提交）
└── README.md                         # 项目说明文档
```

### 关键文件说明

**数据存储** (`lib/dataStore.ts`): 核心数据管理模块，负责读写 `data/store.json`，提供节目、弹幕、抽奖、IP 封禁等数据的增删改查接口。

**认证系统** (`lib/auth.ts`, `lib/userManager.ts`): JWT Token 生成和验证，管理员密码的加密存储和验证。

**类型定义** (`types/index.ts`): 定义了整个项目使用的 TypeScript 接口，包括 `Program`（节目）、`Danmaku`（弹幕）、`LotteryConfig`（抽奖配置）等。

**抽奖动画** (`app/admin/lottery/display/page.tsx`): 实现了完整的抽奖动画效果，支持键盘快捷键、离线队列、滚动数字动画等高级功能。

**弹幕系统**: 包含发送、审核、展示三个部分，支持 IP 封禁和自动规范化 IPv6 地址。


