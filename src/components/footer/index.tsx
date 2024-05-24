import { Link } from 'react-router-dom'
import { Facebook, Instagram, Pinterest, YouTube, X } from '@mui/icons-material'

const currentYear = new Date().getFullYear()

const A = ({ items }: { items: Array<{ id: number; title: string; path: string }> }) => {
  return (
    <ul className="text-left font-medium text-gray-500">
      {items.map((item) => (
        <li key={item.id} className="mb-4">
          <Link to={item.path} className="hover:text-white">
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function Footer() {
  return (
    <footer className="w-full bg-blue-800/90 px-40 pb-4 pt-12">
      <div className="flex w-full justify-between">
        <div className="flex w-[30%] flex-col gap-4 text-gray-200">
          <Link to="/" className="flex items-center">
            <span className="self-center whitespace-nowrap text-4xl font-extrabold tracking-wider">FVenue</span>
          </Link>
          <div>Khám phá những địa điểm thú vị và thoả sức sáng tạo lịch trình cho riêng mình tại FVenue</div>
          <div className="space-x-2">
            <Facebook className="cursor-pointer" />
            <Instagram className="cursor-pointer" />
            <Pinterest className="cursor-pointer" />
            <X className="cursor-pointer" />
            <YouTube className="cursor-pointer" />
          </div>
        </div>
        <div className="flex w-[20%] flex-col gap-4 text-gray-200">
          <span className="whitespace-nowrap text-xl font-bold">About us</span>
          <div className="flex flex-col gap-2">
            <div>Privacy Policy</div>
            <div>Terms</div>
            <div>Contact Us</div>
          </div>
        </div>
      </div>
      <div className="mt-20 text-gray-200">
        &copy; {currentYear} <a href="https://material-tailwind.com/">Fvenue</a>. All Rights Reserved.
      </div>
    </footer>
  )
}
