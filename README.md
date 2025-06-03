# xfyun-tts-sdk

科大讯飞语言合成（TTS）浏览器端 SDK（流式WebAPi二次集成）

## 安装
```bash
npm install xfyun-tts-sdk
```

## 使用示例
```ts
import { XFYunTTSClient } from 'xfyun-tts-sdk';
```

```ts
const tts = new XFYunTTSClient({
    appid: your_appid,
    apiKey: your_apikey,
    apiSecret: your_apiSecret
})
```

### 合成语音

```ts
const audioSource = await tts.synthesize('你好世界')
```