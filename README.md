# 英语AI对话教练 (English AI Coach)

一个基于React + Express + OpenAI的英语口语练习应用，支持实时语音对话、场景化练习和语音合成。

## 🚀 功能特点

### 核心功能
- **实时语音对话**：语音输入 → GPT对话 → 语音回应的完整闭环
- **场景化练习**：机场、酒店、餐厅等真实生活场景
- **多口音支持**：美式、英式、印度口音选择
- **实时字幕**：支持英文/中文字幕显示
- **语音识别**：基于OpenAI Whisper的高精度语音转文字
- **语音合成**：使用ElevenLabs的自然语音生成

### 技术栈
- **前端**：React 18 + Tailwind CSS + Framer Motion
- **后端**：Node.js + Express
- **AI服务**：
  - OpenAI GPT-3.5-turbo (对话生成)
  - OpenAI Whisper (语音识别)
  - ElevenLabs (语音合成)
- **状态管理**：Zustand

## 📦 项目结构

```
english-ai-coach/
├── server/
│   └── index.js                 # Express后端服务器
├── src/
│   ├── components/              # React组件
│   │   ├── Header.tsx          # 顶部导航
│   │   ├── SceneSelector.tsx   # 场景选择
│   │   ├── Conversation.tsx    # 对话界面
│   │   ├── ControlPanel.tsx    # 语音控制面板
│   │   ├── ConversationDisplay.tsx # 消息显示
│   │   └── AvatarDisplay.tsx   # 虚拟形象
│   ├── store/
│   │   └── index.ts            # Zustand状态管理
│   ├── types/
│   │   └── index.ts            # TypeScript类型定义
│   ├── utils/
│   │   ├── api.ts              # API调用工具
│   │   └── audio.ts            # 音频录制/播放工具
│   └── data/
│       └── scenes.ts           # 场景数据
├── index.html                  # 测试页面
├── package.json
└── README.md
```

## 🛠️ 安装与配置

### 1. 克隆项目
```bash
git clone <repository-url>
cd english-ai-coach
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
创建 `.env` 文件：
```env
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### 4. 获取API密钥

#### OpenAI API Key
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册/登录账号
3. 创建API密钥
4. 确保账户有足够的配额

#### ElevenLabs API Key
1. 访问 [ElevenLabs](https://elevenlabs.io/)
2. 注册/登录账号
3. 在Dashboard获取API密钥
4. 选择合适的语音方案

## 🚀 启动应用

### 开发模式
```bash
# 同时启动前端和后端
npm run dev
```

### 单独启动
```bash
# 只启动后端服务器
npm run server

# 启动前端（需要在另一个终端）
npx vite
```

### 测试模式
如果遇到Node.js版本兼容问题，可以使用简化的测试版本：
```bash
# 启动后端
npm run server

# 启动简单HTTP服务器（新终端）
python3 -m http.server 8080

# 访问 http://localhost:8080 进行测试
```

## 🎯 使用指南

### 基本使用流程

1. **选择场景**
   - 打开应用后选择练习场景（机场、酒店、餐厅）
   - 每个场景都有特定的角色设定和对话背景

2. **开始对话**
   - 点击麦克风按钮开始录音
   - 说出英语句子后松开按钮
   - AI会自动识别语音并生成回复
   - 回复会以语音形式播放

3. **调整设置**
   - 在顶部设置中选择口音偏好
   - 开启/关闭字幕功能
   - 选择字幕语言（英文/中文）

### API接口

后端提供以下API接口：

- `POST /api/transcribe` - 语音转文字
- `POST /api/chat` - GPT对话生成  
- `POST /api/speak` - 文字转语音
- `POST /api/clear-session` - 清除会话

## 🔧 配置选项

### 语音设置
- **口音选择**：american, british, indian
- **语音模型**：ElevenLabs预设的4个高质量语音
- **音频格式**：WebM (录制) / MP3 (播放)

### 对话设置
- **GPT模型**：gpt-3.5-turbo (可升级到gpt-4)
- **上下文长度**：保留最近10轮对话
- **回复长度**：最多150个token
- **温度参数**：0.7 (平衡创造性和一致性)

## 🐛 故障排除

### 常见问题

1. **麦克风权限**
   - 确保浏览器允许麦克风访问
   - 检查系统音频设备设置

2. **API错误**
   - 验证环境变量配置正确
   - 检查API密钥是否有效
   - 确认网络连接正常

3. **Node.js版本兼容性**
   - 推荐使用Node.js 14+
   - 旧版本可使用测试模式

4. **CORS问题**
   - 确保前后端端口配置正确
   - 检查服务器CORS设置

### 技术支持

- 检查浏览器控制台错误信息
- 查看服务器日志输出
- 确认所有依赖正确安装

## 📈 性能优化

- 音频压缩优化
- API调用缓存
- 会话状态管理
- 错误重试机制

## 🔒 安全注意事项

- API密钥需妥善保管
- 不要将密钥提交到版本控制
- 定期轮换API密钥
- 监控API使用量

## 🚀 部署指南

### Vercel部署
1. 将代码推送到GitHub
2. 连接Vercel账号
3. 配置环境变量
4. 自动部署

### 本地生产环境
```bash
npm run build
npm start
```

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

🔄 **最后更新**: 2025-06-05 - 测试Vercel自动部署功能

**开始你的英语口语练习之旅！** 🎯 