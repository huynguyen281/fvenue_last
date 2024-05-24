import { CarouselContent, Carousel, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/ui/carousel'
import React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'

function CarouselLD() {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  return (
    <Carousel
      plugins={[plugin.current]}
      className="relative w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 4 }).map((_, index) => (
          <React.Fragment key={index}>
            <CarouselItem>
              <div className="relative w-full">
                <img
                  className="h-[30rem] w-[100%] object-cover"
                  src={`https://th.bing.com/th/id/R.bc9c9bbf4c186267f814644a84526eea?rik=es%2bqJomACNGYUQ&pid=ImgRaw&r=0`}
                  alt={`carousel-image-${index}`}
                />
                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                  <div className="flex items-center">
                    <div className="top-30 absolute left-20 w-full space-y-6 py-4 text-white">
                      <p className="text-5xl font-extrabold tracking-wider">Lên Lịch Trình Cùng Fvenue</p>
                      <p className="text-xl font-semibold">
                        Khám phá niềm vui của bạn mọi lúc, mọi nơi - từ chuyến du lịch ngẫu hứng tới những cuộc phiêu
                        lưu
                      </p>
                    </div>
                    <div className="absolute bottom-24 left-20 flex items-center">
                      <Search size={24} className="absolute left-2 text-gray-500" />

                      <input
                        type="text"
                        placeholder="Search..."
                        className="rounded-3xl border border-gray-300 px-12 py-3 focus:outline-none"
                        style={{ width: '700px' }}
                      />
                      <button className="absolute right-0 top-0 h-full rounded-r-3xl bg-blue-600 px-6 text-lg font-semibold text-white">
                        <Link to={'/venues'}>Khám phá</Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative w-full">
                <img
                  className="h-[30rem] w-[100%] object-cover"
                  src={`https://d36tnp772eyphs.cloudfront.net/blogs/1/2018/08/Dragon-Bridge-in-Da-Nang-City-Vietnam.jpg`}
                  alt={`carousel-image-${index}`}
                />
                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                  <div className="flex items-center">
                    <div className="top-30 absolute left-20 w-full space-y-6 py-4 text-white">
                      <p className="text-5xl font-extrabold tracking-wider">Lên Lịch Trình Cùng Fvenue</p>
                      <p className="text-xl font-semibold">
                        Khám phá niềm vui của bạn mọi lúc, mọi nơi - từ chuyến du lịch ngẫu hứng tới những cuộc phiêu
                        lưu
                      </p>
                    </div>
                    <div className="absolute bottom-24 left-20 flex items-center">
                      <Search size={24} className="absolute left-2 text-gray-500" />

                      <input
                        type="text"
                        placeholder="Search..."
                        className="rounded-3xl border border-gray-300 px-12 py-3 focus:outline-none"
                        style={{ width: '700px' }}
                      />
                      <button className="absolute right-0 top-0 h-full rounded-r-3xl bg-blue-600 px-6 text-base text-lg font-semibold text-white">
                        <Link to={'/venues'}>Khám phá</Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
            {/* Thêm các CarouselItem và các thành phần search tương ứng tại đây */}
            <CarouselItem>
              <div className="relative w-full">
                <img
                  className="h-[30rem] w-[100%] object-cover"
                  src={`https://res.klook.com/image/upload/fl_lossy.progressive,q_90/c_fill,,w_2560,/v1670577664/banner/rtw7fgqatgoc1vpcpamb.webp`}
                  alt={`carousel-image-${index}`}
                />
                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                  <div className="flex items-center">
                    <div className="top-30 absolute left-20 w-full space-y-6 py-4 text-white">
                      <p className="text-5xl font-extrabold tracking-wider">Lên Lịch Trình Cùng Fvenue</p>
                      <p className="text-xl font-semibold">
                        Khám phá niềm vui của bạn mọi lúc, mọi nơi - từ chuyến du lịch ngẫu hứng tới những cuộc phiêu
                        lưu
                      </p>
                    </div>
                    <div className="absolute bottom-24 left-20 flex items-center">
                      <Search size={24} className="absolute left-2 text-gray-500" />

                      <input
                        type="text"
                        placeholder="Search..."
                        className="rounded-3xl border border-gray-300 px-12 py-3 focus:outline-none"
                        style={{ width: '700px' }}
                      />
                      <button className="absolute right-0 top-0 h-full rounded-r-3xl bg-blue-600 px-6 text-base text-lg font-semibold text-white">
                        <Link to={'/venues'}>Khám phá</Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </React.Fragment>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default CarouselLD
