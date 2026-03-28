import { Request, Response, NextFunction, RequestHandler } from "express";
import {HydratedDocument} from "mongoose";
import {UserFields} from "../types";
import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "../config";

export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>;
}

const auth: RequestHandler = async (expressReq: Request, res: Response, next: NextFunction) => {
    try {
        const req = expressReq as RequestWithUser;

        const token = req.get('Authorization')?.replace("Bearer ", '');
        if (!token) {
            return res.status(401).send({error: 'No token present'});
        }

        const decoded = jwt.verify(token, config.jwtSecret) as {_id: string};

        const user = await User.findOne({_id: decoded._id, token});

        if (!user) {
            return res.status(401).send({error: 'Invalid token'});
        }

        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        res.status(401).send({error: "Please authenticate"});
    }
};

export default auth;