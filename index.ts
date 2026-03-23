import express from 'express'
import productsRouter from "./routes/products";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import categoriesRouter from "./routes/categories";
import usersRouter from "./routes/users";
import config from "./config";

const app = express();
const port = 8000;

dotenv.config()
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

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

