export class ApiErrorResponse {
    success: boolean;
    statusCode: number;
    message: string;
    errorCode?: number;
    errors?: string[];

    constructor(success: boolean, statusCode: number, message: string, errorCode?: number, errors?: string[]) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.errorCode = errorCode;
        this.errors = errors;
    }
}