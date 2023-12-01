export class ApiResponse<T> {
  success: boolean;
  payload: T;

  constructor(success: boolean, payload: T) {
    this.success = success;
    this.payload = payload;
  }
}