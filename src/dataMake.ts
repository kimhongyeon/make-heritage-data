import helpers from "./helpers";
import { ImageData } from "./interfaces/ImageData";
import { TableImages } from "./database/interfaces/Images";
import { TableMovies } from "./database/interfaces/Movies";
import * as path from "path";
import { MovieData } from "./interfaces/MovieData";
import { ClassData } from "./interfaces/ClassData";
import { EntityData } from "./interfaces/EntityData";
import { TableClasses } from "./database/interfaces/Classes";
import { TableEntities } from "./database/interfaces/Entities";
import { TableAdmins } from "./database/interfaces/Admins";
import { TableOwners } from "./database/interfaces/Owners";
import { AgeData } from "./interfaces/AgeData";
import { TableAges } from "./database/interfaces/Ages";

class DataMake {
    private tableName: string;
    protected list:
        | ImageData[]
        | MovieData[]
        | ClassData[]
        | EntityData[]
        | AgeData[];
    protected dataSet:
        | TableImages[]
        | TableMovies[]
        | TableClasses[]
        | TableEntities[]
        | TableAges[];

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

class EntityDataMake extends DataMake {
    protected list: EntityData[];
    protected dataSet: TableEntities[];

    private adminTableName: string;
    private adminDataSet: TableAdmins[];

    private ownerTableName: string;
    private ownerDataSet: TableOwners[];

    constructor(
        tableName: string,
        adminTableName: string,
        ownerTableName: string
    ) {
        super(tableName);
        this.adminTableName = adminTableName;
        this.ownerTableName = ownerTableName;

        this.adminDataSet = [];
        this.ownerDataSet = [];
    }

    getList(): EntityData[] {
        return this.list;
    }

    setList(list: any[]): void {
        this.list = list.reduce(
            (results, { item: { ccbaPoss, ccbaAdmin } }) => {
                const setResults = (ary: any[], str: string): any[] => {
                    const existObj = ary.find(({ name }) => name === str);
                    if (existObj === undefined) {
                        results.push({
                            name: str,
                        });
                    }
                    return ary;
                };

                if (ccbaPoss) {
                    results = setResults(results, ccbaPoss);
                }

                if (ccbaAdmin) {
                    results = setResults(results, ccbaAdmin);
                }

                return results;
            },
            []
        );
    }

    getAdminLastDataId(): number {
        if (this.adminDataSet.length > 0) {
            return this.adminDataSet[this.adminDataSet.length - 1].id;
        } else {
            return null;
        }
    }

    getOwnerLastDataId(): number {
        if (this.ownerDataSet.length > 0) {
            return this.ownerDataSet[this.ownerDataSet.length - 1].id;
        } else {
            return null;
        }
    }

    getNewData(data: EntityData): TableEntities {
        const lastDataId: number = this.getLastDataId();
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableEntities = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            name: data.name,
        };

        return newData;
    }

    getAdminNewData(data: TableEntities) {
        const lastDataId: number = this.getAdminLastDataId();
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableAdmins = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            entity_id: data.id,
        };

        return newData;
    }

    getOwnerNewData(data: TableEntities) {
        const lastDataId: number = this.getOwnerLastDataId();
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableOwners = {
            id: newId,
            createdAt: new Date(),
            updatedAt: new Date(),
            entity_id: data.id,
        };

        return newData;
    }

    insertList(): void {
        super.insertList();

        this.dataSet.forEach((data) => {
            const newData = this.getAdminNewData(data);
            this.adminDataSet.push(newData);
        });

        this.dataSet.forEach((data) => {
            const newData = this.getOwnerNewData(data);
            this.ownerDataSet.push(newData);
        });
    }

    saveData(): void {
        super.saveData();

        helpers.saveJSON(
            this.adminDataSet,
            this.adminTableName,
            path.resolve(__dirname, "../data/table")
        );

        helpers.saveJSON(
            this.ownerDataSet,
            this.ownerTableName,
            path.resolve(__dirname, "../data/table")
        );
    }
}

class AgeDataMake extends DataMake {
    protected list: AgeData[];
    protected dataSet: TableAges[];

    constructor(tableName: string) {
        super(tableName);
    }

    getList(): AgeData[] {
        return this.list;
    }

    setList(list: any[]): void {
        this.list = list.reduce((results, { item: { ccceName } }) => {
            const existObj = results.find(({ name }) => name === ccceName);
            if (existObj === undefined) {
                results.push({
                    name: ccceName,
                });
            }

            return results;
        }, []);
    }

    getNewData(data: AgeData): TableAges {
        const lastDataId: number = this.getLastDataId();
        const newId: number = lastDataId === null ? 1 : lastDataId + 1;

        const newData: TableAges = {
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

    makeImageData(detailList, imageList);
    makeMovieData(videoList);
    makeClassData(detailList);
    makeEntityData(detailList);
    makeAgeData(detailList);

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

    function makeEntityData(list: any[]): void {
        const entityDataMake = new EntityDataMake(
            "Entities",
            "Admins",
            "Owners"
        );
        entityDataMake.setList(list);
        entityDataMake.insertList();
        entityDataMake.saveData();
    }

    function makeAgeData(list: any[]): void {
        const ageDataMake = new AgeDataMake("Ages");
        ageDataMake.setList(list);
        ageDataMake.insertList();
        ageDataMake.saveData();
    }
};

export default {
    run,
};
