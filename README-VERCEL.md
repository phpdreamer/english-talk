# 英语AI对话教练 - Vercel部署版

## 🚀 快速部署到Vercel

### 方法一：一键部署
1. 点击下面的按钮直接部署到Vercel：
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/english-ai-coach)

### 方法二：手动部署
1. **Fork此项目**到你的GitHub账户
2. **登录Vercel**并连接GitHub账户
3. **导入项目**：在Vercel控制台选择"Import Project"
4. **配置环境变量**（可选）：
   - `OPENAI_API_KEY`: 你的OpenAI API密钥
   - `ELEVENLABS_API_KEY`: 你的ElevenLabs API密钥
5. **部署**：点击Deploy按钮

## 🔧 项目配置

### 环境变量设置
在Vercel控制台的项目设置中添加以下环境变量：

```
OPENAI_API_KEY=sk-your-openai-key-here
ELEVENLABS_API_KEY=sk_your-elevenlabs-key-here
```

**注意**：如果不设置API密钥，应用会自动运行在演示模式下。

### 演示模式特性
- ✅ 完整的UI界面
- ✅ 模拟语音识别（返回预设文本）
- ✅ 模拟AI回复（15+种情景回复）
- ✅ 模拟语音合成
- ✅ 完整的对话流程

## 📁 项目结构

```
.
├── api/                  # Vercel API函数
│   ├── transcribe.js    # 语音转文字
│   ├── chat.js          # GPT对话
│   ├── speak.js         # 文字转语音
│   ├── health.js        # 健康检查
│   └── clear-session.js # 清除会话
├── src/                 # React前端源码
├── index.html          # 主页面
├── vercel.json         # Vercel配置
└── package.json        # 依赖配置
```

## 🎯 功能特性

### 支持的场景
1. **机场场景** - 机场工作人员对话
2. **酒店场景** - 酒店前台服务
3. **餐厅场景** - 餐厅点餐服务

### 核心功能
- 🎤 **语音输入**：实时录音转文字
- 🤖 **AI对话**：智能英语对话练习
- 🔊 **语音播放**：文字转语音朗读
- 📝 **文字输入**：支持键盘输入
- 🎭 **角色扮演**：不同场景的AI角色

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## ⚡ 技术栈

- **前端**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Framer Motion
- **状态管理**: Zustand
- **API**: Vercel Serverless Functions
- **AI服务**: OpenAI GPT + Whisper
- **语音合成**: ElevenLabs TTS

## 📞 支持

如有问题，请查看：
1. Vercel部署日志
2. 浏览器控制台错误
3. API健康检查：`/api/health`

## �� 许可证

MIT License 