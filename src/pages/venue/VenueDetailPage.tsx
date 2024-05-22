// export default VenueDetailPage
import React, { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { Rating } from '@smastrom/react-rating'
import { IReviewResponseInsert, IVenue } from 'src/types/venue'
import { useParams } from 'react-router-dom'
import { getVenueId } from 'src/api/venue/getById'
import Header from 'src/components/header'
import Footer from 'src/components/footer'
import { AttachMoney, FmdGood, AccessTime, AccessAlarms } from '@mui/icons-material'
import Popupmenu from 'src/components/Itemmenu/pop-up-menu'

// Giả mạo dữ liệu đánh giá
const fakeReviews: IReviewResponseInsert[] = [
  {
    Id: '1',
    AccountId: '1',
    Account: 'John Doe',
    Rate: 4,
    LastUpdateDate: '2024-02-27T08:00:00Z',
    Content: 'A great place to visit!',
    Avatar: 'https://tse2.mm.bing.net/th?id=OIP.37Skua12Yb3icbJxRLAgAgHaHY&pid=Api&P=0&h=220',
  },
  {
    Id: '1',
    AccountId: '1',
    Account: 'John Doe',
    Rate: 4,
    LastUpdateDate: '2024-02-27T08:00:00Z',
    Content: 'A great place to visit!',
    Avatar: 'https://tse2.mm.bing.net/th?id=OIP.37Skua12Yb3icbJxRLAgAgHaHY&pid=Api&P=0&h=220',
  },
  {
    Id: '1',
    AccountId: '1',
    Account: 'John Doe',
    Rate: 4,
    LastUpdateDate: '2024-02-27T08:00:00Z',
    Content: 'A great place to visit!',
    Avatar: 'https://tse2.mm.bing.net/th?id=OIP.37Skua12Yb3icbJxRLAgAgHaHY&pid=Api&P=0&h=220',
  },
]

const formatCurrency = (value: number) => {
  return value.toLocaleString('vi', { style: 'currency', currency: 'VND' })
}

function VenueDetailPage() {
  const { id } = useParams<{ id?: string }>()
  const [venue, setVenue] = useState<IVenue | null>(null)
  const [reviewText, setReviewText] = useState<string>('')
  const [rating, setRating] = useState<number>(5)

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const venueData = await getVenueId(id)
        setVenue(venueData.Data)
      } catch (error) {
        console.error('Error fetching venue:', error)
      }
    }

    if (id) {
      fetchVenue()
    }
  }, [id])

  const handleReviewSubmit = () => {
    console.log('#Submit')
  }

  const [Latitude, Longitude] = venue?.GeoLocation
    ? venue.GeoLocation.split(',').map((coord) => parseFloat(coord.trim()).toFixed(14))
    : [null, null]

  const [currentLocation, setCurrentLocation] = useState<any>(null) // Thêm state cho vị trí hiện tại
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              latitude: position.coords.latitude.toFixed(19),
              longitude: position.coords.longitude.toFixed(19),
            })
          },
          (error) => {
            console.error('Error getting location:', error)
          },
        )
      } else {
        console.error('Geolocation is not supported by this browser.')
      }
    }

    getLocation()
  }, [])

  const getDirectionsURL = (latitude: number | null, longitude: number | null) => {
    if (latitude !== null && longitude !== null) {
      return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBOxot5B9V6NikbT-kYtkaKSPIV7IWaXoQ&origin=${latitude},${longitude}&destination=${Latitude},${Longitude}`
    }
    return ''
  }

  return (
    <>
      <div>
        <Header />
      </div>

      <div className="mx-auto min-h-screen w-full bg-gray-200">
        <div className="mx-auto max-w-6xl rounded-md bg-white px-2 shadow-md sm:px-4 lg:px-6">
          <div className="mx-auto max-w-2xl py-1 sm:py-2 lg:max-w-none lg:py-4">
            {venue && (
              <section className="grid w-full grid-cols-1 place-items-start gap-4 py-2 md:grid-cols-3 md:gap-6">
                <article className="ml-7 flex flex-col">
                  <img
                    src={venue.Image}
                    alt={venue.Name}
                    className="h-full w-full rounded-md border border-gray-100 object-cover shadow-md"
                    style={{ aspectRatio: '1/1' }}
                  />
                </article>

                <article className="col-span-2 space-y-6 rounded-lg">
                  <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-medium tracking-wide">{venue.Name}</h3>
                    {venue.LowerPrice == 0 && venue.UpperPrice == 0 ? (
                      <span className="rounded-md bg-green-600 px-3 py-1 text-sm font-semibold text-white">
                        Miễn phí
                      </span>
                    ) : (
                      <>
                        <div className="flex h-fit w-fit items-center justify-center rounded-md bg-amber-400 px-1 py-1 text-sm font-bold text-white">
                          <AttachMoney fontSize="small" />
                          <span>
                            {formatCurrency(venue.LowerPrice)} ~ {formatCurrency(venue.UpperPrice)}{' '}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex h-full flex-col justify-between space-y-8">
                    <div className="flex flex-col justify-between gap-6">
                      <div className="flex items-center space-x-1 text-lg">
                        <FmdGood fontSize="medium" sx={{ color: '#ef4444' }} />
                        {venue.Street && (
                          <span className="font-bold">
                            {venue.Street} - {venue.Location}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-row items-center gap-2 text-lg">
                        <AccessTime fontSize="medium" />
                        <p className="mr-4 pr-2">Giờ mở cửa: {venue.OpenTime}</p>
                      </div>
                      <div className="flex flex-row items-center gap-2 text-lg ">
                        <AccessAlarms fontSize="medium" />
                        <p className="mr-4 pr-2">Giờ đóng cửa: {venue.CloseTime}</p>
                      </div>
                    </div>
                    <div>
                      {localStorage.getItem('user') ? <Popupmenu venueId={venue.Id} venueName={venue.Name} /> : ''}
                    </div>
                  </div>
                </article>
              </section>
            )}
          </div>
        </div>

        <div className="mx-auto my-2 max-w-6xl rounded-md bg-white px-2 shadow-md sm:my-4 sm:px-4 lg:my-6 lg:px-6">
          {venue && venue.GeoLocation && (
            <div style={{ width: '100%', height: '100vh' }}>
              <iframe
                width="100%"
                height="600"
                frameBorder="0"
                src={getDirectionsURL(currentLocation.latitude, currentLocation.longitude)}
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        {/* Phần hiển thị đánh giá */}
        <div className="mx-auto my-2 max-w-6xl rounded-md bg-white px-2 shadow-md sm:my-4 sm:px-4 lg:my-6 lg:px-6">
          <div className="mx-auto max-w-2xl py-1 sm:py-2 lg:max-w-none lg:py-4">
            <section key={'main.reviews'} className="w-full py-10">
              <h3 className="mb-8 text-3xl font-medium">Đánh giá</h3>
              <div className="my-4 space-y-8">
                {fakeReviews.map((review) => (
                  <div key={review.Id} className="mb-2 w-full">
                    <div className="flex w-full items-center gap-3">
                      <div>
                        <img src={review.Avatar} alt={review.Account} className="h-10 w-10 rounded-full" />
                      </div>
                      <div className="flex flex-1 justify-between gap-4">
                        <div>
                          <div className="text-lg font-medium">{review.Account}</div>
                          <div className="text-slate-400">{review.Account}</div>
                        </div>
                        <div className="flex flex-col items-end justify-end">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-medium">{review.Rate}</span>
                            <Rating value={review.Rate as number} />
                          </div>
                          <p className="text-xs text-slate-300">
                            {review.LastUpdateDate
                              ? `Reviewed at ${format(parseISO(review.LastUpdateDate), 'dd/MM/yyyy')}`
                              : 'Review date not available'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 w-3/4">{review.Content}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mx-auto my-2 max-w-6xl bg-white px-2 sm:my-4 sm:px-4 lg:my-6 lg:px-6">
          <div className="mx-auto max-w-2xl py-1 sm:py-2 lg:max-w-none lg:py-4">
            <section key={'main.add-review'} className="w-full py-10">
              <h3 className="mb-8 text-3xl font-medium">Thêm đánh giá</h3>
              <div className="mb-4">
                <textarea
                  className="w-full rounded-md border p-2"
                  rows={5}
                  placeholder="Write your review here..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2"> Đánh giá của bạn: 🌟🌟🌟🌟🌟</span>
                <Rating value={rating} onChange={(value: number) => setRating(value)} />
              </div>
              <button
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={handleReviewSubmit}
              >
                Đăng
              </button>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default VenueDetailPage
