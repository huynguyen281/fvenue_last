import { axiosClient } from 'src/lib/axios'

async function getUserApi(userId: string) {
  try {
    const token = `Bearer ${localStorage.getItem('token')}`
    const response = await axiosClient.get(`AccountsAPI/GetAccountDTO/${userId}`, {
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

export { getUserApi }
