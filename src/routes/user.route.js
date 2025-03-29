import { Router } from "express";
import userController from "../controller/user.controller.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import { loginSchema, registerSchema } from "../Schema/user.schema.js";

const userRouter = Router()

userRouter.post("/register",ValidationMiddleware(registerSchema),userController.register)
userRouter.post("/login",ValidationMiddleware(loginSchema),userController.login)
userRouter.get("/",userController.getAllUsers)
userRouter.get("/:id",userController.getUserById)
userRouter.patch("/:id",userController.updateUser)
userRouter.delete("/:id",userController.deleteUser)

export default userRouter