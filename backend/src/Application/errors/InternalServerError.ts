
export default class InternalServerError extends Error {
    public status: number;

    constructor(message: string) {
        super(message);
        this.name = "InternalServerError";
        this.status = 500;
    }
}