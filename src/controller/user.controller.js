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
import mongoose from "mongoose";

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const passwordHash = await hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: passwordHash
        });

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: ACCESS_TOKEN_EXPIRE_TIME }
        );
        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: REFRESH_TOKEN_EXPIRE_TIME }
        );

        res.status(201).json({
            status: "Success✅",
            message: "User ro‘yxatdan o‘tkazildi",
            tokens: { accessToken, refreshToken },
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

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: ACCESS_TOKEN_EXPIRE_TIME }
        );
        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: REFRESH_TOKEN_EXPIRE_TIME }
        );

        res.json({
            status: "Success✅",
            message: "Tizimga muvaffaqiyatli kirildi",
            tokens: { accessToken, refreshToken },
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
            status: "Success✅",
            message: "Barcha foydalanuvchilar",
            count: users.length,
            data: users
        });

    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new BaseExceptionError("Invalid ID", 400);
        }

        const user = await userModel.findById(id);
        if (!user) {
            throw new BaseExceptionError("User not found", 404);
        }

        res.json({
            status: "Success✅",
            message: "Id boyicha user topildi",
            data: user
        });

    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new BaseExceptionError("Invalid ID", 400);
        }

        const { name, email, password } = req.body;
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (password) updateFields.password = await hash(password, 10);

        const user = await userModel.findByIdAndUpdate(id, updateFields, { new: true });
        if (!user) {
            throw new BaseExceptionError("User not found", 404);
        }

        res.json({
            status: "Success✅",
            message: "User yangilandi",
            data: user
        });

    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            throw new BaseExceptionError("Invalid ID", 400);
        }

        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            throw new BaseExceptionError("User not found", 404);
        }

        res.status(204).send()

    } catch (error) {
        next(error);
    }
};

export default { register, login, getAllUsers, getUserById, updateUser, deleteUser };
