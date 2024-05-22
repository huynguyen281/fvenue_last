export interface TicketCategory {
  Id: number
  ItemTickets: Array<string>
  Name: string
  Price: number
  Status: boolean
  VenueId: number
  VenueName: string
}

export interface TicketCategoryResponse {
  Code: number
  Data: Array<TicketCategory>
  Message: string
}
