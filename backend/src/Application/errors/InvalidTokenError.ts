
export default class InvalidTokenError extends Error {
    public status: number;

    constructor(message: string) {
        super(message);
        this.name = "InvalidTokenError"
        this.status = 404;
    }

}