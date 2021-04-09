import axios, { AxiosResponse } from "axios";
import { appendFileSync } from "node:fs";
import helpers from "./helpers";

let LIMIT: number = 30;
let TOTAL_PAGE: number = 100;

class Heritage {
    private readonly apis = {
        list: "https://www.cha.go.kr/cha/SearchKindOpenapiList.do",
        detail: "https://www.cha.go.kr/cha/SearchKindOpenapiDt.do",
        image: "https://www.cha.go.kr/cha/SearchImageOpenapi.do",
        video: "https://www.cha.go.kr/cha/SearchVideoOpenapi.do",
    };

    private page: number;
    private limit: number;

    private list: any[];
    private detailList: any[];
    private imageList: any[];
    private videoList: any[];

    static saveList(list: any[]): void {
        helpers.saveJSON(list, "list");
    }

    static saveDetailList(list: any[]): void {
        helpers.saveJSON(list, "detailList");
    }

    static saveImageList(list: any[]): void {
        helpers.saveJSON(list, "imageList");
    }

    static saveVideoList(list: any[]): void {
        helpers.saveJSON(list, "videoList");
    }

    constructor(page: number, limit: number) {
        this.page = page;
        this.limit = limit;

        this.list = [];
        this.detailList = [];
        this.imageList = [];
        this.videoList = [];
    }

    private getItems(list: any[], url: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            Promise.all(
                list.map(({ ccbaKdcd, ccbaAsno, ccbaCtcd }: any): any =>
                    axios.get(
                        `${url}?ccbaKdcd=${ccbaKdcd}&ccbaAsno=${ccbaAsno}&ccbaCtcd=${ccbaCtcd}`
                    )
                )
            )
                .then((values) => {
                    const results = values.map((value: AxiosResponse) => {
                        const data: any = helpers.xmlToJSON(value.data);
                        return data.result;
                    });
                    resolve(results);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    async callAPIList(): Promise<void> {
        const result = await axios.get(
            `${this.apis.list}?pageIndex=${this.page}&pageUnit=${this.limit}`
        );

        const data: any = helpers.xmlToJSON(result.data);
        this.list = data.result.item;
    }

    async callAPIDetailList(): Promise<void> {
        this.detailList = await this.getItems(this.list, this.apis.detail);
    }

    async callAPIImageList(): Promise<void> {
        this.imageList = await this.getItems(this.detailList, this.apis.image);
    }

    async callAPIVideoList(): Promise<void> {
        this.videoList = await this.getItems(this.detailList, this.apis.video);
    }

    getList(): any[] {
        return this.list;
    }

    getDetailList(): any[] {
        return this.detailList;
    }

    getImageList(): any[] {
        return this.imageList;
    }

    getVideoList(): any[] {
        return this.videoList;
    }
}

const run = async (
    limit?: number,
    totalPage?: number,
    isRun?: boolean
): Promise<void> => {
    if (limit !== undefined) {
        LIMIT = limit;
    }
    if (totalPage !== undefined) {
        TOTAL_PAGE = totalPage;
    }

    if (isRun) {
        let heritageList: Heritage[] = [];

        for (let page = 1; page <= TOTAL_PAGE; page++) {
            const heritage = new Heritage(page, LIMIT);

            await heritage.callAPIList();
            await heritage.callAPIDetailList();
            await heritage.callAPIImageList();
            await heritage.callAPIVideoList();

            heritageList.push(heritage);

            console.log(`${page} / ${TOTAL_PAGE}`);
        }

        let result: any = {
            list: [],
            detailList: [],
            imageList: [],
            videoList: [],
        };

        for (const heritage of heritageList) {
            result.list = result.list.concat(heritage.getList());
            result.detailList = result.list.concat(heritage.getDetailList());
            result.imageList = result.list.concat(heritage.getImageList());
            result.videoList = result.list.concat(heritage.getVideoList());
        }

        Heritage.saveList(result.list);
        Heritage.saveDetailList(result.detailList);
        Heritage.saveImageList(result.imageList);
        Heritage.saveVideoList(result.videoList);
    }
};

export default {
    run,
};
