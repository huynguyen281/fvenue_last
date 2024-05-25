export type SearchVenueParams = {
  GeoLocation: string | null
  Radius: string | null
  LowerPrice: number | null
  UpperPrice: number | null
  SubCategoryIds?: string
  PageIndex: number
  PageSize: number
}
