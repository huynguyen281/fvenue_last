import { Approval, AttachMoney, Today } from '@mui/icons-material'
import { Schedule } from 'src/types/schedule'

export function ListSchedule({ schedulesData }: { schedulesData: Array<Schedule> }) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi', { style: 'currency', currency: 'VND' })
  }
  return (
    <div className="w-[100%] grow">
      <div className="grid w-full grid-cols-3 gap-3 gap-y-4">
        {schedulesData?.map((item) => (
          <a href={`/schedule/detail/${item.Id}`} key={item.Id}>
            <div className="cursor-pointer transition-shadow duration-300 hover:shadow-lg">
              <img className="h-36 w-full rounded-t-md object-cover" src={item.ThumbnailUrl} alt="" />
              <div className="rounded-sm border border-solid py-2">
                <div className="flex min-h-[48px] items-center px-2 font-semibold text-blue-950">{item.Name}</div>
                <div className="my-2 h-[1px] w-full bg-blue-950/80"></div>
                <div className="flex flex-col gap-[6px] px-2">
                  <div className="flex justify-between text-[15px]">
                    <div className="flex items-center justify-center gap-1">
                      <AttachMoney fontSize="small" className="text-blue-950" />
                      <span>Chi phí</span>
                    </div>
                    <div className="font-bold text-blue-900/80">~{formatCurrency(item.MediumPrice)}</div>
                  </div>

                  <div className="flex justify-between text-[15px]">
                    <div className="flex items-center justify-center gap-1">
                      <Approval fontSize="small" className="text-blue-950" />
                      <span>Số địa điểm</span>
                    </div>
                    <div className="font-bold text-blue-900/80">{item.NumberOfVenue} địa điểm</div>
                  </div>
                  <div className="flex justify-between text-[15px]">
                    <div className="flex items-center justify-center gap-1">
                      <Today fontSize="small" className="text-blue-950" />
                      <span>Thời gian</span>
                    </div>
                    <div className="font-bold text-blue-900/80">{item.TimeInDay}</div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
