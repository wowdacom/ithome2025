export class ValidationError extends Error {
    constructor(public code: string, message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}
