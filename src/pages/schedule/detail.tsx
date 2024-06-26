import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab'
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent'
import { CalendarMonth, FmdGood, CameraAlt, AccessTime, AccessAlarms, HourglassBottom } from '@mui/icons-material'
import Header from 'src/components/header'
import Footer from 'src/components/footer'
import React from 'react'
import { axiosClient } from 'src/lib/axios'
import { useParams } from 'react-router-dom'
import { ScheduleDetailResponse, Schedule, ScheduleSuggestionResponse } from 'src/types/schedule'
import { User } from 'src/types'

function ScheduleDetail() {
  const currentUser = JSON.parse(localStorage.getItem('user') ?? '') as User
  const scheduleId = useParams().id
  const [scheduleDetail, setScheduleDetail] = React.useState<Schedule>()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [btnLoading, setBtnLoading] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (scheduleId == '0') {
      if (!localStorage.getItem('suggestion_query')) window.open('/')
      fetchScheduleSuggestion()
    } else {
      fetchScheduleDetail()
    }
  }, [])

  const fetchScheduleDetail = () => {
    setLoading(true)
    const token = `Bearer ${localStorage.getItem('token')}`
    axiosClient
      .get<ScheduleDetailResponse>(`SchedulesAPI/GetVenueSchedule/${scheduleId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status === 200 && response.data.Data.length > 0) {
          setScheduleDetail(response.data.Data[0])
          if (scheduleDetail) {
            scheduleDetail.Venues.reverse
          }
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }
  const fetchScheduleSuggestion = () => {
    setLoading(true)
    const token = `Bearer ${localStorage.getItem('token')}`
    axiosClient
      .post<ScheduleSuggestionResponse>(
        `SchedulesAPI/SuggestSchedule`,
        JSON.parse(localStorage.getItem('suggestion_query') ?? ''),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        },
      )
      .then((response) => {
        if (response.data.Code == 200 && response.data.Data) {
          setScheduleDetail(response.data.Data)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }

  const handleAddSchedule = () => {
    setBtnLoading(true)
    const token = `Bearer ${localStorage.getItem('token')}`
    if (scheduleId != '0') {
      axiosClient
        .post(
          `SchedulesAPI/CloneSchedule?scheduleId=${scheduleId}&accountId=${currentUser.Id}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          },
        )
        .then((response) => {
          if (response.data.Code == 200) {
            setBtnLoading(false)
            window.open(`/schedule/owner`)
          }
        })
        .catch((error) => {
          console.log(error)
          setBtnLoading(false)
        })
    } else {
      axiosClient
        .post(
          `SchedulesAPI/InsertSchedule`,
          {
            Name: scheduleDetail?.Name,
            Description: scheduleDetail?.Description,
            AccountId: currentUser.Id,
            Type: scheduleDetail?.Type,
            IsPublic: true,
            Status: true,
            VenueIds: scheduleDetail?.VenueIds,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
          },
        )
        .then((response) => {
          if (response.data.Code == 200) {
            window.open(`/schedule`)
          }
        })
        .catch((error) => {
          console.log(error)
          setBtnLoading(false)
        })
    }
  }

  const handleDeleteSchedule = () => {
    // setBtnLoading(true)
    // const token = `Bearer ${localStorage.getItem('token')}`
    // axiosClient
    //   .post(
    //     `SchedulesAPI/CloneSchedule?scheduleId=${scheduleId}`,
    //     {},
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: token,
    //       },
    //     },
    //   )
    //   .then((response) => {
    //     if (response.data.Code == 200) {
    //       setBtnLoading(false)
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //     setBtnLoading(false)
    //   })
  }

  const getTimeInDay = (schedule: Schedule | undefined) => {
    switch (schedule?.Type) {
      case 1:
        return 'Sáng'
      case 2:
        return 'Chiều'
      default:
        return 'Tối'
    }
  }
  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi', { style: 'currency', currency: 'VND' })
  }

  return (
    <>
      <Header></Header>
      {loading ? (
        <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center bg-gray-200 backdrop-blur-lg">
          <div className="flex h-10 w-fit items-center gap-2 rounded-lg bg-white/80 px-10 shadow-xl">
            <HourglassBottom className="animate-spin" />
            <span> Loading . . .</span>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center py-8">
          <div className="flex w-[1000px]">
            <div className="flex w-full flex-col items-center justify-center gap-5">
              <div className="flex w-full flex-col justify-center gap-4 rounded-md border border-gray-200 p-4">
                <div className="min-h-[28px] text-2xl font-bold text-sky-700">{scheduleDetail?.Name}</div>
                <div className="flex gap-6">
                  <img
                    src={
                      scheduleDetail?.ThumbnailUrl
                        ? scheduleDetail?.ThumbnailUrl
                        : 'https://media.quangnamtourism.com.vn/resources/portal/Images/QNM/admqnm/an_bang_quochuy_27_254045245.jpg'
                    }
                    className="aspect-video h-fit max-w-[33%] rounded-md border-2 border-gray-300 object-cover shadow-xl"
                  ></img>
                  <div className="flex grow flex-col items-end justify-between">
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex w-full justify-between text-sm">
                        <span className="font-semibold">Thời gian</span>
                        <span>
                          <span className="font-bold">Buổi {getTimeInDay(scheduleDetail)}</span>
                        </span>
                      </div>
                      <div className="flex w-full justify-between text-sm">
                        <span className="font-semibold">Số địa điểm</span>
                        <span>
                          <span className="font-bold">{scheduleDetail?.VenueCount}</span> địa điểm
                        </span>
                      </div>
                      <div className="flex w-full justify-between text-sm">
                        <span className="font-semibold">Mô tả</span>
                        <span>{scheduleDetail?.Description}</span>
                      </div>
                    </div>
                    <div className="flex min-h-[44px] items-center pr-2">
                      {currentUser.FullName != scheduleDetail?.AccountName ? (
                        <div
                          onClick={() => handleAddSchedule()}
                          className={
                            btnLoading
                              ? 'animate-pulse rounded-md bg-orange-400 px-6 py-2 font-bold text-white'
                              : 'cursor-pointer rounded-md bg-orange-400 px-6 py-2 font-bold text-white hover:border-2 hover:border-orange-200'
                          }
                        >
                          <span>Thêm vào lịch trình của tôi</span>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleDeleteSchedule()}
                          className={
                            btnLoading
                              ? 'animate-pulse rounded-md bg-red-400 px-6 py-2 font-bold text-white'
                              : 'cursor-pointer rounded-md bg-red-400 px-6 py-2 font-bold text-white hover:border-2 hover:border-red-200'
                          }
                        >
                          <span>Xoá khỏi lịch trình của tôi</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col overflow-hidden rounded-md bg-gray-100/80">
                <div className="flex items-center justify-between bg-sky-700 px-4 py-3 font-bold text-white">
                  <div className="flex items-center justify-start gap-2 text-xl">
                    <CalendarMonth />
                    <span>Buổi {getTimeInDay(scheduleDetail)}</span>
                  </div>
                  <div className="rounded-sm bg-amber-500 px-2 py-[2px] text-xs">
                    {scheduleDetail?.VenueCount} địa điểm
                  </div>
                </div>
                <Timeline
                  sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.2,
                    },
                  }}
                  className="mt-2 space-y-4"
                >
                  {scheduleDetail?.Venues.map((venue, index) => (
                    <TimelineItem key={venue.Id}>
                      <TimelineOppositeContent color="textSecondary">Địa điểm {index + 1}</TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot sx={{ bgcolor: 'primary.main' }}>
                          <CameraAlt />
                        </TimelineDot>
                        <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                      </TimelineSeparator>
                      <TimelineContent>
                        <a href={`/venue/${venue.Id}`} target="_blank" rel="noreferrer">
                          <div className="group w-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition-transform duration-500 hover:-translate-y-2">
                            <div className="flex items-center justify-between border-b border-gray-300 px-3 py-2 font-bold text-sky-600 transition-colors group-hover:bg-gray-200/80">
                              <div className="flex items-center justify-start gap-2 text-lg">{venue.Name}</div>

                              {venue.LowerPrice === 0 && venue.UpperPrice === 0 ? (
                                <span className="text-sm font-semibold text-green-700">Miễn phí</span>
                              ) : (
                                <span className="text-sm font-semibold text-amber-700">
                                  ${formatCurrency(venue.LowerPrice)} ~ ${formatCurrency(venue.UpperPrice)}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-3 p-3">
                              <div className="w-1/3">
                                <img className="aspect-video rounded-md object-cover" src={venue.Image}></img>
                              </div>
                              <div className="flex flex-col gap-2 p-2">
                                <div className="flex items-center gap-2 font-bold">
                                  <FmdGood fontSize="small" sx={{ color: '#ef4444' }} />
                                  <span className="text-sm">{venue.Location}</span>
                                </div>
                                <div className="space-y-1 p-2 text-[13px]">
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">Mở cửa:</span>
                                    <span className="flex items-center gap-1 font-semibold text-green-800">
                                      {venue.OpenTime} <AccessTime sx={{ fontSize: 14 }} />
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="font-semibold">Đóng cửa:</span>
                                    <span className="flex items-center gap-1 font-semibold text-red-600">
                                      {venue.CloseTime} <AccessAlarms sx={{ fontSize: 15 }} />
                                    </span>
                                  </div>
                                  <div className="line-clamp-3">{venue.Description}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      )}
      <Footer></Footer>
    </>
  )
}

export default ScheduleDetail
