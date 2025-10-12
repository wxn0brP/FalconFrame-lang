import { AnotherCache } from "@wxn0brp/ac";
import { existsSync, readFileSync } from "fs";
export const cache = new AnotherCache();
export function getLang(req) {
    let lang = req.query.lang || req.cookies.lang || req.headers["accept-language"];
    if (!lang)
        return "en";
    lang = lang.split(",")[0].split(";")[0].split("-")[0];
    return lang;
}
export function getLangData(req, config, lang = getLang(req)) {
    if (cache.has(lang))
        return cache.get(lang);
    const path = config.langDir + lang + ".json";
    if (existsSync(path)) {
        try {
            const data = JSON.parse(readFileSync(path, "utf-8"));
            cache.set(lang, data);
            return data;
        }
        catch { }
    }
    return {};
}
