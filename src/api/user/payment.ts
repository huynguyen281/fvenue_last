import { axiosClient } from 'src/lib/axios'
import { IPaymentQuery } from 'src/types/payment'

const token = `Bearer ${localStorage.getItem('token')}`

async function payment(paymentInfo: IPaymentQuery) {
  try {
    const response = await axiosClient.post(`PaymentsAPI/PaymentTransaction`, paymentInfo, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching venues:', error)
    throw error
  }
}

async function paymentResult(querystring: string) {
  try {
    const response = await axiosClient.get(`PaymentsAPI/PaymentTransactionHandler?${querystring}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching venues:', error)
    throw error
  }
}

export { payment, paymentResult }
