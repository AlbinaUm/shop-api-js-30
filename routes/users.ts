import express from "express";
import {Error} from "mongoose";
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";
import {OAuth2Client} from "google-auth-library";
import config from "../config";
import jwt from "jsonwebtoken";


const usersRouter = express.Router();

const createAccessToken = (userId: string) => {
  return jwt.sign({_id: userId}, config.jwtSecret, {expiresIn: '1m'});
};

const createRefreshToken = (userId: string) => {
    return jwt.sign({_id: userId}, config.refreshSecret, {expiresIn: '2m'});
};


// register
usersRouter.post('/', async (req, res, next) => {
    try {
        if (!req.body.confirmPassword) {
            return res.status(400).send({error: 'Confirm password is required'});
        }

        const user = new User({
            username: req.body.username,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        });

        user.token = createRefreshToken(user._id.toString());

        const saveUser = await user.save();

        res.cookie('refreshToken', saveUser.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Защита от CSRF (Cross site request forgery),
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        });

        res.cookie('accessToken', createAccessToken(saveUser._id.toString()), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Защита от CSRF (Cross site request forgery),
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        });

        res.send({message: 'User registered successfully', user});
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            return res.status(400).send(e);
        }
        next(e);
    }
});


// google Login
usersRouter.post('/google', async (req, res, next) => {
   try {
       if (!req.body.credential) return res.status(400).send({error: 'Credential is required'});
       const client = new OAuth2Client(config.clientID);


       const ticket = await client.verifyIdToken({
            idToken:  req.body.credential,
           audience: config.clientID,
       });

       const payload = ticket.getPayload();

       if (!payload) return res.status(400).send({error: 'Google login error'});

       const email = payload.email;
       const id = payload.sub; // googleID
       const displayName = payload.name;

       if (!email) return res.status(400).send({error: 'Not enough information from Google'})

       let user = await User.findOne({googleID: id});

       if (!user) {
           const generatePassword = crypto.randomUUID();
           user = new User({
               username: email,
               password: generatePassword,
               confirmPassword: generatePassword,
               googleID: id,
               displayName,
           })
       }

       user.generateAuthToken();
       const userSave = await user.save();
       res.cookie('token', userSave.token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'strict',
           maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
       });

       res.send({message: 'Logged in with Google successfully', user});
   } catch (e) {
       next(e);
   }
});


// login
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

        user.token = createRefreshToken(user._id.toString()); // refreshToken

        const userSave = await user.save();
        res.cookie('refreshToken', userSave.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        });


        res.cookie('accessToken', createAccessToken(userSave._id.toString()), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Защита от CSRF (Cross site request forgery),
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        });

        res.send({message: 'Logged in successfully', user});
    } catch (e) {
        next(e);
    }
});

// logout
usersRouter.delete('/sessions', async (req, res, next) => {
   try {
       const refreshToken = req.cookies.refreshToken;

       if (refreshToken) {
           const user = await User.findOne({token: refreshToken});

           if (user) {
               user.token = '';
               await user.save();
           }
       }
   } catch (e) {
       next(e);
   }

    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'strict',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'strict',
    });
    res.send({message: 'Logged out successfully'});
});

// refresh token

usersRouter.post('/token', async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).send({error: 'No refresh token present'});
        }

        const decoded = jwt.verify(refreshToken, config.refreshSecret) as {_id: string};

        const user = await User.findOne({_id: decoded._id, token: refreshToken});

        if (!user) {
            return res.status(401).send({error: 'Invalid refresh token'});
        }

        const accessToken = createAccessToken(user._id.toString());

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        });
        res.send({message: 'Access token refreshed successfully'});
    } catch (e) {
        res.status(401).send({error: 'Invalid or expired refresh token'})
    }
})



export default usersRouter;

