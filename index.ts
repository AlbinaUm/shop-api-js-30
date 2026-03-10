import express from 'express'
import productsRouter from "./routes/products";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const port = 8000;

dotenv.config()
app.use(cors());
app.use(express.static('public'));
app.use(express.json());


app.use('/products', productsRouter);

const run = async () => {


    app.listen(port, () => {
        console.log("Server running on port " + port);
    });
};

run().catch((err) => console.error(err));

