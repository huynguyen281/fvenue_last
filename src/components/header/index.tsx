import { Link } from 'react-router-dom' // Import các biểu tượng từ thư viện @tabler/icons-react
import Navigation from './nav'
import { Clock, HelpCircle } from 'lucide-react'
import Help from './help'

export function Header() {
  return (
    <>
      <div className="h-[5rem] bg-gray-100 md:px-12">
        <div className="mx-auto ml-10 flex h-full items-center justify-between bg-transparent">
          <Link to={'/'} className=" text-4xl font-extrabold text-blue-700">
            FVenue
          </Link>

          <div className="flex items-center">
            <div className="mr-4 flex items-center text-black hover:text-gray-400">
              <HelpCircle size={24} className="mr-2" />
              <Help />
            </div>
            <div className="mr-4 flex items-center text-black hover:text-gray-400">Blog</div>
            <Link
              to={localStorage.getItem('user') ? '/schedule' : '/login'}
              className="mr-4 flex items-center text-black hover:text-gray-400"
            >
              <Clock size={24} className="mr-2" />
              <span>Xem danh sách lịch trình</span>
            </Link>
            <Navigation />
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-gradient-to-r from-blue-700 via-violet-600 to-orange-600"></div>
    </>
  )
}

export default Header
