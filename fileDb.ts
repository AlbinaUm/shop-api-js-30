import {Product, ProductWithoutId} from "./types";
import crypto from "crypto";
import {promises as fs} from 'fs';
import path from 'path';
import config from "./config";

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
    async deleteProduct(id: string) {
        const findProduct = data.find(product => product.id === id);
        if (findProduct) {
            if (findProduct.image)  await fs.unlink(path.join(config.publicPath, findProduct.image));
            data = data.filter(product => product.id !== id);
            await this.save();
        }
      return {'message': 'Product deleted successfully.'};
    },
    async save() {
        return fs.writeFile(fileName, JSON.stringify(data));
    }
};

export default fileDb;