import { renderHTML, RouteHandler } from "@wxn0brp/falcon-frame";
import { getLang, getLangData } from "./lang";
import { Config } from "./types";

export function createLangRouter(cfg: Partial<Config>): RouteHandler {
    const config: Config = {
        dir: "public",
        layout: "public/layout.html",
        langDir: "public/lang",
        disableCache: false,
        meta: undefined,
        getSpecific: () => ({}),
        ...cfg
    };

    if (!config.dir.endsWith("/")) config.dir += "/";
    if (!config.langDir.endsWith("/")) config.langDir += "/";

    return async (req, res, next) => {
        const name = req.params.name;

        let meta: Config["meta"] = {};

        if (config.meta) {
            meta = config.meta[name] || config.meta["*"];
            if (!meta) return next();
        }

        const lang = getLang(req);
        const langData = getLangData(req, config, lang);

        const mapLangData = Object.keys(langData).reduce((acc, key) => {
            const _key = "t_" + key.replaceAll("-", "_").replaceAll(".", "_").replaceAll(" ", "_");
            acc[_key] = langData[key];
            return acc;
        }, {});

        const dataObj: any = {
            lang,
            name,
            ...(mapLangData || {}),
            ...(await config.getSpecific?.(name) || {})
        }
        if (meta?.title) dataObj.title = meta.title;

        const html = renderHTML(config.dir + name + ".html", dataObj, [], res.FF);

        res.ct("text/html; charset=utf-8");
        res.end(
            translateHtml(html, langData, lang)
        );
    }
}

function translateHtml(html: string, langData: Record<string, string>, lang: string = "en"): string {
    html = html.replace(
        /<([^>]*?)\s+translate\s*=\s*["']([^"']+)["']([^>]*?)>(.*?)<\/[^>]*?>/gs,
        (fullMatch, beforeTranslate, translateValue, afterTranslate) => {
            let translatedText = langData[translateValue] || translateValue;
            return `<${beforeTranslate} translate="${translateValue}" ${afterTranslate}>${translatedText}</${fullMatch.match(/<\/(\w+)/)[1]}>`;
        }
    );

    html = html.replace(
        /(<[^>]*?)\s+translate-([a-z-]+)=["']([^"']+)["']([^>]*>)/gi,
        (_, beforeTag, attrName, attrValue, afterTag) => {
            const translatedValue = langData[attrValue] || attrValue;
            return `${beforeTag} translate-${attrName}="${attrValue}" ${attrName}="${translatedValue}"${afterTag}`;
        }
    );

    html = html.replace(
        /<html\s+lang=["']([^"']+)["']>/gi,
        () => {
            return `<html lang="${lang}">`;
        }
    );

    return html;
}