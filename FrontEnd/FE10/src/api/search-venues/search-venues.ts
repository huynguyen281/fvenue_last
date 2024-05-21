import { axiosClient } from 'src/lib/axios'
import { IDefaultQuery, IResponse, IVenue } from 'src/types'

export type SearchVenueParams = {
  GeoLocation?: string
  Radius?: string
  LowerPrice?: string
  UpperPrice?: string
  SubCategoryIds?: string
} & Partial<IDefaultQuery>
export async function searchVenue(params: SearchVenueParams) {
  const data = {
    Geolocation: params.GeoLocation,
    Radius: parseFloat(params.Radius as string),
    LowerPrice: parseFloat(params.LowerPrice as string),
    UpperPrice: parseFloat(params.UpperPrice as string),
    // SubCategoryIds: params.SubCategoryIds?.map((id) => id.toString()),
    SubCategoryIds: parseFloat(params.SubCategoryIds as string),
    ...params,
  }

  return axiosClient.post('/VenuesAPI/SearchVenue', data).then((res) => {
    const data: IResponse<IVenue[]> = res.data
    const dataAll: IVenue[] = data.Data?.Result as IVenue[]

    return data
  })
}
