import express from "express";
import {Request, Response} from "express";
import {imagesUpload} from "../multer";
import {Product, ProductWithoutId} from "../types";

const productsRouter = express.Router();

productsRouter.get('/', async (req: Request, res: Response) => {
    // const products = await fileDb.getProducts();
    // return res.send(products);

    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query(
        'SELECT p.title, p.price, p.description, p.image, JSON_OBJECT(\"title\", c.title, \"id\", c.id) as category FROM products as p LEFT JOIN categories as c ON p.category_id = c.id ORDER BY created_at DESC'
    );
    const products = result as Product[];
    res.send(products);
});

productsRouter.get('/:id', async (req: Request, res: Response) => {
    // const products = await fileDb.getProducts();
    // const id = req.params.id;
    //
    // const productById = products.find(p => p.id === id);
    //
    // if (productById) {
    //     return res.send(productById);
    // } else {
    //     return res.status(404).send("Not Found Product");
    // }
    const id = req.params.id;
    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    const product = result as Product[];

    if (product.length === 0) {
        return res.status(404).send("Not Found Product");
    }
    res.send(product[0]);
});

productsRouter.post('/', imagesUpload.single('image') , async (req: Request, res: Response, next) => {
    if (!req.body.title || !req.body.price || !req.body.category_id) {
        return res.status(400).send({error: "Please enter a title, price and category_id"});
    }

    const newProduct: ProductWithoutId = {
        title: req.body.title,
        description: req.body.description || null,
        price: Number(req.body.price),
        image: req.file ? 'images/' + req.file.filename : null,
    };

    // const savedProduct = await fileDb.addProduct(newProduct);
    try {
        const connection = await mysqlDb.getConnection();

        const [result] = await connection.query(
            'INSERT INTO products ( title, description, price, image) VALUES (?, ?, ?, ?, ?)',
            [ newProduct.title, newProduct.description, newProduct.price, newProduct.image]
        );

        const resultHeader = result as {insertId: number};
        const [product] = await connection.query(
            'SELECT * FROM products WHERE id = ?',
            [resultHeader.insertId]
        );
        const productNew = product as Product[];
        return res.send(productNew[0]);
    } catch (e: unknown) {
        const error = e as { errno: number };
        if (error.errno === 1452) {
            return res.status(400).send({error: "This category_id with do not exists"});
        }
        next(e);
    }
});

productsRouter.delete('/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    // const deleteProductSave = await fileDb.deleteProduct(id);
    // res.send(deleteProductSave);

    const connection = await mysqlDb.getConnection();
    await connection.query('DELETE FROM products WHERE id = ?', [id]);
    res.send({message: 'Product deleted successfully.'});
});

export default productsRouter;
