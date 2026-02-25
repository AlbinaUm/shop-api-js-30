import express from "express";
import {Request, Response} from "express";
import fileDb from "../fileDb";
import {imagesUpload} from "../multer";

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

productsRouter.post('/', imagesUpload.single('image') , async (req: Request, res: Response) => {
    if (!req.body.title || !req.body.description || !req.body.price) {
        return res.status(400).send({error: "Please enter a title, description, price"});
    }

    const newProduct = {
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price),
        image: req.file ? 'images/' + req.file.filename : null,
    };

    const savedProduct = await fileDb.addProduct(newProduct);
    return res.send(savedProduct);
});

productsRouter.delete('/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const deleteProductSave = await fileDb.deleteProduct(id);
    res.send(deleteProductSave);
});

export default productsRouter;
