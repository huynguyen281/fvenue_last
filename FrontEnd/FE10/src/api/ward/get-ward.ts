import { axiosClient } from 'src/lib/axios'
import { Ward } from 'src/types/ward'

export function getWards(): Promise<Ward[]> {
  return axiosClient.get('LocationAPI/GetWards', {}).then((res) => res.data)
}
