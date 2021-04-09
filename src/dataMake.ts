import helpers from "./helpers";
import { ImageData } from "./interfaces/ImageData";
import { TableImages } from "./database/interfaces/Images";
import { TableMovies } from "./database/interfaces/Movies";
import * as path from "path";
import { MovieData } from "./interfaces/MovieData";
import { ClassData } from "./interfaces/ClassData";
import { TableClasses } from "./database/interfaces/Classes";

class DataMake {
    private tableName: string;
    protected list: ImageData[] | MovieData[] | ClassData[];
    protected dataSet: TableImages[] | TableMovies[] | TableClasses[];

    constructor(tableName: string) {
        this.tableName = tableName;
        this.list = [];
        this.dataSet = [];
    }

    getList(): any {
        return this.list;
    }

    getNewData(data: object): any {}

    getLastDataId(): number {
        if (this.dataSet.length > 0) {
            return this.dataSet[this.dataSet.length - 1].id;
        } else {
            return null;
        }
    }

    insertList(): void {
        this.list.forEach((data) => {
            const newData = this.getNewData(data);
            this.dataSet.push(newData);
        });
    }

    saveData(): void {
        helpers.saveJSON(
            this.dataSet,
            this.tableName,
            path.resolve(__dirname, "../data/table")
        );
    }
}

class ImageDataMake extends DataMake {
    protected list: ImageData[];
    protected dataSet: TableImages[];

    constructor(tableName: string) {
        super(tableName);
    }

    getList(): ImageData[] {
        return this.list;
    }

    setList(detailList?: any[], list?: any[]): void {
        if (detailList !== undefined) {
            detailList.forEach(({ item: { ccbaMnm1, imageUrl } }: any) => {
                if (imageUrl) {
                    this.list.push({
                        title: ccbaMnm1,
                        url: helpers.httpToHttps(imageUrl),
                    });
                }
            });
        }

        if (list !== undefined) {
            list.forEach(({ item: { ccimDesc, imageUrl } }: any) => {
                if (typeof imageUrl === "string") {
                    this.list.push({
                        title: ccimDesc,
                        url: helpers.httpToHttps(imageUrl),
                    });
                } else {
                    for (let i = 0; i < imageUrl.length; i++) {
                        this.list.push({
                            title: ccimDesc[i],
                            url: helpers.httpToHttps(imageUrl[i]),
                        });
                    }
                }
            });
        }
    }

    getNewData(data: ImageData): TableImages {
        const lastDataId: number = this.getLastDataId();
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableImages = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            title: data.title,
            url: data.url,
        };

        return newData;
    }
}

class MovieDataMake extends DataMake {
    protected list: MovieData[];
    protected dataSet: TableMovies[];

    constructor(tableName: string) {
        super(tableName);
    }

    getList(): MovieData[] {
        return this.list;
    }

    setList(list: any[]): void {
        this.list = list.reduce(
            (results: MovieData[], { item: { videoUrl } }: any) => {
                const isUrl = (url: string): boolean => {
                    const test: string = url.replace(
                        "http://116.67.83.213/webdata/file_data/media_data/videos/",
                        ""
                    );
                    return test.length > 1;
                };

                let urls: MovieData[] = [];

                if (typeof videoUrl === "string") {
                    if (isUrl(videoUrl))
                        urls.push({
                            url: videoUrl,
                        });
                } else {
                    urls = videoUrl.reduce(
                        (results2: MovieData[], url: string) => {
                            if (isUrl(url)) {
                                results2.push({
                                    url: url,
                                });
                            }
                            return results2;
                        },
                        []
                    );
                }

                urls.forEach((url) => {
                    results.push(url);
                });

                return results;
            },
            []
        );
    }

    getNewData(data: MovieData): TableMovies {
        const lastDataId: number = this.getLastDataId();
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableMovies = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            url: data.url,
        };

        return newData;
    }
}

class ClassDataMake extends DataMake {
    protected list: ClassData[];
    protected dataSet: TableClasses[];

    constructor(tableName: string) {
        super(tableName);
    }

    getList(): ClassData[] {
        return this.list;
    }

    setList(list: any[]): void {}

    getNewData(data: ClassData): TableClasses {
        const lastDataId: number = this.getLastDataId();
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableClasses = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            name: data.name,
        };

        return newData;
    }
}

const run = (): void => {
    const list: any[] = helpers.getJSON("list") as any[];
    const detailList: any[] = helpers.getJSON("detailList") as any[];
    const imageList: any[] = helpers.getJSON("imageList") as any[];
    const videoList: any[] = helpers.getJSON("videoList") as any[];

    // makeImageData(detailList, imageList);
    // makeMovieData(videoList);

    console.log(detailList[0]);

    function makeImageData(detailList: any[], list: any[]): void {
        const imageDataMake = new ImageDataMake("Images");
        imageDataMake.setList(detailList, list);
        imageDataMake.insertList();
        imageDataMake.saveData();
    }

    function makeMovieData(list: any[]): void {
        const movieDataMake = new MovieDataMake("Movies");
        movieDataMake.setList(list);
        movieDataMake.insertList();
        movieDataMake.saveData();
    }

    function makeClassData(list: any[]): void {
        const classDataMake = new ClassDataMake("Classes");
        classDataMake.setList(list);
        classDataMake.insertList();
        classDataMake.saveData();
    }
};

export default {
    run,
};