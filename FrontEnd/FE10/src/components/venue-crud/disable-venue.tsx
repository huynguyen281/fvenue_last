import React, { useState } from 'react'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'

export function DisableVenuePopup() {
  const [reason, setReason] = useState('')

  const handleChangeReason = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value)
  }

  const handleReport = () => {
    // Handle report logic here
    console.log('Reported:', reason)
    // Close the dialog
    // setReason(''); // Clear the input field if needed
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ngưng hoạt động</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="ml-[9rem]">Xác nhận</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <form className="m-4 mx-auto w-full max-w-sm space-y-4 rounded-lg border border-gray-200 p-4">
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm text-gray-500">Bạn chắc chắn muốn tạm ngưng hoạt động của địa điểm này ?</h2>
                </div>
              </div>
              <DialogFooter className="ml-[9rem]">
                <Button onClick={handleReport} className=" bg-red-500">
                  Ngưng
                </Button>
                <DialogClose>Đóng</DialogClose>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
