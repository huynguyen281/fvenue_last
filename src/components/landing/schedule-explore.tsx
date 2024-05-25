import React from 'react'
import 'aos/dist/aos.css'
import { DoubleArrow } from '@mui/icons-material'

function ScheduleExplore() {
  return (
    <div className="bg-white pt-10">
      <div className="mx-auto flex h-[700px] w-full items-center bg-gradient-to-b from-white to-orange-400/50">
        <div className="mx-auto flex h-[550px] max-w-7xl items-center bg-transparent px-4 sm:px-6 lg:px-8">
          <div className="flex aspect-[4/3] h-full items-center pr-[100px]">
            <img className="w-full object-contain" src="/images/landing-page.png"></img>
          </div>
          <div className="flex h-full flex-col justify-center gap-12">
            <p className="text-5xl font-bold text-gray-900/90">Khám phá ngay lịch trình thông minh</p>
            <div className="text-justify text-lg font-semibold text-gray-900/70">
              Đà Nẵng - thành phố đáng sống đang đợi bạn, có quá nhiều thứ để khám phá và trải nghiệm ở thành phố tươi
              đẹp này. Hãy để <b className="text-blue-700">FVENUE</b> chúng tôi giúp bạn có lịch trình đi đến những địa
              điểm hot và độc đáo nhất theo sở thích của bạn. Click ngay bên dưới để{' '}
              <b className="text-blue-700">FVENUE</b> có thể giúp bạn có những giây phút trọn vẹn nhất tại đây.
            </div>
            <div className="group w-2/3 cursor-pointer rounded-full bg-gray-100">
              <div
                onClick={() => {
                  window.location.replace('/schedule/suggestion-step')
                }}
                className="flex w-fit items-center justify-center gap-2 rounded-full border-2 border-gray-100/80 bg-gradient-to-r from-orange-400 to-orange-500 px-14 py-2 shadow-md transition-transform duration-1000 group-hover:translate-x-1/3"
              >
                <span className="font-semibold text-white">Tìm hiểu ngay</span>
                <DoubleArrow sx={{ color: '#fff' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleExplore
