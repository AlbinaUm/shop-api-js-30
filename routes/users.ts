import express from "express";
import {Error} from "mongoose";
import User from "../models/User";
import bcrypt from "bcrypt";

const usersRouter = express.Router();

// регистрация - sing up
usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
           username: req.body.username,
           password: req.body.password,
        });

        user.generateAuthToken();

        await user.save();
        res.send(user);
    } catch (e) {
      if (e instanceof Error.ValidationError) {
          return res.status(400).send(e);
      }
      next(e);
    }
});

// логинка

usersRouter.post('/sessions', async (req, res) => {
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
});

usersRouter.get('/', async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        if (!token){
            return res.status(401).send({error: 'No token present'});
        }

        const user = await User.findOne({token});

        if (!user) {
            return res.status(401).send({error: 'Wrong token'});
        }

      const users = await User.find();
      res.send(users);
    } catch (e) {
        next(e);
    }
});

usersRouter.post('/secret', async (req , res) => {
    const token = req.get('Authorization');

    if (!token){
        return res.status(401).send({error: 'No token present'});
    }

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: 'Wrong token'});
    }

    res.send({
        message: 'You have access to this secret message',
        username: user.username
    });
});

export default usersRouter;

