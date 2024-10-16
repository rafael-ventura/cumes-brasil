
export default class BadRequestError extends Error {
    public status: number;

    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
        this.status = 404;
    }
}