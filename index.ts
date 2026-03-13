import express from 'express'
import productsRouter from "./routes/products";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
const port = 8000;

dotenv.config()
app.use(cors());
app.use(express.static('public'));
app.use(express.json());


app.use('/products', productsRouter);

const run = async () => {
    await mongoose.connect('mongodb://localhost/shop-js-30');

    app.listen(port, () => {
        console.log("Server running on port " + port);
    });

    process.on('exit', () => {
      mongoose.disconnect();
    });
};

run().catch((err) => console.error(err));

