import { ErrorApi } from "../errors/ErrorApi";
import { IValidate } from "../interfaces/validate";
import * as userRepository from "../repositories/userRepository";

export async function validateEmail(email: string): Promise<IValidate> {
  const existingEmail = await userRepository.getUserByEmail(email);
  const regex: RegExp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  if (existingEmail.length > 0) {
    return {
      passed: false,
      error: new ErrorApi({
        message: "Email already registered.",
        status: 409,
      }),
    };
  }

  if (!email) {
    return {
      passed: false,
      error: new ErrorApi({
        message: "Email cannot be empty.",
        status: 400,
      }),
    };
  }

  if (typeof email !== "string") {
    return {
      passed: false,
      error: new ErrorApi({
        message: "Invalid data types in the email, it must be a string.",
        status: 400,
      }),
    };
  }

  if (!regex.test(email)) {
    return {
      passed: false,
      error: new ErrorApi({
        message: "Invalid email format. (example@example.com) ",
        status: 400,
      }),
    };
  }

  return {
    passed: true,
  };
}

export function validatePassword(password: string): IValidate {
  const errorMessages: string[] = [];

  if (!password) {
    return {
      passed: false,
      error: new ErrorApi({
        message: "Password cannot be empty.",
        status: 400,
      }),
    };
  }

  if (!/^.{8,}$/.test(password)) {
    errorMessages.push("8 characters");
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    errorMessages.push("1 uppercase letter");
  }
  if (!/(?=.*[a-z])/.test(password)) {
    errorMessages.push("1 lowercase letter");
  }
  if (!/(?=.*[0-9])/.test(password)) {
    errorMessages.push("1 number");
  }
  if (!/(?=.*[\W_])/.test(password)) {
    errorMessages.push("1 special character");
  }

  if (errorMessages.length > 0) {
    const errorMessage = `Password must have as least: ${errorMessages.join(", ") + "."}`

    return {
      passed: false,
      error: new ErrorApi({
        message: errorMessage,
        status: 400,
      }),
    };
  }

  if (typeof password !== "string") {
    return {
      passed: false,
      error: new ErrorApi({
        message: "Invalid data types in the password, it must be a string.",
        status: 400,
      }),
    };
  }

  return {
    passed: true,
  };
}

export async function validateName(username: string): Promise<IValidate> {
  const regex: RegExp = new RegExp(/^[A-Za-z\s]+$/);
  const cleanedName = username.trim();

  if (!username) {
    return {
      passed: false,
      error: new ErrorApi({
        message: "Username cannot be empty.",
        status: 400,
      }),
    };
  }

  if (typeof username !== "string") {
    return {
      passed: false,
      error: new ErrorApi({
        message: "Invalid data types in the username, it must be a string.",
        status: 400,
      }),
    };
  }

  if (!regex.test(cleanedName) || !(cleanedName.length >= 4)) {
    return {
      passed: false,
      error: new ErrorApi({
        message: "Invalid name format. (example) ",
        status: 400,
      }),
    };
  }

  return {
    passed: true,
  };
}
