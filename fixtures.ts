import mongoose from "mongoose";
import config from "./config";
import Category from "./models/Category";
import Product from "./models/Product";
import User from "./models/User";
import {randomUUID} from "crypto";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('categories');
        await db.dropCollection('products');
        await db.dropCollection('users');
    } catch (e) {
        console.log('Collections were not present, skipping drop');
    }

    const [cpuCategory, ssdCategory] = await Category.create(
        {
            title: 'CPUs',
            description: 'Central Processing Units'
        },
        {
            title: 'SSDs',
            description: 'Solid State Drives'
        }
    );

    await Product.create(
        {
            category: cpuCategory!._id,
            title: 'Intel Core i7',
            price: 350,
            images: ['fixtures/cpu.jpg'],
        },
        {
            category: ssdCategory!._id,
            title: 'Samsung 990 Pro 1Tb',
            price: 150,
            images: ['fixtures/ssd.jpg'],
        }
    );

    await User.create({
            username: 'admin',
            password: '123',
            token: randomUUID()
        },
        {
            username: 'jone',
            password: '123',
            token: randomUUID()
        });

    await db.close();
};


run().catch((err) => console.error(err));