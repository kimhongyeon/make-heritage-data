import { TableDefault } from "./Default";

export interface TableHeritages extends TableDefault {
    name: string;
    nameChin: string;
    longitude: number;
    latitude: number;
    quantity: string;
    registDate: Date;
    address: string;
    content: string;
    admin: string;
    owner: string;
    class_id?: number;
}
