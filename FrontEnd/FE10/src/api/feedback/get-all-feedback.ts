import { axiosClient } from 'src/lib/axios'
import { IReviewGetAll } from 'src/types/venue'

function getAllReviewByVenueId(Id: string) {
  return axiosClient
    .get(`/VenuesAPI/GetVenueFeedback?Id=${Id}`)
    .then((res) => {
      const data: IReviewGetAll[] = res.data
      return data
    })
    .catch((error: Error) => {
      throw error.message
    })
}
export default getAllReviewByVenueId
