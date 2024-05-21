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
                  className="h-[27rem] w-[100%]"
                  src={`https://res.klook.com/image/upload/fl_lossy.progressive,q_90/c_fill,,w_2560,/v1670577664/banner/rtw7fgqatgoc1vpcpamb.webp`}
                  alt={`carousel-image-${index}`}
                />
                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                  <div className="flex items-center">
                    <div className="top-30 absolute left-20 w-full py-4  text-white">
                      <p className="text-5xl  font-bold">Lên Lịch Trình Cùng Fvenue</p>
                      <p className="text-xl">
                        Khám phá niềm vui của bạn mọi lúc, mọi nơi - từ chuyến du lịch ngẫu hứng tới những cuộc phiêu
                        lưu
                      </p>
                    </div>
                    <div className="absolute bottom-20 left-20 flex items-center">
                      <Search size={24} className="absolute left-2 text-gray-500" />

                      <input
                        type="text"
                        placeholder="Search..."
                        className="rounded-2xl border border-gray-300 px-9 py-4"
                        style={{ width: '700px' }}
                      />
                      <button className="absolute right-4 top-2 rounded-xl bg-blue-500 px-4 py-2 text-white">
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
                  className="h-[27rem] w-[100%]"
                  src={`https://img.thuthuatphanmem.vn/uploads/2018/10/03/anh-bo-bien-dep-va-tho-mong_111548093.jpg`}
                  alt={`carousel-image-${index}`}
                />
                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                  <div className="flex items-center">
                    <div className="top-30 absolute left-20 w-full py-4  text-white">
                      <p className="text-5xl  font-bold">Lên Lịch Trình Cùng Fvenue</p>
                      <p className="text-xl">
                        Khám phá niềm vui của bạn mọi lúc, mọi nơi - từ chuyến du lịch ngẫu hứng tới những cuộc phiêu
                        lưu
                      </p>
                    </div>
                    <div className="absolute bottom-20 left-20 flex items-center">
                      <Search size={24} className="absolute left-2 text-gray-500" />

                      <input
                        type="text"
                        placeholder="Search..."
                        className="rounded-2xl border border-gray-300 px-9 py-4"
                        style={{ width: '700px' }}
                      />
                      <button className="absolute right-4 top-2 rounded-xl bg-blue-500 px-4 py-2 text-white">
                        Khám phá
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
                  className="h-[27rem] w-[100%]"
                  src={`https://exploreonevietnam.com/wp-content/uploads/2020/08/Cau_Vang_1__FFFA.jpg`}
                  alt={`carousel-image-${index}`}
                />
                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                  <div className="flex items-center">
                    <div className="top-30 absolute left-20 w-full py-4  text-white">
                      <p className="text-5xl  font-bold">Lên Lịch Trình Cùng Fvenue</p>
                      <p className="text-xl">
                        Khám phá niềm vui của bạn mọi lúc, mọi nơi - từ chuyến du lịch ngẫu hứng tới những cuộc phiêu
                        lưu
                      </p>
                    </div>
                    <div className="absolute bottom-20 left-20 flex items-center">
                      <Search size={24} className="absolute left-2 text-gray-500" />

                      <input
                        type="text"
                        placeholder="Search..."
                        className="rounded-2xl border border-gray-300 px-9 py-4"
                        style={{ width: '700px' }}
                      />
                      <button className="absolute right-4 top-2 rounded-xl bg-blue-500 px-4 py-2 text-white">
                        Khám phá
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
