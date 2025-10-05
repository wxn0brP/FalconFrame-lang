import { AnotherCache } from "@wxn0brp/ac";
import { FFRequest } from "@wxn0brp/falcon-frame";
import { Config } from "./types.js";
export declare const cache: AnotherCache<any, string>;
export declare function getLang(req: FFRequest): string;
export declare function getLangData(req: FFRequest, config: Config, lang?: string): Record<string, string>;
