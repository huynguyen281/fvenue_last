import { axiosClient } from 'src/lib/axios'
import { IReviewResponseInsert } from 'src/types/venue'

function postRatingComment(data: IReviewResponseInsert) {
  const formData = new FormData()
  formData.append('VenueId', data.VenueId as unknown as string)
  formData.append('AccountId', data.AccountId as unknown as string)
  formData.append('Content', data.Content?.toString() as string)
  formData.append('Rate', data.Rate as unknown as string)
  return axiosClient
    .post('/VenuesAPI/InsertVenueFeedback', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      if (res) {
        console.log(res)
      }
    })
    .catch((error: Error) => {
      throw error.message
    })
}
export { postRatingComment }
