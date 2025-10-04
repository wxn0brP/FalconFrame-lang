import { AnotherCache } from "@wxn0brp/ac";
import { FFRequest } from "@wxn0brp/falcon-frame";
import { existsSync, readFileSync } from "fs";
import { Config } from "./types";

export const cache = new AnotherCache();

export function getLang(req: FFRequest) {
    let lang = req.query.lang || req.cookies.lang || req.headers["accept-language"];
    if (!lang) return "en";
    lang = lang.split(",")[0].split(";")[0].split("-")[0];
    return lang;
}

export function getLangData(req: FFRequest, config: Config, lang: string = getLang(req)): Record<string, string> {
    if (cache.has(lang)) return cache.get(lang);

    const path = config.langDir + lang + ".json";
    if (existsSync(path)) {
        try {
            const data = JSON.parse(readFileSync(path, "utf-8"));
            cache.set(lang, data);
            return data;
        } catch { }
    }

    return {};
}