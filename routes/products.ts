import express, {NextFunction, RequestHandler, Response} from "express";
import {imagesUpload} from "../middleware/multer";
import {ProductWithoutId} from "../types";
import Product from "../models/Product";
import {Error} from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";
import permit from "../middleware/permit";

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
    try {
        const query: {category?: string} = {};

        if (req.query.category) query.category = req.query.category as string;

        const products = await Product.find(query).populate("category").populate("user", 'username');
        res.send(products);
    } catch (e) {
       res.sendStatus(500);
    }
});

productsRouter.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const product = await Product.findById(id).populate("category");
        res.send(product);
    } catch (e) {
        res.sendStatus(500);
    }
});

export default productsRouter;
