import { Link } from 'react-router-dom' // Import các biểu tượng từ thư viện @tabler/icons-react
import Navigation from './nav'
import { Clock, HelpCircle } from 'lucide-react'
import Help from './help'

export function Header() {
  return (
    <div className="h-[5rem]  bg-gray-200 md:px-12">
      <div className="mx-auto ml-10 flex h-full items-center justify-between bg-gray-200">
        <Link to={'/'} className=" text-4xl font-extrabold text-blue-700">
          FVenue
        </Link>

        <div className="flex items-center">
          <div className="mr-4 flex items-center text-black hover:text-gray-400">
            <HelpCircle size={24} className="mr-2" />
            <Help />
          </div>
          <div className="mr-4 flex items-center text-black hover:text-gray-400">Blog</div>
          <Link to={'/schedule'} className="mr-4 flex items-center text-black hover:text-gray-400">
            <Clock size={24} className="mr-2" />
            <span>Xem lịch trình gần đây</span>
          </Link>
          <Navigation />
        </div>
      </div>
    </div>
  )
}

export default Header
