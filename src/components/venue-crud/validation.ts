import { z } from 'zod'

export const VenueSchema = z.object({
  Id: z.string(),
  Name: z.string(),
  Image: z.any(),
  Description: z.string(),
  Street: z.string(),
  WardId: z.string(),
  Ward: z.string(),
  VenueSubCategories: z.string(),
  ScheduleDetails: z.string(),
  VenueLikes: z.string(),
  VenueFeedbacks: z.string(),
  Items: z.string(),
  VenueImages: z.string(),
  Location: z.string(),
  GeoLocation: z.string(),
  OpenTime: z.string(),
  CloseTime: z.string(),
  LowerPrice: z.string(),
  UpperPrice: z.string(),
})

export const UpdateVenueSchema = z.object({
  Name: z.string().max(50),
  LowerPrice: z.string(),
  UpperPrice: z.string(),
  Image: z.any(),
  Description: z.string(),
  Street: z.string(),
  WardId: z.string(),
  GeoLocation: z.string(),
  OpenTime: z.string(),
  CloseTime: z.string(),
})
