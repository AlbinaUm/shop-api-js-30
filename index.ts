import express from 'express'
import productsRouter from "./routes/products";
import fileDb from "./fileDb";
import cors from "cors";
import dotenv from "dotenv";
import mysqlDb from "./mysqlDb";
import categoriesRouter from "./routes/categories";

const app = express();
const port = 8000;

dotenv.config()
app.use(cors());
app.use(express.static('public'));
app.use(express.json());


app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

const run = async () => {
    await fileDb.init();
    await mysqlDb.init();

    app.listen(port, () => {
        console.log("Server running on port " + port);
    });
};

run().catch((err) => console.error(err));

