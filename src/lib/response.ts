/* eslint-disable camelcase */
import { Response } from 'restify';
export class Responses {
  private code: number;
  private message: string;
  private res: Response;
  private error: any;
  private data: any;
  constructor(code, message, res, error, data) {
    this.code = code;
    this.message = message;
    this.res = res;
    this.error = error;
    this.data = data;
  }

  res_message() {
    return this.res.send(this.code, {
      error: this.error,
      code: this.code,
      message: this.message,
      data: this.data,
    });
  }
}
