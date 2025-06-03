import CryptoJS from 'crypto-js';
/**
 * @param appid appid
 * @param apiKey 鉴权key
 * @param apiSecret 鉴权密钥
 * @param ttsWS websocket
 * @param content 合成文本
 */
class TTS {
    private appid: string;
    private apiKey: string;
    private apiSecret: string;
    // private content?: string;

    private ttsWS: WebSocket | null = null;
    private audioChunks: ArrayBuffer[] = []; //音频片段包
    private audioContext: AudioContext | null = null; //音频上下文
    private audioSource: AudioBufferSourceNode | null = null; //音频源
    private isPlaying = false;

    constructor(config: Config) {
        this.appid = config.appid;
        this.apiKey = config.apiKey;
        this.apiSecret = config.apiSecret;
        // this.content = content;
    }
    /**
     * 讯飞接口鉴权
     * @returns 
     */
    private generateSignature() {
        const url = "wss://tts-api.xfyun.cn/v2/tts";
        const host = location.host;
        const date = new Date().toUTCString();
        const algorithm = "hmac-sha256";
        const headers = "host date request-line";
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`;
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, this.apiSecret);
        const signature = CryptoJS.enc.Base64.stringify(signatureSha);
        const authorizationOrigin = `api_key="${this.apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
        const authorization = btoa(authorizationOrigin);
        return `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    }
    /**
     * 文本转base64
     * @param text 文本
     */
    private textToBase64(text: string): string {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        let binary = '';
        for (let i = 0; i < data.length; i++) {
            binary += String.fromCharCode(data[i]);
        }
        return btoa(binary);
    }
    /**
     * 播放音频
     */
    private async playAudio() {
        if (this.audioChunks.length === 0) {
            console.warn('No audio data to play')
            return;
        }

        try {
            //合并所有音频片段
            const totalLength = this.audioChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
            const combineBuffer = new Uint8Array(totalLength);

            let offset = 0;
            for (const chunk of this.audioChunks) {
                combineBuffer.set(new Uint8Array(chunk), offset);
                offset += chunk.byteLength;
            }
            //创建音频上下文
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffer = await this.audioContext.decodeAudioData(combineBuffer.buffer);

            //创建音频源并立即播放
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = audioBuffer;
            this.audioSource.connect(this.audioContext.destination);

            this.audioSource.onended = () => {
                this.isPlaying = false;
                console.log('Play finished');
            };

            this.audioSource.start(0);
            this.isPlaying = true;
            console.log('Audio play started');

        } catch (error) {
            console.log('Failed to play audio', error);
        }
    }

    /**
     * 停止播放
     */
    private stopPlayAudio() {
        if (this.isPlaying && this.audioSource) {
            this.audioSource.stop();
            this.isPlaying = false;
            console.log('play stopped');
        }
    }

    /**
     * 主要合成方法
     * @param content 合成文本
     * @param options 可选
     * @returns 
     */
    public async synthesize(content: string, options: TTSOptions = {}): Promise<void> {
        return new Promise((resolve, reject) => {
            const url = this.generateSignature();
            if (!("websocket" in window)) {
                return reject(new Error('WebSocket is not supported in this environment'))
            }
            this.ttsWS = new WebSocket(url);
            this.ttsWS.onopen = () => {
                const params = {
                    common: {
                        app_id: this.appid
                    },
                    business: {
                        aue: options.audioFormat ?? 'raw',
                        auf: `audio/L16;rate=${options.sampleRate || 16000}`,
                        vcn: options.voice ?? "xiaoyan",
                        speed: options.speed ?? 50,
                        volume: options.volume ?? 50,
                        pitch: options.pitch ?? 50,
                        tte: "UTF-8", //文本编码
                    },
                    data: {
                        status: 2,
                        // text: btoa(String.fromCharCode(...new TextEncoder().encode(this.content))),
                        text: this.textToBase64(content)
                    }
                }
                this.ttsWS?.send(JSON.stringify(params));
            };

            //接收es回调
            this.ttsWS.onmessage = (event) => {
                const response: WebSocketMessage = JSON.parse(event.data);
                if (response.code === 0) {
                    //解码base64数据
                    const audioData = Uint8Array.from(atob(response.data.audio), c => c.charCodeAt(0));
                    this.audioChunks.push(audioData.buffer);

                    //如果是最后一个数据包
                    if (response.data.status === 2) {
                        console.log('Received all audio data');
                        this.ttsWS?.close();
                        this.playAudio().then(resolve).catch(reject)
                    }
                } else {
                    this.ttsWS?.close();
                    reject(new Error(`TTS error：${response.message} (code ${response.code})`))
                }
            };
            //发生错误
            this.ttsWS.onerror = (error) => {
                console.log('websocket error：', error);
                this.ttsWS?.close();
                reject(new Error('webscoket connection error'))
            };
            //关闭连接清理
            this.ttsWS.onclose = () => {
                this.ttsWS = null;
            }
        })
    }

    /**
     * 资源销毁
     */
    public destory() {
        this.stopPlayAudio();
        if (this.ttsWS) {
            this.ttsWS.close();
            this.ttsWS = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.audioChunks = [];
    }
}

export default TTS