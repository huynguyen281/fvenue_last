import { axiosClient } from 'src/lib/axios'

async function getVenueId(Id?: string) {
  try {
    const response = await axiosClient.get(`VenuesAPI/GetVenueDTO/${Id}`, {})
    return response.data
  } catch (error) {
    console.error('Error fetching venues:', error)
    throw error
  }
}

export { getVenueId }
