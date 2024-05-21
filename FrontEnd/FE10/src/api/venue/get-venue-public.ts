import { axiosClient } from 'src/lib/axios'

async function venuePublicApi() {
  try {
    const response = await axiosClient.get(`VenuesAPI/GetPublicVenueDTOs/1/14`, {})
    return response.data
  } catch (error) {
    console.error('Error fetching venues:', error)
    throw error
  }
}

export { venuePublicApi }
