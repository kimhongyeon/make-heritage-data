const fs = require("fs");
const axios = require("axios");
const parser = require("fast-xml-parser");

const apis = {
    list: "https://www.cha.go.kr/cha/SearchKindOpenapiList.do",
    detail: "https://www.cha.go.kr/cha/SearchKindOpenapiDt.do",
    image: "https://www.cha.go.kr/cha/SearchImageOpenapi.do",
    video: "https://www.cha.go.kr/cha/SearchVideoOpenapi.do",
};

const helpers = {
    xmlToJSON(xml) {
        return parser.parse(xml, {
            parseNodeValue: false,
        });
    },
    saveJSON(jsonData, filename) {
        fs.writeFileSync(`./data/${filename}.json`, JSON.stringify(jsonData));
    },
    getJSON(filename) {
        try {
            return JSON.parse(
                fs.readFileSync(`./data/${filename}.json`, "utf-8")
            );
        } catch (err) {
            return [];
        }
    },
    getItems(list, url) {
        return new Promise((resolve, reject) => {
            Promise.all(
                list.map(({ ccbaKdcd, ccbaAsno, ccbaCtcd }) =>
                    axios.get(
                        `${url}?ccbaKdcd=${ccbaKdcd}&ccbaAsno=${ccbaAsno}&ccbaCtcd=${ccbaCtcd}`
                    )
                )
            )
                .then((values) => {
                    let results = values.map((value) => {
                        return this.xmlToJSON(value.data).result;
                    });
                    resolve(results);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};

const getDataFuntions = {
    async getList(page, limit) {
        let result = await axios.get(
            `${apis.list}?pageIndex=${page}&pageUnit=${limit}`
        );
        let list = helpers.xmlToJSON(result.data).result.item;
        return list;
    },
    async getDetailList(list) {
        return await helpers.getItems(list, apis.detail);
    },
    async getImageList(list) {
        return await helpers.getItems(list, apis.image);
    },
    async getVideoList(list) {
        return await helpers.getItems(list, apis.video);
    },
};

const makeDataFunctions = {
    httpToHttps(url) {
        return url.replace(/http/, "https");
    },
    setHeritageImages(dList, iList) {
        let list = [];

        dList.forEach(({ item: { ccbaMnm1, imageUrl } }) => {
            if (imageUrl) {
                list.push({
                    title: ccbaMnm1,
                    url: this.httpToHttps(imageUrl),
                });
            }
        });

        iList.forEach(({ item: { ccimDesc, imageUrl } }) => {
            if (typeof(imageUrl) === "string") {
                list.push({
                    title: ccimDesc,
                    url: this.httpToHttps(imageUrl)
                });
            } else {
                for (let i=0; i < imageUrl.length; i++) {
                    list.push({
                        title: ccimDesc[i],
                        url: this.httpToHttps(imageUrl[i])
                    });
                }
            }
        });

        return list;
    },
};

const limit = 30;
const totalPage = 100;

run();

async function run() {
    // await getDataAndSave();
    makeData();
}

async function getDataAndSave() {
    let list = [];
    let detailList = [];
    let imageList = [];
    let videoList = [];

    for (let page = 1; page <= totalPage; page++) {
        let pageList = await getDataFuntions.getList(page, limit);
        let pageDetailList = await getDataFuntions.getDetailList(pageList);
        let pageImageList = await getDataFuntions.getImageList(pageDetailList);
        let pageVideoList = await getDataFuntions.getVideoList(pageDetailList);

        list = list.concat(pageList);
        detailList = detailList.concat(pageDetailList);
        imageList = imageList.concat(pageImageList);
        videoList = videoList.concat(pageVideoList);

        console.log(`${page} / ${totalPage}`);
    }

    helpers.saveJSON(list, "list");
    helpers.saveJSON(detailList, "detailList");
    helpers.saveJSON(imageList, "imageList");
    helpers.saveJSON(videoList, "videoList");

    console.log("done");
}

function makeData() {
    const list = helpers.getJSON("list");
    const detailList = helpers.getJSON("detailList");
    const imageList = helpers.getJSON("imageList");
    const videoList = helpers.getJSON("videoList");

    console.log(imageList[0]);
    const HeritageImages = makeDataFunctions.setHeritageImages(detailList, imageList);
    console.log(HeritageImages);
}
