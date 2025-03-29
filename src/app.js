import express from "express"
import router from "./routes/index.js"
import { BaseExceptionError } from "./exception/base.exception.js"
import { errorHandlerMiddleware } from "./middleware/error.handler.middleware.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", router)

app.all("/*", (req, res) => {
    throw new BaseExceptionError(`Given ${req.url} with method: ${req.method} not found`, 404)
})

app.use(errorHandlerMiddleware)

export default app