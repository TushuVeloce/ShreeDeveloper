export class DomainException extends Error {
    constructor(public override message: string) {
        super(message);
    }
}