import { ApiErrorCode } from "./apiErrorCode";

export class ApiErrorInfo {
    displayMessage!: boolean;
    displayNotification!: boolean;
    message!: string;
    type!: ApiErrorCode;
    title?: string;
    errors?: string[];
  }