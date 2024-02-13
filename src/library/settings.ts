import { readFileSync, writeFileSync } from "fs"

export type OpenAISettings = {
    requests: any[]
}
declare global {
    var _settings: {
        saveConfig: (settings: OpenAISettings) => void
        data: OpenAISettings
    }
}

let _settings = global._settings;
if (!_settings) {

    let data: OpenAISettings = {
        requests: []
    }
    try {
        const result = readFileSync("config/openai.json")
        data = JSON.parse(String(result));
    } catch (e) {
    }

    _settings = {
        saveConfig: (data) => {
            // Save & Store
            _settings.data = data;
            writeFileSync('config/openai.json', JSON.stringify(_settings.data, null, 2), 'utf8');
        },
        data: data
    }
}

export const settings = _settings;

if (process.env.NODE_ENV !== 'production') global._settings = _settings