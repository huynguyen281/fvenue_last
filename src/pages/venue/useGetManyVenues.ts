import { IVenue, IResponse } from 'src/types'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { SearchVenueParams, searchVenue } from 'src/api/search-venues/search-venues'

export default function useGetManyVenues(params: SearchVenueParams): UseQueryResult<IResponse<IVenue[]>, unknown> {
  console.log('Params:', params)
  return useQuery(['venues', params], () => searchVenue(params))
}
