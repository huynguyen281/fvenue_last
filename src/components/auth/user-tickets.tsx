import React from 'react'
import { axiosClient } from 'src/lib/axios'
import { UserTicket, UserTicketResponse } from 'src/types'
import { AccessTime } from '@mui/icons-material'
import { Dialog, DialogPortal, DialogContent, DialogClose } from 'src/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'
import { IResponse } from 'src/types/response'
import { paymentResult } from 'src/api/user/payment'
import { IPaymentResult } from 'src/types/payment'
import { AxiosError } from 'axios'

export default function UserTickets({ userId }: { userId: string }) {
  const queryString = window.location.href.split('?')[1]
  const [userTicketData, setUserTicketData] = React.useState<Array<UserTicket>>()

  const { data: dataPayment } = useQuery<IResponse<IPaymentResult[]>, AxiosError>(
    ['PaymentResult'],
    () => paymentResult(queryString),
    {
      keepPreviousData: true,
      enabled: !!queryString,
    },
  )

  React.useEffect(() => {
    fetchUserTicketData()
  }, [])

  if (queryString && dataPayment) {
    const confirm = (open: boolean) => {
      if (!open) window.location.href = 'http://localhost:5000/profile'
    }
    return (
      <Dialog defaultOpen onOpenChange={confirm}>
        <DialogPortal>
          <DialogContent>
            <div className="flex flex-col gap-4">
              <p className="text-2xl font-bold">
                {dataPayment.Code == 200 ? 'Thanh toán đặt vé thành công' : 'Thanh toán đặt vé thất bại'}
              </p>
              <p>
                {dataPayment.Code == 200
                  ? 'Bạn đã mua vé thành công, vui lòng kiểm tra email để xem thông tin vé. Nếu có bất kì cầu hỏi nào hãy liên hệ với chúng tôi. Cảm ơn vì đã tín dụng!'
                  : 'Thanh đặt vé toán thất bại'}
              </p>

              <div className="flex w-full justify-end">
                <DialogClose>
                  <div className="w-20 cursor-pointer rounded-lg border-2 border-green-500 bg-green-400 px-2 py-1 text-center font-bold text-white hover:bg-green-400/80">
                    Ok
                  </div>
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    )
  }

  const fetchUserTicketData = () => {
    if (userId)
      axiosClient
        .get<UserTicketResponse>(`ItemsAPI/GetBookedTicket?AccountId=${userId}`)
        .then((response) => {
          if (response.status === 200 && response.data.Data) {
            setUserTicketData(response.data.Data)
          }
        })
        .catch((error) => {
          console.log(error)
        })
  }

  const formatDatetime = (value: string) => {
    return new Intl.DateTimeFormat('vi', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(value))
  }
  const getDayDifference = (date1: string) => {
    const dateStart = new Date(date1)
    const dateEnd = new Date()
    const diff = dateEnd.getTime() - dateStart.getTime()
    console.log(diff / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="flex w-[1000px] p-4">
      <div className="flex w-full flex-col gap-5 rounded-lg bg-white p-8 opacity-80">
        {userTicketData?.map((ticket) => (
          <div key={ticket.Id} className="flex w-full justify-between rounded-lg border border-gray-200 p-2 shadow-lg">
            <div className="flex h-20 gap-4">
              <img
                alt={ticket.SerialNumber}
                className="aspect-[4/3] h-full rounded-md object-cover"
                src={ticket.TicketImage}
              ></img>
              <div className="flex h-full flex-col gap-2">
                <div className="cursor-pointer font-semibold underline hover:font-bold">
                  <a href={`/venue/${ticket.VenueId}`}>{ticket.ItemName}</a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AccessTime fontSize="small" />
                  {formatDatetime(ticket.ExpiryDate)}
                </div>
              </div>
            </div>
            <div>{ticket.SerialNumber}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
