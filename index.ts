import express from 'express'
import productsRouter from "./routes/products";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import categoriesRouter from "./routes/categories";
import usersRouter from "./routes/users";
import config from "./config";
import tasksRouter from "./routes/tasks";
import cookieParser from 'cookie-parser';

const app = express();
const port = 8000;

dotenv.config()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/tasks', tasksRouter);

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

