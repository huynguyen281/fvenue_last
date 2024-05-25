import VenueFilterSidebar from 'src/components/venueSearch/venue-filter-sidebar'
import React from 'react'
import { SearchVenueParams } from 'src/api/search-venues/search-venues'
import { axiosClient } from 'src/lib/axios'
import { IVenue } from 'src/types/venue'
import { IResponse } from 'src/types'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from 'src/components/ui/card'
import { Link } from 'react-router-dom'
import Paginition from 'src/components/ui/pagination'

const initVenueState: SearchVenueParams = {
  PageIndex: 1,
  PageSize: 8,
  GeoLocation: null,
  Radius: null,
  LowerPrice: 0,
  UpperPrice: 1000000,
  SubCategoryIds: undefined,
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('vi', { style: 'currency', currency: 'VND' })
}

export default function VenueList() {
  const [searchRequest] = React.useState<SearchVenueParams>(initVenueState)
  const [venueData, setVenueData] = React.useState<Array<IVenue>>()
  const [totalPages, setTotalPages] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    fetchDataVenues()
  }, [])

  const fetchDataVenues = () => {
    setLoading(true)
    axiosClient
      .post<IResponse<IVenue[]>>('/VenuesAPI/SearchVenue', searchRequest, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data.Data) {
          setVenueData(response.data.Data.Result)
          setTotalPages(response.data.Data.TotalPages)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }
  return (
    <div className="flex w-full gap-6 pb-12">
      <section
        key="main.section.sidebar"
        className="sticky h-min w-[22%] rounded-md border border-gray-200 bg-white px-4 py-5 shadow-md"
      >
        <VenueFilterSidebar
          onFilterChange={(data) => {
            searchRequest.GeoLocation = data.GeoLocation == '' ? null : (data.GeoLocation as string)
            searchRequest.Radius = data.Radius == '' ? '5' : (data.Radius as string)
            searchRequest.LowerPrice = data.LowerPrice == '' ? 0 : (data.LowerPrice as number)
            searchRequest.UpperPrice = data.UpperPrice == '' ? 1000000 : (data.UpperPrice as number)
            searchRequest.SubCategoryIds = data.SubCategoryIds as string
            fetchDataVenues()
          }}
        />
      </section>
      {loading ? (
        <section key="main.section.loading" className="flex w-[78%] animate-pulse rounded-md bg-gray-100">
          <div className="grid w-full max-w-full grid-cols-4 gap-4 overflow-auto">
            <div className="h-[310px] w-full rounded-md bg-gray-200"></div>
            <div className="h-[310px] w-full rounded-md bg-gray-200"></div>
            <div className="h-[310px] w-full rounded-md bg-gray-200"></div>
            <div className="h-[310px] w-full rounded-md bg-gray-200"></div>
            <div className="h-[310px] w-full rounded-md bg-gray-200"></div>
            <div className="h-[310px] w-full rounded-md bg-gray-200"></div>
            <div className="h-[310px] w-full rounded-md bg-gray-200"></div>
            <div className="h-[310px] w-full rounded-md bg-gray-200"></div>
          </div>
        </section>
      ) : (
        <section key="main.section.Venues" className="flex w-[78%] flex-col gap-4">
          <div className="grid w-full max-w-full grid-cols-4 gap-4 overflow-auto">
            {venueData?.map((venue, index) => (
              <Link to={`/venue/${venue.Id}`} key={venue.Id} style={{ textDecoration: 'none' }}>
                <Card className="h-full w-full">
                  <CardTitle className="aspect-[4/3] overflow-hidden rounded-bl-none rounded-br-none rounded-tl-md rounded-tr-md border-transparent p-0 shadow-md transition-all duration-300 group-hover:shadow-xl">
                    <img
                      src={venue.Image}
                      alt={venue.Name}
                      className="aspect-[4/3] w-full object-cover transition-all duration-300"
                    />
                  </CardTitle>
                  <CardContent className="p-0 lg:p-2 lg:text-lg">
                    <strong
                      style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxHeight: '2.2em',
                      }}
                    >
                      {venue.Name}
                    </strong>
                    <CardDescription
                      className="text-blue-500"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxHeight: '1.2em',
                      }}
                    >
                      {venue.Street ? venue.Street : 'NA'}
                    </CardDescription>
                    <CardDescription
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxHeight: '1.2em',
                      }}
                    >
                      {venue.Location}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="bottom-1 bg-gray-100 p-2 font-semibold">
                    {!(venue.LowerPrice == 0 && venue.UpperPrice == 0) ? (
                      <span className="text-red-700">
                        {formatCurrency(venue.LowerPrice)} - {formatCurrency(venue.UpperPrice)}
                      </span>
                    ) : (
                      <span className="text-green-700">Miễn phí</span>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          <div className="col-span-full mx-auto w-fit">
            <Paginition
              currentPage={searchRequest.PageIndex || 1}
              totalPage={totalPages}
              onPageChange={(PageIndex) => {
                searchRequest.PageIndex = PageIndex
                fetchDataVenues()
              }}
              onPreviousPage={() => {
                searchRequest.PageIndex = searchRequest.PageIndex - 1
                fetchDataVenues()
              }}
              onNextPage={() => {
                searchRequest.PageIndex = searchRequest.PageIndex + 1
                fetchDataVenues()
              }}
            />
          </div>
        </section>
      )}
    </div>
  )
}
