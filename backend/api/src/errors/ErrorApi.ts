interface IError {
  message: string;
  status: number;
}

export class ErrorApi extends Error {
  status: number;

  constructor({ message, status }: IError) {
    super(message);
    this.status = status;
    this.name = "ErrorApi";
  }
}
