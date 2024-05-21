import { AxiosError } from 'axios'
import { LoginSchema } from 'src/pages/(auth)/login/validation'
import { axiosClient } from 'src/lib/axios'
import { z } from 'zod'

interface Login {
  Code: number
  Message: string
  Data: {
    Id: number
    Email: string
    RoleName: string
    FirstName: string
    LastName: string
    Token: string
  }
}

type ILoginSchema = z.infer<typeof LoginSchema>
async function loginApi(
  { Email: Email, Password }: ILoginSchema,
  callback: (error: AxiosError | null, result: Login | null) => void,
) {
  return await axiosClient
    .post<Login>(
      'AccountsAPI/Login',
      {
        Email: Email,
        Password: Password,
      },
      {
        withCredentials: false,
      },
    )
    .then((err) => {
      if (err.status === 200) {
        callback(null, err.data)
      }
    })
    .catch((error) => {
      callback(error, null)
    })
}

export { loginApi }
