import { IVenue } from './venue'

export interface Schedule {
  Id: number
  AccountId: number
  AccountName: string
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
  VenueIds: Array<string> | []
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

export interface ScheduleSuggestionResponse {
  Code: number
  Message: string
  Data: Schedule
}
