import express, {NextFunction, RequestHandler, Response} from "express";
import {imagesUpload} from "../../middleware/multer";
import {RequestWithUser} from "../../middleware/auth";
import {ProductWithoutId} from "../../types";
import Product from "../../models/Product";
import {Error} from "mongoose";

const productsAdminRouter = express.Router();

productsAdminRouter.post('/', imagesUpload.array('images', 3),async (req, res, next) => {
    try {
        const files = req.files as Express.Multer.File[];
        const {user} = req as RequestWithUser;

        const newProduct: ProductWithoutId = {
            category: req.body.category,
            user: user._id.toString(),
            title: req.body.title,
            description: req.body.description || null,
            price: Number(req.body.price),
            images: files ? files.map(file =>'images/' + file.filename) : null,
        };

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

productsAdminRouter.delete('/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.send({message: 'Product deleted successfully.'});
    } catch (e) {
        next(e);
    }
});

export default productsAdminRouter;
