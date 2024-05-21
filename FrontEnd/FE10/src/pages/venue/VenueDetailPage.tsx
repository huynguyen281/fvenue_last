// import React, { useState, useEffect, useCallback, useId } from 'react'
// import { format, parseISO } from 'date-fns'
// import { Rating } from '@smastrom/react-rating'
// import { IReviewGetAll, IReviewResponseInsert, IVenue } from 'src/types/venue'
// import { useParams } from 'react-router-dom'
// import { getVenueId } from 'src/api/venue/getById'
// import { useAuth } from 'src/hooks/useAuth'
// import { useToast } from 'src/components/ui/use-toast'
// import getAllReviewByVenueId from 'src/api/feedback/get-all-feedback'
// import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar'
// import { Star } from 'lucide-react'
// import { useForm } from 'react-hook-form'
// import { postRatingComment } from 'src/api/feedback/insert-feedback'
// import { useMutation } from '@tanstack/react-query'
// import { queryClient } from 'src/lib/query'
// import { Separator } from 'src/components/ui/separator'
// import { Label } from 'src/components/ui/label'
// import { Textarea } from 'src/components/ui/text-area'
// import { Button } from 'src/components/ui/button'

// type FormValue = {
//   Content: string
//   Rate: number
// }
// function VenueDetailPage() {
//   const { Id } = useParams<{ Id?: string }>()
//   const [venue, setVenue] = useState<IVenue | null>(null)
//   const { user } = useAuth()
//   const { toast } = useToast()
//   const [venueReview, setvenueReview] = useState<IReviewGetAll[]>([])

//   useEffect(() => {
//     const fetchVenue = async () => {
//       try {
//         const venueData = await getVenueId(Id)
//         setVenue(venueData.Data)
//       } catch (error) {
//         console.error('Error fetching venue:', error)
//       }
//     }

//     if (Id) {
//       fetchVenue()
//     }
//   }, [Id])

//   useEffect(() => {
//     const fetchData = async () => {
//       const review: IReviewGetAll[] = await getAllReviewByVenueId(venue?.Id as string)
//       setvenueReview(review)
//     }
//     if (venue?.Id) {
//       fetchData()
//     }
//   }, [venue?.Id])

//   const renderReviewRating = useCallback((Rate: number) => {
//     switch (Rate) {
//       case 5:
//         return <p className=" text-orange-500">Excellent</p>
//       case 4:
//         return <p className=" text-orange-500">Great</p>
//       case 3:
//         return <p className=" text-orange-500">Good</p>
//       case 2:
//         return <p className=" text-orange-500">Bad</p>
//       case 1:
//         return <p className=" text-orange-500">No worth</p>
//       default:
//         return <p></p>
//     }
//   }, [])

//   const renderReviewer = React.useCallback(
//     ({ Account, Venue, Rate, Content, CreateDate }: IReviewGetAll) => (
//       <div className="flex w-full items-center gap-3">
//         <Avatar>
//           <AvatarImage width={'50rem'} src={Account} alt={`${Account}`} />
//           <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//         <div className="flex flex-1 justify-between gap-4">
//           <div>
//             <div className="text-lg font-medium">{Account}</div>
//             <div className="text-slate-400">{Account}</div>
//           </div>
//           <div className="flex flex-col items-end justify-end">
//             <div className="flex gap-2">
//               <h5 className="flex w-fit items-center text-lg font-medium">
//                 {Rate}&nbsp;
//                 <Star className={'text-yellow-500'} size={16} />
//               </h5>
//               {renderReviewRating(Rate)}
//             </div>
//             <p className="text-right text-xs text-slate-300">
//               {CreateDate ? `Reviewed at ${format(parseISO(CreateDate), 'dd/MM/yyyy')}` : 'Review date not available'}
//             </p>
//           </div>
//         </div>
//       </div>
//     ),
//     [],
//   )
//   const id = useId()
//   const addReview = useCallback(
//     (review: IReviewResponseInsert) => {
//       if (!venue?.Reviews) {
//         return
//       }

//       //   const updatedBook: IBook = {
//       //     ...book,
//       //     reviews: [...book.reviews, review],
//       //   }

//       //   setBook(updatedBook)
//     },
//     [venue],
//   )
//   const { mutateAsync, isLoading: isAddReview } = useMutation({
//     mutationFn: postRatingComment,
//     onSuccess: (_, { Id, AccountId, Content, Rate }) => {
//       if (!venue) return
//       queryClient.invalidateQueries()
//       addReview({
//         Id: Id,
//         AccountId: AccountId,
//         Content,
//         Rate,
//       })
//     },
//   })

//   const renderReviews = React.useMemo(() => {
//     if (!Array.isArray(venueReview)) return null // Check if bookReview is an array
//     return venueReview.map((reviewer) => (
//       <div key={reviewer.AccountId} className="mb-2 w-full">
//         {renderReviewer(reviewer)}
//         <p className="mt-2 w-3/4">{reviewer.Content}</p>
//       </div>
//     ))
//   }, [venueReview, renderReviewer])

//   const { setValue, watch, reset, register, handleSubmit } = useForm<FormValue>({
//     defaultValues: {
//       Content: '',
//       Rate: 5,
//     },
//   })

//   const handleReviewSubmit = useCallback(
//     ({ Rate, Content }: FormValue) => {
//       mutateAsync({
//         // ratingId: book?.ratingId as string,
//         Id: venue?.Id as string,
//         AccountId: user?.AccountId as string,
//         Content: Content,
//         Rate: Rate,
//       })
//         .then(() => {
//           toast({
//             type: 'foreground',
//             title: 'Post a comment successfully',
//             description: 'Your comment have been recorded',
//           })

//           reset()
//         })
//         .catch((e) => {
//           toast({
//             type: 'foreground',
//             title: 'Error',
//             description: JSON.stringify(e),
//           })
//         })
//     },
//     [mutateAsync, venue?.Id, user?.AccountId, toast, reset],
//   )

//   const [Latitude, Longitude] = venue?.GeoLocation
//     ? venue.GeoLocation.split(',').map((coord) => parseFloat(coord.trim()).toFixed(14))
//     : [null, null]
//   console.log(Latitude)

//   const [currentLocation, setCurrentLocation] = useState<any>(null) // Thêm state cho vị trí hiện tại
//   useEffect(() => {
//     const getLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             setCurrentLocation({
//               latitude: position.coords.latitude.toFixed(19),
//               longitude: position.coords.longitude.toFixed(19),
//             })
//           },
//           (error) => {
//             console.error('Error getting location:', error)
//           },
//         )
//       } else {
//         console.error('Geolocation is not supported by this browser.')
//       }
//     }

//     getLocation()
//   }, [])

//   const getDirectionsURL = (latitude: number | null, longitude: number | null) => {
//     if (latitude !== null && longitude !== null) {
//       return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBOxot5B9V6NikbT-kYtkaKSPIV7IWaXoQ&origin=${latitude},${longitude}&destination=${Latitude},${Longitude}`
//     }
//     return ''
//   }
//   console.log(getDirectionsURL)
//   console.log(currentLocation)

//   return (
//     <div className="mx-auto min-h-screen w-full bg-gray-200">
//       <div className="mx-auto max-w-6xl bg-white px-2 sm:px-4 lg:px-6">
//         <div className="mx-auto max-w-2xl py-1 sm:py-2 lg:max-w-none lg:py-4">
//           {venue && (
//             <section className="grid w-full grid-cols-1 place-items-start gap-4 py-2 md:grid-cols-3 md:gap-6">
//               <article className="ml-7 flex flex-col">
//                 <img
//                   src={venue.Image}
//                   alt={venue.Name}
//                   className="h-full w-full rounded-sm object-cover shadow-md"
//                   style={{ aspectRatio: '1/1' }}
//                 />
//               </article>

//               <article className="col-span-2 ml-24 space-y-8 rounded-lg">
//                 <div className="space-y-4">
//                   <h3 className="text-3xl font-medium tracking-wide">{venue.Name}</h3>
//                   <div className="flex flex-row justify-between">
//                     <div className="flex flex-row">
//                       <p className="nav-link mr-4 pr-2">{venue.GeoLocation}</p>
//                       <p className="nav-link mr-4 pr-2">{venue.OpenTime}</p>
//                       <p className="nav-link mr-4 pr-2">{venue.CloseTime}</p>
//                     </div>
//                     <div>
//                       <button className="rounded bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-700">
//                         Report
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-6 px-6">
//                   <h1 className="text-xl">
//                     <span className="font-bold">Đường {venue.Street}</span>
//                   </h1>
//                   <h1 className="text-xl">
//                     <span>{venue.Location}</span>
//                   </h1>
//                 </div>

//                 <div className="space-y-2 px-6">
//                   <span>LowerPrice {venue.LowerPrice} VNĐ</span>
//                 </div>
//                 <div className="space-y-2 px-6">
//                   <span>UpperPrice {venue.UpperPrice} VNĐ</span>
//                 </div>
//               </article>
//             </section>
//           )}
//         </div>
//       </div>

//       <div className="mx-auto my-2 max-w-6xl bg-white px-2 sm:my-4 sm:px-4 lg:my-6 lg:px-6">
//         {venue && venue.GeoLocation && (
//           <div style={{ width: '100%', height: '100vh' }}>
//             <iframe
//               width="100%"
//               height="600"
//               frameBorder="0"
//               src={getDirectionsURL(currentLocation.latitude, currentLocation.longitude)}
//               allowFullScreen
//             ></iframe>
//           </div>
//         )}
//       </div>
//       <div className="mx-auto my-2 max-w-6xl bg-white px-2 sm:my-4 sm:px-4 lg:my-6 lg:px-6">
//         <div className="mx-auto max-w-2xl py-1 sm:py-2 lg:max-w-none lg:py-4">
//           <section key={'main.reviews'} className="w-full py-10">
//             <h3 className="mb-8 text-3xl font-medium">Reviewers ({venue ? venueReview?.length : 0})</h3>
//             <div className="my-4 space-y-8">{renderReviews}</div>
//           </section>
//           <Separator />
//           <section key={'main.myreview'} className="w-full py-10">
//             <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-2">
//               <div>
//                 <Label>Rating</Label>
//                 <div className="flex items-center gap-2">
//                   <Rating
//                     style={{ maxWidth: 100 }}
//                     value={watch('Rate')}
//                     onChange={(value: number) => setValue('Rate', value)}
//                     isDisabled={isAddReview}
//                   />
//                   {renderReviewRating(watch('Rate'))}
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="Content">Your review</Label>
//                 <Textarea
//                   placeholder={''}
//                   {...register('Content', {
//                     minLength: 2,
//                     maxLength: 255,
//                   })}
//                   disabled={isAddReview}
//                 />
//               </div>
//               <Button type="submit">Submit</Button>
//             </form>
//           </section>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default VenueDetailPage
import React, { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { Rating } from '@smastrom/react-rating'
import { IVenue, IReview } from 'src/types/venue'
import { useParams } from 'react-router-dom'
import { getVenueId } from 'src/api/venue/getById'
import Popupmenu from 'src/components/Itemmenu/pop-up-menu'
import Header from 'src/components/header'
import Footer from 'src/components/footer'

// Giả mạo dữ liệu đánh giá
const fakeReviews: IReview[] = [
  {
    _id: '1',
    user_id: {
      _id: '1',
      fullName: 'John Doe',
      email: 'john@gmail.com',
      avatar: 'https://tse2.mm.bing.net/th?id=OIP.37Skua12Yb3icbJxRLAgAgHaHY&pid=Api&P=0&h=220',
    },
    rating: '4🌟',
    updatedAt: '2024-02-27T08:00:00Z',
    details: 'A great place to visit!',
  },
  {
    _id: '2',
    user_id: {
      _id: '2',
      fullName: 'Jane Smith',
      email: 'jane@gmail.com',
      avatar: 'https://tse2.mm.bing.net/th?id=OIP.37Skua12Yb3icbJxRLAgAgHaHY&pid=Api&P=0&h=220',
    },
    rating: '5🌟',
    updatedAt: '2024-02-25T08:00:00Z',
    details: 'Highly recommended!',
  },
  {
    _id: '3',
    user_id: {
      _id: '2',
      fullName: 'john snow',
      email: 'john@gmail.com',
      avatar: 'https://tse2.mm.bing.net/th?id=OIP.37Skua12Yb3icbJxRLAgAgHaHY&pid=Api&P=0&h=220',
    },
    rating: '5🌟',
    updatedAt: '2024-02-25T08:00:00Z',
    details: 'Good!',
  },
]

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

  const [reviews, setReviews] = useState<IReview[]>(fakeReviews) // Sử dụng dữ liệu giả mạo cho reviews

  const handleReviewSubmit = () => {
    const currentDate = new Date()
    const formattedDate = format(currentDate, "yyyy-MM-dd'T'HH:mm:ss'Z'")

    const review: IReview = {
      _id: (venue?.Reviews?.length || 0 + 1).toString(),
      user_id: {
        fullName: 'John Doe',
        email: 'john@example.com',
        avatar: 'fake-avatar-url',
      },
      rating: 5,
      updatedAt: formattedDate,
      details: reviewText,
    }

    // Update venue with the new review
    setVenue((prevVenue) => {
      const updatedReviews = prevVenue?.Reviews ? [...prevVenue.Reviews, review] : [review]
      return { ...prevVenue, Reviews: updatedReviews }
    })

    // Clear review text input
    setReviewText('')
  }

  const [Latitude, Longitude] = venue?.GeoLocation
    ? venue.GeoLocation.split(',').map((coord) => parseFloat(coord.trim()).toFixed(14))
    : [null, null]
  console.log(Latitude)

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
  console.log(getDirectionsURL)
  console.log(currentLocation)

  return (
    <>
      <div>
        <Header />
      </div>

      <div className="mx-auto min-h-screen w-full bg-gray-200">
        <div className="mx-auto max-w-6xl bg-white px-2 sm:px-4 lg:px-6">
          <div className="mx-auto max-w-2xl py-1 sm:py-2 lg:max-w-none lg:py-4">
            {venue && (
              <section className="grid w-full grid-cols-1 place-items-start gap-4 py-2 md:grid-cols-3 md:gap-6">
                <article className="ml-7 flex flex-col">
                  <img
                    src={venue.Image}
                    alt={venue.Name}
                    className="h-full w-full rounded-sm object-cover shadow-md"
                    style={{ aspectRatio: '1/1' }}
                  />
                </article>

                <article className="col-span-2 ml-24 space-y-8 rounded-lg">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-medium tracking-wide">{venue.Name}</h3>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row">
                        <p className="nav-link mr-4 pr-2">Giờ mở cửa: {venue.OpenTime}</p>
                        <p className="nav-link mr-4 pr-2">Giờ đóng cửa: {venue.CloseTime}</p>
                      </div>
                      <div>
                        {/* <button className="rounded bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-700">
              Report
            </button> */}
                        <Popupmenu venueId={venue.Id} venueName={venue.Name} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 px-6">
                    <h1 className="text-xl">
                      {venue.Street && <span className="font-bold">Đường {venue.Street}</span>}
                    </h1>
                    <h1 className="text-xl">
                      <span>{venue.Location}</span>
                    </h1>
                  </div>

                  <div className="space-y-2 px-6">
                    <span>Giá thấp nhất: {venue.LowerPrice},000 VNĐ</span>
                  </div>
                  <div className="space-y-2 px-6">
                    <span>Giá cao nhất: {venue.UpperPrice},000 VNĐ</span>
                  </div>
                </article>
              </section>
            )}
          </div>
        </div>

        <div className="mx-auto my-2 max-w-6xl bg-white px-2 sm:my-4 sm:px-4 lg:my-6 lg:px-6">
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
        <div className="mx-auto my-2 max-w-6xl bg-white px-2 sm:my-4 sm:px-4 lg:my-6 lg:px-6">
          <div className="mx-auto max-w-2xl py-1 sm:py-2 lg:max-w-none lg:py-4">
            <section key={'main.reviews'} className="w-full py-10">
              <h3 className="mb-8 text-3xl font-medium">Đánh giá</h3>
              <div className="my-4 space-y-8">
                {reviews.map((review) => (
                  <div key={review._id} className="mb-2 w-full">
                    <div className="flex w-full items-center gap-3">
                      <div>
                        <img
                          src={review.user_id.avatar}
                          alt={review.user_id.fullName}
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div className="flex flex-1 justify-between gap-4">
                        <div>
                          <div className="text-lg font-medium">{review.user_id.fullName}</div>
                          <div className="text-slate-400">{review.user_id.email}</div>
                        </div>
                        <div className="flex flex-col items-end justify-end">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-medium">{review.rating}</span>
                            <Rating value={review.rating} />
                          </div>
                          <p className="text-xs text-slate-300">
                            {review.updatedAt
                              ? `Reviewed at ${format(parseISO(review.updatedAt), 'dd/MM/yyyy')}`
                              : 'Review date not available'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 w-3/4">{review.details}</p>
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
                <Rating value={rating} onChange={(value) => setRating(value)} size={30} interactive />
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
