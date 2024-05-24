import { IVenue } from './venue'

export interface Schedule {
  Id: number
  Name: string
  Description: string
  CreateDate: string
  LastUpdateDate: string
  TimeInDay: string
  ThumbnailUrl: string
  Type: number
  VenueCount: number
  NumberOfVenue: number
  MediumPrice: number
  Venues: Array<IVenue> | []
}

export interface ScheduleResponse {
  Code: number
  Message: string
  Data: Array<Schedule>
}

export interface ScheduleRequest {
  type: number | null
  districtId: number | null
  subCategoryIds: Array<number> | null
}

export interface ScheduleDetailResponse {
  Code: number
  Message: string
  Data: Array<Schedule>
}

export interface ScheduleSuggestionRequest {
  AccountId: number
  GeoLocation: string
  Type: number
  SubCategoryIds: Array<number>
  Price: number | null
}
