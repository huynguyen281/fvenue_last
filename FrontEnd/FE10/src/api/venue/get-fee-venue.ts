import { axiosClient } from 'src/lib/axios'

async function feeVenueApi() {
  try {
    const response = await axiosClient.get(`VenuesAPI/GetNonPublicVenueDTOs/1/14`)
    return response.data
  } catch (error) {
    console.error('Error fetching venues:', error)
    throw error
  }
}

export { feeVenueApi }
