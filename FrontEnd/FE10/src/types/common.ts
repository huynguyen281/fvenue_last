export interface SelectDataBox {
  label: string
  data: Array<SelectData>
  disabled: boolean
  onSelection: (value: string | number) => void
}

export interface SelectData {
  name: string
  value: string | number
}

export interface DataResponse<T> {
  Code: number
  Message: string
  Data: T
}
export interface DataPaging<T> {
  PageIndex: number
  PageSize: number
  TotalPages: number
  Result: Array<T>
}
