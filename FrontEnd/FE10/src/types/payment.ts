import { PaymentType } from 'src/enums/payment-type'

export interface IPaymentQuery {
  UserId: string
  Amount: number
  PaymentType: PaymentType | number
  BankCode: string
  Content: string
  Locale: string
}

export interface IPaymentResult {
  Code: number
  Message: string
}
