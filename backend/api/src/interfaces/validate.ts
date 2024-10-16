import { ErrorApi } from "../errors/ErrorApi"

export interface IValidate {
    passed: boolean
    error?: ErrorApi
}