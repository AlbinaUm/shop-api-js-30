import express from "express";
import {Request, Response} from "express";
import fileDb from "../fileDb";

const productsRouter = express.Router();

productsRouter.get('/', async (req: Request, res: Response) => {
    const products = await fileDb.getProducts();
    return res.send(products);
});

productsRouter.get('/:id', async (req: Request, res: Response) => {
    const products = await fileDb.getProducts();
    const id = req.params.id;

    const productById = products.find(p => p.id === id);

    if (productById) {
        return res.send(productById);
    } else {
        return res.status(404).send("Not Found Product");
    }
});

productsRouter.post('/', async (req: Request, res: Response) => {
    if (!req.body.title || !req.body.description || !req.body.price) {
        return res.status(400).send({error: "Please enter a title, description, price"});
    }

    const newProduct = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
    };

    const savedProduct = await fileDb.addProduct(newProduct);
    return res.send(savedProduct);
});

export default productsRouter;
