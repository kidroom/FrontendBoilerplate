export interface ApiListResponse<T> {
  items: T[]
  total: number
}

export interface ApiResult {
  isSuccess: boolean
  isFailure: boolean
  error: ApiError
}

export interface ApiError {
  code: string
  description: string
  message: string
}