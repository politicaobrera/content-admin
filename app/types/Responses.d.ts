type Data<T> = T | T[]

export type ResponseError = {
  status: number
  statusText: string
  message: string
}

export type iResponseMany<T> = {
  error?: ResponseError,
  data?: Data,
  total?: number,
}

export type iResponseOne<T> = {
  error?: ResponseError,
  data?: T
}
