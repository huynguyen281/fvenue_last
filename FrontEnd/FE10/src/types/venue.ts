type TimeOnly = string

export interface IVenue {
  Id: string
  Name: string
  Image: string
  Street: string
  Location: string
  GeoLocation: string
  OpenTime: TimeOnly
  CloseTime: TimeOnly
  LowerPrice: number
  UpperPrice: number
  Description: string
  Reviews?: IReviewResponseInsert[]
}

export interface IVenueManager {
  userId: string
  Id: string
  Name: string
  Image: string
  Description: string
  Street: string
  WardId: string
  Ward: string
  VenueSubCategories: string
  ScheduleDetails: string
  VenueLikes: string
  VenueFeedbacks: string
  Items: string
  VenueImages: string
  Location: string
  GeoLocation: string
  OpenTime: TimeOnly
  CloseTime: TimeOnly
  LowerPrice: string
  UpperPrice: string
}

export interface IReviewResponseInsert {
  Id?: string
  AccountId?: string
  Account?: string
  VenueId?: string
  Venue?: string
  Rate?: number
  Content?: string
  CreateDate?: string
  LastUpdateDate?: string
}
export interface IReviewGetAll {
  Id?: string
  AccountId: string
  Account: string
  VenueId?: number
  Venue?: string
  Rate: number
  Content?: string
  CreateDate?: string
  LastUpdateDate?: string
}
