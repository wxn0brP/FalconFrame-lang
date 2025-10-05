import { renderHTML, RouteHandler } from "@wxn0brp/falcon-frame";
import { getLang, getLangData } from "./lang";
import { Config } from "./types";

export function createLangRouter(config: Config): RouteHandler {
    config = {
        dir: "public",
        layout: "public/layout.html",
        langDir: "public/lang",
        ...config
    }
    if (!config.dir.endsWith("/")) config.dir += "/";
    if (!config.langDir.endsWith("/")) config.langDir += "/";

    return (req, res, next) => {
        const name = req.params.name;

        const meta = config.meta[name] || config.meta["*"];
        if (!meta) return next();

        const lang = getLang(req);
        const langData = getLangData(req, config, lang);

        const mapLangData = Object.keys(langData).reduce((acc, key) => {
            const _key = "t_" + key.replaceAll("-", "_").replaceAll(".", "_").replaceAll(" ", "_");
            acc[_key] = langData[key];
            return acc;
        }, {});

        const dataObj: any = {
            title: meta.title || name,
            lang,
            name,
            ...(mapLangData || {}),
            ...(config.getSpecific?.(name) || {})
        }

        const main = renderHTML(config.dir + name + ".html", dataObj);
        let html = renderHTML(config.layout, { body: main, ...dataObj });

        html = translateHtml(html, langData);
        res.ct("text/html; charset=utf-8");
        res.end(html);
    }
}

function translateHtml(html: string, langData: Record<string, string>): string {
    html = html.replace(
        /<([^>]*?)\s+translate\s*=\s*["']([^"']+)["']([^>]*?)>(.*?)<\/[^>]*?>/gs,
        (fullMatch, beforeTranslate, translateValue, afterTranslate, innerHTML) => {
            let translatedText = langData[translateValue] || translateValue;
            return `<${beforeTranslate} translate="${translateValue}" ${afterTranslate}>${translatedText}</${fullMatch.match(/<\/(\w+)/)[1]}>`;
        }
    );

    html = html.replace(
        /(<[^>]*?)\s+translate-([a-z-]+)=["']([^"']+)["']([^>]*>)/gi,
        (fullMatch, beforeTag, attrName, attrValue, afterTag) => {
            const translatedValue = langData[attrValue] || attrValue;
            return `${beforeTag} translate-${attrName}="${attrValue}" ${attrName}="${translatedValue}"${afterTag}`;
        }
    );

    return html;
}