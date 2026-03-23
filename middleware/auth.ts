import { Request, Response, NextFunction, RequestHandler } from "express";
import {HydratedDocument} from "mongoose";
import {UserFields} from "../types";
import User from "../models/User";

export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>;
}

const auth: RequestHandler = async (expressReq: Request, res: Response, next: NextFunction) => {
    const req = expressReq as RequestWithUser;

    const token = req.get('Authorization');

    if (!token) {
        return res.status(401).send({error: 'No token present'});
    }

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: 'No such user'});
    }

    req.user = user;
    next();
};

export default auth;