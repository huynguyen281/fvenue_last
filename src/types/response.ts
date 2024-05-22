export type IResponse<T> = {
  Data?: {
    PageIndex: number
    PageSize: number
    TotalPages: number
    Result: T
  }
  Message?: string
  Code?: number
}

export type IErrorResponse = {
  message: string
}
