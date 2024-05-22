function VenueDetail() {
  return (
    <div className="w-full bg-white">
      <div className="flex items-center justify-between border-b border-gray-300 p-2">
        <div className="flex items-center justify-start gap-2">
          <img
            src="https://media.quangnamtourism.com.vn/resources/portal/Images/QNM/admqnm/an_bang_quochuy_27_254045245.jpg"
            alt="Venue name"
            className="aspect-square w-10 rounded-full object-cover"
          />
          <span className="font-bold text-sky-700">Bãi tắm An Bàng</span>
        </div>
        <span className="text-sm font-semibold text-amber-700">Miễn phí</span>
      </div>
      <div className="flex flex-col gap-2 p-2 text-xs">
        <div className="font-bold"> Phường Cẩm An, Thành phố Hội An, Tỉnh Quảng Nam</div>
        <div className=" line-clamp-3">
          Bãi tắm An Bàng thuộc phường Cẩm An, thành phố Hội An, cách trung tâm phố cổ 04 km. Bãi tắm An Bàng nằm trong
          danh sách 50 bãi biển đẹp nhất thế giới của trang CNNGo bình chọn. Bãi tắm An Bàng mang nét yên bình và hoang
          sơ
        </div>
        <div className="flex gap-1">
          <img
            src="https://media.quangnamtourism.com.vn/resources/portal/Images/QNM/admqnm/an_bang_quochuy_27_254045245.jpg"
            alt="Venue name"
            className="h-24 w-36 rounded-sm object-cover"
          />
          <img
            src="https://media.quangnamtourism.com.vn/resources/portal/Images/QNM/admqnm/an_bang_quochuy_27_254045245.jpg"
            alt="Venue name"
            className="h-24 w-36 rounded-sm object-cover"
          />
          <img
            src="https://media.quangnamtourism.com.vn/resources/portal/Images/QNM/admqnm/an_bang_quochuy_27_254045245.jpg"
            alt="Venue name"
            className="h-12 w-20 rounded-sm object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default VenueDetail
