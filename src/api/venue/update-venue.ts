import { authAxiosClient } from '../../lib/axios'
import FormData from 'form-data'

async function updateVenueApi(venueData: {
  Name: string
  Description: string
  Image: File
  Street: string
  WardId: string
  GeoLocation: string
  OpenTime: string
  CloseTime: string
  LowerPrice: string
  UpperPrice: string
}) {
  const formData = new FormData()
  formData.append('Name', venueData.Name)
  formData.append('LowerPrice', venueData.LowerPrice)
  formData.append('UpperPrice', venueData.UpperPrice)
  formData.append('Image', venueData.Image)
  formData.append('Description', venueData.Description)
  formData.append('Street', venueData.Street)
  formData.append('WardId', venueData.WardId)
  formData.append('GeoLocation', venueData.GeoLocation)
  formData.append('OpenTime', venueData.OpenTime)
  formData.append('CloseTime', venueData.CloseTime)
  console.log('Form data: ', formData)

  return await authAxiosClient
    .put(`VenuesAPI/UpdateVenue`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      if (response.status) {
        return response.data
      } else {
        // Handle other HTTP statuses as needed
        console.log(response)
        throw new Error('Request failed with status ' + response.status)
      }
    })
    .catch((error) => {
      // Handle network errors or other issues
      throw error
    })
}

export { updateVenueApi }
