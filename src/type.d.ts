type AudioFormat = 'raw' | 'lame' | 'wav' //音频格式
type AudioRate = 8000 | 16000 | 24000 | 48000 //音频采样率
/**
 * @description 接口鉴权参数
 * @field appid 
 * @field apiKey 
 * @field apiSecret 
 */
declare type Config = {
    appid: string;
    apiKey: string;
    apiSecret: string;
}
/**
 * @description websocket 消息类型
 */
declare interface WebSocketMessage {
    code: number;
    message: string;
    sid: string;
    data: {
        audio: string;
        status: number;
        ced: string;
    }
}
/**
 * @description 讯飞请求参数
 * @field voice 发音人
 * @field speed 语速
 * @field volume 音量
 * @field pitch 音高
 * @field audioFormat 音频格式
 * @field sampleRate 采样率
 */
declare interface TTSOptions {
    voice?: string;     //发音人
    speed?: number;     //语速
    volume?: number;    //音量
    pitch?: string;     //音高
    audioFormat?: AudioFormat; //音频格式
    sampleRate?: AudioRate; //采样率
}