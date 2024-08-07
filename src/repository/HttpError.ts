import { AxiosError } from 'axios'

type ValidationType = { [key: string]: string }

export default class HttpError {
  public readonly statusCode: number
  public readonly code: string
  public readonly message: string | null
  public readonly validation: ValidationType

  constructor(e: AxiosError<any, unknown>) {
    this.statusCode = e.response?.status ?? 500
    this.code = e.response?.status.toString() ?? '500'

    if (e.response?.data.validation) {
      this.validation = e.response.data.validation
      this.message = Object.values(this.validation)[0]
    } else {
      this.validation = {}
      this.message = e.response?.data.message ?? '네트워크 문제가 발생했습니다. :<'
    }
  }

  public isUnauthorized() {
    return this.code === '401'
  }

  public isAccessDenied() {
    return this.code === '403'
  }

  public isBadRequest() {
    return this.code === '400'
  }

  public hasValidation() {
    return Object.keys(this.validation).length > 0
  }

  public getValidation(): ValidationType {
    return this.validation
  }
}
