import {RequestWithUser} from "./auth";
import {NextFunction, Request, Response} from "express";


const permit = (...roles: string[]) => {
    return (expressReq: Request, res: Response, next: NextFunction)=> {
        // POST /products + auth.ts (req.user) + permit.ts (req.user)
        const {user} = expressReq as RequestWithUser; // auth.ts -> req.user => role admin user

        if (!user) {
            return res.status(401).send({message: 'Please authenticate'});
        }

        if (!roles.includes(user.role)) {
           return res.status(403).send({message: 'You do not have permission to perform this action'});
        }

        next();
    }
};

export default permit;
