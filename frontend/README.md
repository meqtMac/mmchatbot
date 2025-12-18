# DeepSeek Chat Frontend

一个使用 Vite + React + TypeScript + Tailwind CSS + shadcn/ui 构建的 DeepSeek 对话界面。

## 功能特性

- 🎨 现代化的 UI 设计（基于 shadcn/ui）
- 💬 实时流式对话体验
- 🔐 API Key 本地存储
- 📱 响应式设计
- ⚡ 基于 Vite 的快速开发体验

## 技术栈

- **构建工具**: Vite 5.x
- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS 3.x
- **UI 组件**: shadcn/ui (Radix UI)
- **图标**: Lucide React

## 安装依赖

```bash
cd frontend
npm install
```

## 开发运行

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

## 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 使用说明

1. 首次打开应用时，会弹出对话框要求输入 DeepSeek API Key
2. API Key 会保存在浏览器本地存储中
3. 输入消息后按 Enter 发送（Shift+Enter 换行）
4. AI 回复会以流式方式实时显示
5. 点击"清空对话"可以清除当前对话历史

## 获取 DeepSeek API Key

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册并登录账号
3. 完成实名认证并充值
4. 在"API keys"页面创建新的 API Key
5. 复制 API Key（格式：`sk-xxxxx`）

## 项目结构

```
frontend/
├── src/
│   ├── components/        # React 组件
│   │   ├── ui/           # shadcn UI 组件
│   │   ├── ApiKeyDialog.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   ├── hooks/            # 自定义 Hooks
│   │   └── useChat.ts
│   ├── lib/              # 工具函数
│   │   └── utils.ts
│   ├── types/            # TypeScript 类型定义
│   │   └── chat.ts
│   ├── utils/            # API 工具
│   │   └── deepseek.ts
│   ├── App.tsx           # 主应用组件
│   └── main.tsx          # 入口文件
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 注意事项

- API Key 存储在浏览器本地存储中，不会上传到服务器
- 请妥善保管您的 API Key，避免泄露
- 建议设置 API Key 的使用额度限制

