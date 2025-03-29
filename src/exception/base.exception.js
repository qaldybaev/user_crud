export class BaseExceptionError extends Error {
    constructor(message, status) {
        super(message);
        this.isException = true;
        this.status = status;
    }
}