import { Router } from "express";
import userController from "../controller/user.controller.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import { loginSchema, registerSchema } from "../Schema/user.schema.js";

const userRouter = Router()

userRouter.post("/register",ValidationMiddleware(registerSchema),userController.register)
userRouter.get("/",userController.getAllUsers)
userRouter.post("/login",ValidationMiddleware(loginSchema),userController.login)

export default userRouter