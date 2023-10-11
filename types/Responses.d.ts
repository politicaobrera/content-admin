export type iResponse<T> = {
  error?: ResponseError,
  data?: T[]
}

export type ResponseError = {
  status: number
  statusText: string
  message: string
}
