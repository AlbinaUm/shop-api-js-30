import express from "express";
import {Request, Response} from "express";
import mysqlDb from "../mysqlDb";
import {Category} from "../types";

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (_req: Request, res: Response) => {
    const connection = await mysqlDb.getConnection();
    const [result] = await connection.query('SELECT * FROM categories');
    const categories = result as Category[];
    res.send(categories);
});

export default categoriesRouter;
