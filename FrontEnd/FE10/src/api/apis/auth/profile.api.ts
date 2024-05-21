import { AxiosError } from 'axios'
import { authAxiosClient, axiosClient } from 'src/lib/axios'
import { User } from 'src/types/user'

async function profileApi(
  id: number,
  token: string,
  callback: (error: AxiosError | null, result: User | null) => void,
) {
  return await axiosClient
    .get(`AccountsAPI/GetAccountDTO/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token ?? localStorage.getItem('token')}`,
      },
    })
    .then((err) => {
      if (err.status === 200) {
        callback(null, err.data.Data)
      }
    })
    .catch((error) => {
      callback(error, null)
    })
}

async function changePasswordApi(
  oldPassword: string,
  newPassword: string,
  callback: (error: AxiosError | null, result: User | null) => void,
) {
  return await authAxiosClient
    .patch('/auth/change-password', {
      oldPassword,
      newPassword,
    })
    .then((err) => {
      if (err.status === 200) {
        callback(null, err.data.Data)
      }
    })
    .catch((error) => {
      callback(error, null)
    })
}

export { changePasswordApi, profileApi }
