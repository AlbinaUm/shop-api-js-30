import express from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import Task from "../models/Task";
import {Error} from "mongoose";

const tasksRouter = express.Router();

tasksRouter.get('/', auth, async (_req, res, next) => {
    try {
        const tasks = await Task.find();
        res.send(tasks);
    } catch (e) {
        next(e);
    }
});

tasksRouter.post('/', auth, async (req, res, next) => {
    try {
        const {user} = req as RequestWithUser;

        const newTask = new Task({
           user,
            title: req.body.title,
            description: req.body.description || null,
            status: 'new'
        });

        await newTask.save();
        res.send(newTask);
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }
        next(e);
    }
});

tasksRouter.delete('/:id', auth, async (req, res, next) => {
    try {
        const {user} = req as RequestWithUser;

        if (!req.params.id) return res.status(400).send({error: 'Task id is required in params'});

        const findTask = await Task.findById(req.params.id);
        if (!findTask) return res.status(404).send({error: 'Task not found'});

        if (!findTask.user.equals(user._id)) {
            return res.status(403).send({error: 'You are not allowed to delete this task'});
        }

        await findTask.deleteOne();
        res.send({message: 'Task deleted successfully'});
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }
        next(e);
    }
});

tasksRouter.patch('/:id', auth, async (req, res, next) => {
    try {
        const {user} = req as RequestWithUser;

        if (!req.params.id) return res.status(400).send({error: 'Task id is required in params'});

        const findTask = await Task.findById(req.params.id);
        if (!findTask) return res.status(404).send({error: 'Task not found'});

        if (!findTask.user.equals(user._id)) {
            return res.status(403).send({error: 'You are not allowed to delete this task'});
        }

        const updates = req.body;
        delete updates.user;

        const updateTask = await Task.findOneAndUpdate(
            {_id: req.params.id, user: user._id},
            { $set: updates },
            { new: true, runValidators: true}
        );

        res.send(updateTask);
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }
        next(e);
    }
});

export default tasksRouter;