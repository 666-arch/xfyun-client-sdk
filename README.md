# xfyun-tts-sdk
科大讯飞语言合成（TTS）浏览器端 SDK（流式WebAPi二次集成）
## 安装
```bash
npm install xfyun-client-sdk
```
## 使用示例
```ts
import { XFYunTTSClient } from 'xfyun-client-sdk';
```
### 注意
#### appid/apikey/apiSecret 都是科大讯飞内部提供，在调用前，会自动校验是否鉴权成功，否则会直接抛异常

```ts
const tts = new XFYunTTSClient({
    appid: your_appid, 
    apiKey: your_apikey,
    apiSecret: your_apiSecret,
    content: '合成文本'
})
const audioSource = await tts.synthesize('你好世界')
```