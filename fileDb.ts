import {Product, ProductWithoutId} from "./types";
import crypto from "crypto";
import {promises as fs} from 'fs';

const fileName = './db.json';

let data: Product[] = [];

const fileDb = {
    async init() {
        try {
            const fileContents = await fs.readFile(fileName); // прочитали файл db.json
            data = JSON.parse(fileContents.toString());
        } catch (e) {
            data = [];
        }
    },
    async getProducts() {
        return data;
    },
    async addProduct(item: ProductWithoutId) {
        const id = crypto.randomUUID();
        const newProduct = {id, ...item};
        data.push(newProduct);
        await this.save();
        return newProduct;
    },
    async save() {
        return fs.writeFile(fileName, JSON.stringify(data));
    }
};

export default fileDb;