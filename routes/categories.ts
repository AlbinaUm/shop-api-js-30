import express from "express";
import Category from "../models/Category";
import {Error} from "mongoose";

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res, next) => {
    try{
        const categories = await Category.find();
        res.send(categories);
    } catch (e) {
        next(e);
    }
});

categoriesRouter.post('/', async (req, res, next) => {
   const categoryData = {
       title: req.body.title,
       description: req.body.description,
   };

   try {
        const category = new Category(categoryData);
        await category.save();
        res.send(category);
   } catch (error) {
       if (error instanceof Error.ValidationError) {
          return res.status(400).send(error);
       }
       next(error);
   }
});

export default categoriesRouter;