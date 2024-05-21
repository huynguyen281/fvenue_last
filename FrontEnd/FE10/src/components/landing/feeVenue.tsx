import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Separator } from '../ui/separator'
import { IVenue } from 'src/types/venue'
import Venue from './card-venue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { axiosClient } from 'src/lib/axios'
import { DataResponse, DataPaging } from 'src/types/common'
import { RotateRight } from '@mui/icons-material'

function FeeVenue() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [venueData, setVenueData] = React.useState<DataPaging<IVenue>>({
    PageIndex: 0,
    PageSize: 5,
    TotalPages: 0,
    Result: [],
  })
  useEffect(() => {
    AOS.init()
    fetchDataVenue()
  }, [])

  const fetchDataVenue = () => {
    setLoading(true)
    axiosClient
      .get<DataResponse<DataPaging<IVenue>>>(
        `VenuesAPI/GetPublicVenueDTOs/${venueData?.PageIndex + 1}/${venueData?.PageSize}`,
      )
      .then((response) => {
        if (response.status === 200 && response.data.Data) {
          if (venueData.Result?.length > 0) {
            const newData = response.data.Data
            newData.Result = [...venueData.Result, ...newData.Result]
            setVenueData(newData)
          } else {
            setVenueData(response.data.Data)
          }
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  // Hàm xử lý khi người dùng nhấp vào nút "Xem thêm"
  const handleSeeMoreClick = () => {
    fetchDataVenue()
  }

  return (
    <div className="bg-gray-100">
      <div className="mx-auto mt-7 max-w-7xl rounded-md bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-1 sm:py-2 lg:max-w-none lg:py-4">
          <div className="flex flex-row justify-between">
            <h2 className="pb-4 pt-2 text-2xl font-bold text-red-500">Các địa điểm có phí</h2>
          </div>
          <Separator />
          <div className="relative mt-5">
            <div className="grid grid-cols-5 gap-5 pb-6" data-aos="fade-up">
              {venueData?.Result?.map((venue) => (
                <Link to={`/venue/${venue.Id}`} className="card-link" key={venue.Id}>
                  <Venue venue={venue} />
                </Link>
              ))}
            </div>
            {venueData.PageIndex < venueData.TotalPages ? (
              <div className="flex w-full justify-center">
                <button
                  onClick={handleSeeMoreClick}
                  className="flex min-h-[44px] w-fit items-center rounded-xl border bg-indigo-500 px-6 py-2"
                >
                  {loading ? (
                    <div className="space-x-2">
                      <RotateRight sx={{ color: '#fff' }} className="animate-spin" />
                      <span className="font-semibold text-white">Đang tải ...</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-white">Xem thêm</span>
                  )}
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeeVenue
