import helpers from "./helpers";
import { ImageData } from "./interfaces/ImageData";
import { TableImages } from "./database/interfaces/Images";
import { TableMovies } from "./database/interfaces/Movies";
import * as path from "path";
import { MovieData } from "./interfaces/MovieData";
import { ClassData } from "./interfaces/ClassData";
import { TableClasses } from "./database/interfaces/Classes";
import { AgeData } from "./interfaces/AgeData";
import { TableAges } from "./database/interfaces/Ages";
import { TableHeritageImages } from "./database/interfaces/HeritageImages";
import { TableHeritages } from "./database/interfaces/Heritages";
import { HeritageData } from "./interfaces/HeritageData";
import { TableHeritageMovies } from "./database/interfaces/HeritageMovies";
import { HeritageImageData } from "./interfaces/HeritageImageData";
import { HeritageMovieData } from "./interfaces/HeritageMovieData";

class DataMake {
    private tableName: string;
    protected list:
        | ImageData[]
        | MovieData[]
        | ClassData[]
        | AgeData[]
        | HeritageData[];
    protected dataSet:
        | TableImages[]
        | TableMovies[]
        | TableClasses[]
        | TableAges[]
        | TableHeritages[];

    constructor(tableName: string) {
        this.tableName = tableName;
        this.list = [];
        this.dataSet = [];
    }

    getList(): any {
        return this.list;
    }

    getNewData(data: object): any {}

    getLastDataId(dataSet): number {
        if (dataSet.length > 0) {
            return dataSet[dataSet.length - 1].id;
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
        const lastDataId: number = this.getLastDataId(this.dataSet);
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableImages = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
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
                let urls: MovieData[] = [];

                if (typeof videoUrl === "string") {
                    if (helpers.isMovieUrl(videoUrl))
                        urls.push({
                            url: videoUrl,
                        });
                } else {
                    urls = videoUrl.reduce(
                        (results2: MovieData[], url: string) => {
                            if (helpers.isMovieUrl(url)) {
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
        const lastDataId: number = this.getLastDataId(this.dataSet);
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableMovies = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
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

    setList(list: any[]): void {
        this.list = list.reduce((results, { item: { ccmaName } }) => {
            const existObj = results.find(({ name }) => name === ccmaName);
            if (existObj === undefined) {
                results.push({
                    name: ccmaName,
                });
            }

            return results;
        }, []);
    }

    getNewData(data: ClassData): TableClasses {
        const lastDataId: number = this.getLastDataId(this.dataSet);
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableClasses = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        };

        return newData;
    }
}

class HeritageDataMake extends DataMake {
    protected list: HeritageData[];
    protected dataSet: TableHeritages[];

    private imageTableName: string;
    private movieTableName: string;

    private imageList: HeritageImageData[];
    private imageDataSet: TableHeritageImages[];

    private movieList: HeritageMovieData[];
    private movieDataSet: TableHeritageMovies[];

    private tableClasses: TableClasses[];
    private tableImages: TableImages[];
    private tableMovies: TableMovies[];

    constructor(
        tableName: string,
        imageTableName: string,
        movieTableName: string
    ) {
        super(tableName);

        this.imageTableName = imageTableName;
        this.movieTableName = movieTableName;

        this.imageList = [];
        this.imageDataSet = [];

        this.movieList = [];
        this.movieDataSet = [];

        this.tableClasses = helpers.getJSON("table/Classes") as TableClasses[];
        this.tableImages = helpers.getJSON("table/Images") as TableImages[];
        this.tableMovies = helpers.getJSON("table/Movies") as TableMovies[];
    }

    getList(): HeritageData[] {
        return this.list;
    }

    setList(list: any[]): void {
        this.list = list.reduce((results: HeritageData[], obj) => {
            const classObj: TableClasses = this.tableClasses.find(
                ({ name }) => name === obj.item.ccmaName
            );
            const class_id: number =
                classObj !== undefined ? classObj.id : undefined;

            results.push({
                name: obj.item.ccbaMnm1,
                nameChin: obj.item.ccbaMnm2,
                longitude: Number(obj.longitude),
                latitude: Number(obj.latitude),
                quantity: obj.item.ccbaQuan,
                registDate: helpers.strToDate(obj.item.ccbaAsdt),
                address: obj.item.ccbaLcad,
                content: obj.item.content,
                admin: obj.item.ccbaAdmin,
                owner: obj.item.ccbaPoss,
                class_id,
            });

            return results;
        }, []);
    }

    setImageList(list: any[], imageList: any[]): void {
        for (const index in list) {
            console.log(index);
            const rawObj = list[index];
            const classObj = this.dataSet[index];

            this.imageList = imageList.reduce(
                (
                    v: HeritageImageData[],
                    { ccbaKdcd, ccbaAsno, ccbaCtcd, item: { imageUrl } }
                ) => {
                    if (
                        rawObj.ccbaKdcd === ccbaKdcd &&
                        rawObj.ccbaAsno === ccbaAsno &&
                        rawObj.ccbaCtcd === ccbaCtcd
                    ) {
                        if (typeof imageUrl === "string") {
                            v.push({
                                heritage_id: classObj.id,
                                image_id: this.tableImages.find(
                                    (v) =>
                                        v.url === helpers.httpToHttps(imageUrl)
                                ).id,
                            });
                        } else {
                            v = imageUrl.reduce(
                                (vv: HeritageImageData[], url: string) => {
                                    vv.push({
                                        heritage_id: classObj.id,
                                        image_id: this.tableImages.find(
                                            (v) =>
                                                v.url ===
                                                helpers.httpToHttps(url)
                                        ).id,
                                    });

                                    return vv;
                                },
                                v
                            );
                        }
                    }

                    return v;
                },
                this.imageList
            );
        }
    }

    setMovieList(list: any[], movieList: any[]): void {
        for (const index in list) {
            console.log(index);
            const rawObj = list[index];
            const classObj = this.dataSet[index];

            this.movieList = movieList.reduce(
                (
                    v: HeritageMovieData[],
                    { ccbaKdcd, ccbaAsno, ccbaCtcd, item: { videoUrl } }
                ) => {
                    if (
                        rawObj.ccbaKdcd === ccbaKdcd &&
                        rawObj.ccbaAsno === ccbaAsno &&
                        rawObj.ccbaCtcd === ccbaCtcd
                    ) {
                        if (typeof videoUrl === "string") {
                            if (helpers.isMovieUrl(videoUrl)) {
                                v.push({
                                    heritage_id: classObj.id,
                                    movie_id: this.tableMovies.find(
                                        (v) => v.url === videoUrl
                                    ).id,
                                });
                            }
                        } else {
                            v = videoUrl.reduce(
                                (vv: HeritageMovieData[], url: string) => {
                                    if (helpers.isMovieUrl(url)) {
                                        vv.push({
                                            heritage_id: classObj.id,
                                            movie_id: this.tableMovies.find(
                                                (v) => v.url === url
                                            ).id,
                                        });
                                    }

                                    return vv;
                                },
                                v
                            );
                        }
                    }

                    return v;
                },
                this.movieList
            );
        }
    }

    getNewData(data: HeritageData): TableHeritages {
        const lastDataId: number = this.getLastDataId(this.dataSet);
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableHeritages = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        };

        return newData;
    }

    getImageNewData(data: HeritageImageData): TableHeritageImages {
        const lastDataId: number = this.getLastDataId(this.imageDataSet);
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableHeritageImages = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        };

        return newData;
    }

    getMovieNewData(data: HeritageMovieData): TableHeritageMovies {
        const lastDataId: number = this.getLastDataId(this.movieDataSet);
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableHeritageMovies = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        };

        return newData;
    }

    insertImageList(): void {
        this.imageList.forEach((data) => {
            const newData = this.getImageNewData(data);
            this.imageDataSet.push(newData);
        });
    }

    insertMovieList(): void {
        this.movieList.forEach((data) => {
            const newData = this.getMovieNewData(data);
            this.movieDataSet.push(newData);
        });
    }

    saveImageData(): void {
        helpers.saveJSON(
            this.imageDataSet,
            this.imageTableName,
            path.resolve(__dirname, "../data/table")
        );
    }

    saveMovieData(): void {
        helpers.saveJSON(
            this.movieDataSet,
            this.movieTableName,
            path.resolve(__dirname, "../data/table")
        );
    }
}

const run = (): void => {
    const list: any[] = helpers.getJSON("list") as any[];
    const detailList: any[] = helpers.getJSON("detailList") as any[];
    const imageList: any[] = helpers.getJSON("imageList") as any[];
    const videoList: any[] = helpers.getJSON("videoList") as any[];

    makeImageData(detailList, imageList);
    makeMovieData(videoList);
    makeClassData(detailList);
    makeHeritageData(detailList, imageList, videoList);

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

    function makeHeritageData(list: any[], imageList: any[], videoList: any[]) {
        const heritageDataMake = new HeritageDataMake(
            "Heritages",
            "HeritageImages",
            "HeritageMovies"
        );
        heritageDataMake.setList(list);
        heritageDataMake.insertList();
        heritageDataMake.saveData();

        heritageDataMake.setImageList(list, imageList);
        heritageDataMake.insertImageList();
        heritageDataMake.saveImageData();

        heritageDataMake.setMovieList(list, videoList);
        heritageDataMake.insertMovieList();
        heritageDataMake.saveMovieData();
    }
};

export default {
    run,
};
