import { axiosClient } from 'src/lib/axios'
import { IResponse } from 'src/types'
import { IVenue } from 'src/types/venue'

export type IGetVenueResponse = IResponse<IVenue>
const token = localStorage.getItem('token')
async function GetVenueOfManager(userId: string) {
  try {
    const response = await axiosClient.get(`AccountsAPI/GetVenueOfManager/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching venues:', error)
    throw error
  }
}

export { GetVenueOfManager }
