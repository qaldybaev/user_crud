export const errorHandlerMiddleware = (err, _, res, __) => {
    if (err.isException) {
        return res.status(err.status).send({
            message: err.message
        })
    }
    res.status(500).send({
        message: "Internal Server Error",
    });
}