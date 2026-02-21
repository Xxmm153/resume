const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const axios = require('axios');
require('dotenv').config();

const app = new Koa();
const router = new Router();

// Configure CORS to allow frontend origin
app.use(cors({
  origin: '*' // In production, replace with specific frontend URL
}));
app.use(bodyParser());

// Doubao (Volcengine) API Configuration
// Replace with your actual Doubao API Key and Endpoint ID (Model ID)
const API_KEY = process.env.DOUBAO_API_KEY || 'your_api_key_here';
// The model ID usually looks like 'ep-20250219195707-q588r'
const MODEL_ID = process.env.DOUBAO_MODEL_ID || 'ep-20250219195707-q588r';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

const { PassThrough } = require('stream');

// Provider Configuration
const PROVIDERS = {
  doubao: {
    apiUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    apiKey: process.env.DOUBAO_API_KEY,
    modelId: process.env.DOUBAO_MODEL_ID || 'ep-20250219195707-q588r'
  },
  openai: {
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.OPENAI_API_KEY,
    modelId: process.env.OPENAI_MODEL_ID || 'gpt-3.5-turbo'
  },
  deepseek: {
    apiUrl: 'https://api.deepseek.com/chat/completions',
    apiKey: process.env.DEEPSEEK_API_KEY,
    modelId: process.env.DEEPSEEK_MODEL_ID || 'deepseek-chat'
  },
  moonshot: {
    apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
    apiKey: process.env.MOONSHOT_API_KEY,
    modelId: process.env.MOONSHOT_MODEL_ID || 'moonshot-v1-8k'
  }
};

router.post('/api/polish', async (ctx) => {
  const { text, prompt, provider = 'doubao' } = ctx.request.body;

  if (!text) {
    ctx.status = 400;
    ctx.body = { error: 'Text content is required' };
    return;
  }

  const systemPrompt = prompt || '你是一个专业的简历润色助手。请优化以下简历内容，使其更加专业、简洁、有力。直接返回优化后的内容，不要包含任何解释或额外的文字。';

  const config = PROVIDERS[provider];
  if (!config) {
    ctx.status = 400;
    ctx.body = { error: `Unknown provider: ${provider}` };
    return;
  }

  if (!config || !config.apiKey) {
    // Fallback mock response for unconfigured providers
    const mockResponse = `[${provider} Mock] 正在优化您的简历... 请在后端配置 ${provider} 的 API Key。当前使用的是模拟响应。`;
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    ctx.body = { success: true, polishedText: mockResponse };
    return;
  }

  try {
    const response = await axios.post(
      config.apiUrl,
      {
        model: config.modelId,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        stream: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        timeout: 60000
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const polishedText = response.data.choices[0].message.content;
      ctx.body = { success: true, polishedText };
    } else {
      console.error('Invalid response structure:', response.data);
      ctx.status = 502;
      ctx.body = { error: 'Invalid response from AI provider' };
    }

  } catch (error) {
    console.error('AI API Error:', error.response ? error.response.data : error.message);
    ctx.status = 500;
    ctx.body = {
      error: 'Failed to process AI request',
      details: error.response?.data?.error?.message || error.message
    };
  }
});

// Health check endpoint
router.get('/api/health', (ctx) => {
  ctx.body = { status: 'ok', service: 'resume-ai-polisher' };
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
