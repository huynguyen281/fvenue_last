export interface User {
  Id?: string
  Email?: string
  FullName?: string
  RoleName?: 'MANAGER' | 'USER'
  PhoneNumber?: string
  Image?: string
  CreateDate?: string | null
  LastUpdateDate?: string | null
  Gender?: string
  FirstName?: string
  LastName?: string
  password?: string
  passwordAttempt?: number
  AccountId?: string
  salt?: string
}

export interface UserTicket {
  Id: number
  SerialNumber: string
  ItemId: number
  ExpiryDate: string
  Status: number
  TicketImage: string
  VenueId: number
  ItemName: string
}

export interface UserTicketResponse {
  Code: number
  Message: string
  Data: Array<UserTicket>
}

export enum ROLE {
  MANAGER = 'MANAGER',
  CUSTOMER = 'USER',
}
