import mongoose, {HydratedDocument, Model, Document} from "mongoose";
import bcrypt from "bcrypt";
import {UserFields} from "../types";
import {randomUUID} from "crypto";

const SALT_WORK_FACTOR = 10;

interface UserMethods {
    checkPassword: (password: string) => Promise<boolean>;
    generateAuthToken: () => void;
}

type UserModel = Model<UserFields, {}, UserMethods>;

const UserSchema = new mongoose.Schema<
    HydratedDocument<UserFields>,
    UserModel,
    UserMethods,
    {}>({
   username: {
       type: String,
       required: true,
       unique: true,
   },
    password: {
       type: String,
       required: true,
    },
    token: {
       type: String,
        required: true,
    }
});

UserSchema.path('username').validate({
    validator: async function (this: Document, value: string) {
        if (!this.isModified('username')) return true;

        const user = await User.findOne({ username: value });
        return !user;
    },
    message: 'Username already exists. Please choose another one.'
});

UserSchema.methods.checkPassword = function (password: string) {
    return  bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAuthToken = function () {
    this.token = randomUUID();
};

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
});

UserSchema.set('toJSON', {
   transform: (_doc, ret, _options) => {
       const { password, ...rest } = ret;
       return rest;
   }
});

const User = mongoose.model('User', UserSchema);
export default User;