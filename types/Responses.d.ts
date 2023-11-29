export type iResponse<T> = {
  error?: ResponseError,
  data?: T[]
}

export type ResponseError = {
  status: number
  statusText: string
  message: string
}

export type iResponseId<T> = {
  error?: ResponseError,
  data?: T
}
