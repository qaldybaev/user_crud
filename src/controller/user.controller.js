import { compare, hash } from "bcrypt";
import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import {
    ACCESS_TOKEN_EXPIRE_TIME,
    ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_EXPIRE_TIME,
    REFRESH_TOKEN_SECRET_KEY
} from "../config/jwt.config.js";
import { BaseExceptionError } from "../exception/base.exception.js";

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const foundedUser = await userModel.findOne({ email });
        if (foundedUser) {
            throw new BaseExceptionError("Email already exists", 409);
        }
        const passwordHash = await hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: passwordHash
        });

    
        const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
            algorithm: "HS256"
        });

        const refreshToken = jwt.sign({ id: user.id, role: user.role }, REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
            algorithm: "HS256"
        });

        res.status(201).json({
            message: "Success ✅",
            tokens: {
                accessToken,
                refreshToken
            },
            data: user
        });

    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await userModel.findOne({ email });

        if (!user) {
            throw new BaseExceptionError("User not found", 404);
        }
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            throw new BaseExceptionError("Invalid password", 401);
        }

       
        const accessToken = jwt.sign({ id: user.id, role: user.role }, ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
            algorithm: "HS256"
        });

        const refreshToken = jwt.sign({ id: user.id, role: user.role }, REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
            algorithm: "HS256"
        });

        res.json({
            message: "Success ✅",
            tokens: {
                accessToken,
                refreshToken
            },
            data: user
        });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find();

        res.json({
            message: "Success ✅",
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

export default { register, getAllUsers, login };
