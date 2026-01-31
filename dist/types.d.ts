export interface Config {
    meta: Record<string, {
        title: string;
        [key: string]: any;
    }>;
    dir: string;
    layout: string;
    langDir: string;
    getSpecific: (name: string) => Promise<Record<string, any>> | Record<string, any>;
    disableCache: boolean;
}
