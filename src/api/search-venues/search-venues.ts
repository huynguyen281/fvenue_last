export type SearchVenueParams = {
  GeoLocation: string | null
  Radius: string | null
  LowerPrice: number | null
  UpperPrice: number | null
  SubCategoryIds?: string
  PageIndex: number
  PageSize: number
}
// export async function searchVenue(params: SearchVenueParams) {
//   const data = {
//     Geolocation: params.GeoLocation,
//     Radius: parseFloat(params.Radius as string),
//     LowerPrice: parseFloat((params.LowerPrice == '' ? '0' : params.LowerPrice) as string),
//     UpperPrice: parseFloat((params.UpperPrice == '1000000000' ? '0' : params.UpperPrice) as string),
//     // SubCategoryIds: params.SubCategoryIds?.map((id) => id.toString()),
//     SubCategoryIds: parseFloat(params.SubCategoryIds as string),
//     ...params,
//   }

//   return axiosClient.post('/VenuesAPI/SearchVenue', data).then((res) => {
//     const data: IResponse<IVenue[]> = res.data
//     const dataAll: IVenue[] = data.Data?.Result as IVenue[]

//     return data
//   })
// }
