import TTS from './tts';
class XFYunTTSClient {
    constructor(config: Config, content: string) {
        this.validateConfig(config)
        new TTS({ ...config }, content)
    }
    private validateConfig(config: Config) {
        if (!config.appid || !config.apiKey || !config.apiSecret) {
            throw new Error('Missing required authenication parameters')
        }
    }
}
export default XFYunTTSClient