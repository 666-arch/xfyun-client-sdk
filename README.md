# xfyun-client-sdk
科大讯飞语言合成（TTS）浏览器端 SDK（流式WebAPi二次集成）
## 安装
```bash
npm install xfyun-client-sdk
```
## 在 React 中使用示例
```ts
import { XFYunTTSClient } from 'xfyun-client-sdk';
```
### 注意
#### appid/apikey/apiSecret 都是科大讯飞内部提供，在调用前，会自动校验是否鉴权成功，否则会直接抛异常

```tsx
import XFYunTTSClient from "xfyun-client-sdk";
function App() {
  const handleClick =async () => {
    const result = new XFYunTTSClient({
      appid: 'your_id',
      apiKey: 'your_key',
      apiSecret: 'your_secret',
      content: '你好，世界'
    })
    await result.synthesize();
  }
  return (
    <>
      <div className="card">
        <button onClick={handleClick}>
          点击合成
        </button>
      </div>
    </>
  );
}
```