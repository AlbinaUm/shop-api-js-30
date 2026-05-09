import dotenv from "dotenv";
dotenv.config();

import express from 'express'
import productsRouter from "./routes/products";
import cors from "cors";
import mongoose from "mongoose";
import categoriesRouter from "./routes/categories";
import usersRouter from "./routes/users";
import config from "./config";
import cookieParser from 'cookie-parser';
import adminRouter from "./routes/admin";

const app = express();
const port = 8000;


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log("Server running on port " + port);
    });

    process.on('exit', () => {
      mongoose.disconnect();
    });
};

run().catch((err) => console.error(err));

