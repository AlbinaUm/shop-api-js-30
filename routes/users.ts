import express from "express";
import {Error} from "mongoose";
import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "../config";
import auth, {RequestWithUser} from "../middleware/auth";

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        user.generateAuthToken();

        await user.save();
        res.send({message: 'User registered successfully', user});
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }
        next(e);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});

        if (!user) {
            return res.status(400).send({error: 'Username not found'});
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            return res.status(400).send({error: 'Invalid password'});
        }

        user.generateAuthToken();
        await user.save();
        res.send({message: 'Logged in successfully', user});
    } catch (e) {
        next(e);
    }
});

usersRouter.get('/', auth, async (req, res, next) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (e) {
        next(e);
    }
});

export default usersRouter;

