import { IPaymentQuery, IPaymentResult } from 'src/types/payment'
import { PaymentType } from 'src/enums/payment-type'
import { payment, paymentResult } from 'src/api/user/payment'
import { useQuery } from '@tanstack/react-query'
import { IResponse } from 'src/types/response'
import { AxiosError } from 'axios'
import { Dialog, DialogPortal, DialogContent, DialogClose } from 'src/components/ui/dialog'

type Props = {
  userId: string
  userRole: string
}

function UserTransaction({ userId, userRole }: Props) {
  const queryString = window.location.href.split('?')[1]
  const { data } = useQuery<IResponse<IPaymentResult[]>, AxiosError>(
    ['PaymentResult'],
    () => paymentResult(queryString),
    {
      keepPreviousData: true,
      enabled: !!queryString,
    },
  )
  if (queryString && data) {
    const confirm = (open: boolean) => {
      if (!open) window.location.href = 'http://localhost:5000/profile'
    }
    return (
      <Dialog defaultOpen onOpenChange={confirm}>
        <DialogPortal>
          <DialogContent>
            <div className="flex flex-col gap-4">
              <p className="text-2xl font-bold">{data.Code == 200 ? 'Thanh toán thành công' : 'Thanh toán thất bại'}</p>
              <p>
                {data.Code == 200
                  ? 'Bạn đã nâng cấp tài khoản premium thành công, việc nâng cấp sẽ mất vài phút để hoàn tất. Nếu có bất kì cầu hỏi nào hãy liên hệ với chúng tôi. Cảm ơn vì đã tín dụng!'
                  : 'Thanh toán thất bại'}
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

  if (userRole == 'VenueManager') {
    return (
      <div className="flex h-[400px] w-[700px]">
        <div className="flex gap-8 py-8 opacity-80">
          <img src="/remove-bg-traveling.png" className="h-80 rounded-2xl opacity-90" />
          <div className="flex flex-col items-start justify-center gap-6 text-gray-600">
            <span className="whitespace-nowrap text-xl font-bold">Tài khoản của bạn đã được nâng cấp!</span>
            <span className="flex flex-col gap-2 text-justify">
              Cảm ơn bạn đã tin tưởng chúng tôi. Hiện tại, bạn có thể tải lên vị trí nhà hàng, quán cà phê, rạp chiếu
              phim, hoặc bất cứ điều gì khác bạn muốn quảng bá cho người dùng!🌟👏📢
            </span>
          </div>
        </div>
      </div>
    )
  }

  const UpdateTransition = async () => {
    const dataQuery = {
      UserId: userId,
      Amount: 250000,
      PaymentType: PaymentType.Upgrade,
      BankCode: 'NCB',
      Content: 'Thanh toan premium',
      Locale: 'vn',
    } as IPaymentQuery
    const data = await payment(dataQuery)
    if (data && data.Data) {
      window.open(data.Data, '_blank')
    }
  }
  return (
    <div className="flex h-[400px] w-[700px]">
      <div className="flex gap-8 py-8 opacity-80">
        <img src="/remove-bg-traveling.png" className="h-80 rounded-2xl opacity-90" />
        <div className="flex flex-col items-start justify-center gap-6 text-gray-600">
          <span className="whitespace-nowrap text-xl font-bold">Nâng cấp tài khoản của bạn ngay!</span>
          <span className="flex flex-col gap-2 text-justify">
            Có thể tuỳ thích đăng địa điểm của bạn sở hữu, xem các thông số giao dịch và đặt vé cùng Fvenue
            <span>
              Chỉ với <span className="text-2xl font-semibold">$10</span> Mỗi tháng
            </span>
          </span>
          <div
            className="cursor-pointer rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-[6px] transition-all hover:-translate-y-1"
            onClick={UpdateTransition}
          >
            <span className="text-base font-semibold text-white">Nâng cấp Venue Pro ngay!</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTransaction
