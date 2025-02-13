type Data<T> = T | T[]

export type ResponseError = {
  status: number
  statusText: string
  message: string
}

export type PaginationMeta = {
  total: number
  page: number
  perPage: number
  totalPages: number
}

export type iResponseMany<T> = {
  error?: ResponseError,
  data?: Data,
  meta?: PaginationMeta
}

export type iResponseOne<T> = {
  error?: ResponseError,
  data?: T
}
