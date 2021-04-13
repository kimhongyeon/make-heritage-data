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

const strToDate = (str: string): Date => {
    const year: number = Number(str.substring(0, 4));
    const month: number = Number(str.substring(4, 6)) - 1;
    const day: number = Number(str.substring(6, 8));

    return new Date(year, month, day);
};

const isMovieUrl = (url: string): boolean => {
    const test: string = url.replace(
        "http://116.67.83.213/webdata/file_data/media_data/videos/",
        ""
    );
    return test.length > 1;
};

export default {
    xmlToJSON,
    saveJSON,
    getJSON,
    httpToHttps,
    strToDate,
    isMovieUrl,
};
