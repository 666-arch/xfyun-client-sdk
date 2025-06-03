import TTS from './tts';
export default class XFYunTTSClient {
    constructor(config: Config) {
        this.validateConfig(config)
        new TTS({ ...config })
    }
    private validateConfig(config: Config) {
        if (!config.appid || !config.apiKey || !config.apiSecret) {
            throw new Error('Missing required authenication parameters')
        }
    }
}

// export default XFYunTTSClient
