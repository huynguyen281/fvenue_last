import VenueFilterSidebar from 'src/components/venueSearch/venue-filter-sidebar'
import VenueGridLoading from 'src/components/venueSearch/venue-grid-loading'
import Breadcrumb from 'src/components/breadcrumb/breadcrumb'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from 'src/components/ui/card'
import MetaData from 'src/components/metadata'
import Paginition from 'src/components/ui/pagination'
import React from 'react'
import { Link } from 'react-router-dom'
import useGetManyVenues from 'src/pages/venue/useGetManyVenues'
import { IBreadcrumb } from 'src/components/breadcrumb'
import { SearchVenueParams } from 'src/api/search-venues/search-venues'

const initVenueState: SearchVenueParams = {
  PageIndex: 1,
  PageSize: 8,
  GeoLocation: undefined,
  Radius: undefined,
  LowerPrice: '1',
  UpperPrice: '1000',
  SubCategoryIds: undefined,
}

function Venues() {
  const breadcrumb = React.useMemo<IBreadcrumb[]>(() => {
    return [
      {
        label: 'Home',
        key: 'home',
        href: '/',
        icon: 'smartHome',
      },
      {
        key: 'venues',
        label: 'Venues',
        href: '/venues',
      },
    ]
  }, [])

  const [venueState, setvenueState] = React.useState<SearchVenueParams>(initVenueState)
  const { data, isLoading, isError } = useGetManyVenues(venueState)

  React.useEffect(() => {
    console.log('Venue state:', venueState)
    console.log('Data:', data)
  }, [venueState, data])

  const renderVenues = React.useMemo(() => {
    if (isLoading) return <VenueGridLoading PageSize={venueState.PageSize!} />
    if (!data) return null
    return data.Data?.Result.map((venue) => {
      return (
        <Link to={`/venue/${venue.Id}`} key={venue.Id} style={{ textDecoration: 'none' }}>
          <Card className="h-full lg:w-[14.5rem]">
            <CardTitle className="aspect-[1] overflow-hidden rounded-bl-none rounded-br-none rounded-tl-md rounded-tr-md border-transparent p-0 shadow-md transition-all duration-300 group-hover:shadow-xl">
              <img
                src={venue.Image}
                alt={venue.Name}
                className="aspect-[1] object-cover transition-all duration-300"
                style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
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
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxHeight: '1.2em' }}
              >
                {venue.Street ? venue.Street : 'NA'}
              </CardDescription>
              <CardDescription
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxHeight: '1.2em' }}
              >
                {venue.Location}
              </CardDescription>
            </CardContent>
            <CardFooter className="bottom-1 bg-gray-100 p-2 text-red-700">
              Giá khoảng: {venue.LowerPrice},000VNĐ - {venue.UpperPrice},000VNĐ
            </CardFooter>
          </Card>
        </Link>
      )
    })
  }, [venueState.PageSize, data, isLoading])
  const totalPage = React.useMemo(() => {
    return data?.Data?.TotalPages || 1
  }, [data?.Data?.TotalPages])

  if (isError) return <div>Something went wrong</div>
  return (
    <main className="container mx-auto grid min-h-screen w-full place-items-center">
      <MetaData title="Venues" />
      <Breadcrumb items={breadcrumb} className="my-8 w-full" />
      <div className="flex w-full gap-2">
        <section key="main.section.sidebar" className="sticky top-20 h-min w-1/4 rounded-md bg-accent px-4 py-5">
          <VenueFilterSidebar
            onFilterChange={(data) => {
              setvenueState((prev) => ({
                ...prev,
                ...data,
              }))
            }}
          />
        </section>
        <section key="main.section.Venues" className="grid flex-1 grid-cols-4 gap-5">
          {renderVenues}
          <div className="col-span-full mx-auto w-fit">
            <Paginition
              currentPage={venueState.PageIndex || 1}
              totalPage={totalPage}
              onPageChange={(PageIndex) => {
                setvenueState((prev) => ({
                  ...prev,
                  PageIndex,
                }))
              }}
              onPreviousPage={() => {
                setvenueState((prev) => ({
                  ...prev,
                  PageIndex: prev.PageIndex! - 1,
                }))
              }}
              onNextPage={() => {
                setvenueState((prev) => ({
                  ...prev,
                  PageIndex: prev.PageIndex! + 1,
                }))
              }}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

export default Venues
