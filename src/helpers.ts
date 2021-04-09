import * as fs from "fs";
import * as parser from "fast-xml-parser";

const xmlToJSON = (xml: string): any => {
    return parser.parse(xml, {
        parseNodeValue: false,
    });
};

const saveJSON = (jsonData: any, filename: string, path?: string): void => {
    let savePath = `./data/${filename}.json`;
    if (path) {
        savePath = `${path}/${filename}.json`;
    }
    fs.writeFileSync(savePath, JSON.stringify(jsonData));
};

const getJSON = (filename: string): any => {
    try {
        return JSON.parse(fs.readFileSync(`./data/${filename}.json`, "utf-8"));
    } catch (err) {
        return [];
    }
};

const httpToHttps = (url: string): string => {
    return url.replace(/http/, "https");
};

export default {
    xmlToJSON,
    saveJSON,
    getJSON,
    httpToHttps,
};
