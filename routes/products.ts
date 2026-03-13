import express from "express";
import {imagesUpload} from "../multer";
import {ProductWithoutId} from "../types";
import Product from "../models/Product";
import {Error} from "mongoose";

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate("category");
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

productsRouter.post('/', imagesUpload.single('image'),async (req, res, next) => {
    const newProduct: ProductWithoutId = {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description || null,
        price: Number(req.body.price),
        image: req.file ? 'images/' + req.file.filename : null,
    };

    try {
        const product = new Product(newProduct);
        await product.save();
        res.send(product);
    } catch (error){
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
            return;
        }
      next(error);
    }
})

productsRouter.delete('/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.send({message: 'Product deleted successfully.'});
    } catch (e) {
        next(e);
    }
});

export default productsRouter;
