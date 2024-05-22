import { Mail, MessageCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

function Help() {
  return (
    <div className="custom-dialog">
      {' '}
      <Dialog>
        <DialogTrigger className="flex">
          <p className="hidden-on-mobile">Trợ Giúp</p>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Contact with us</DialogTitle>
            <DialogDescription className="flex flex-col space-y-4">
              <div className="flex items-center">
                <Mail />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="ml-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center">
                <MessageCircle />
                <input
                  type="message"
                  placeholder="Leave the message !"
                  className="ml-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
                Submit
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Help
