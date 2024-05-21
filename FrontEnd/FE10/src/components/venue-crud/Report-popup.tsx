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

export function ReportVenuePopup() {
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
        <Button variant="outline">Báo cáo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Báo cáo địa điểm</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <form className="m-4 mx-auto w-full max-w-sm space-y-4 rounded-lg border border-gray-200 p-4">
              <div className="space-y-4">
                <div>
                  <select
                    id="mainCategory"
                    name="mainCategory"
                    // value={formData.mainCategory}
                    // onChange={handleChange}
                    className="mt-1 block h-[3rem] w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    {/* Placeholder option */}
                    {/* Các option thể loại chính - thay thế bằng dữ liệu thực từ API */}
                    <option value="category1">Giá không đúng</option>
                    <option value="category2">Địa chỉ sai</option>
                    <option value="category3">Thông tin không khớp với trên web</option>
                  </select>
                </div>
                <div>
                  <h2 className="text-sm text-gray-500">
                    Fvenue sẽ kiểm tra và phản hồi sớm nhất có thể về địa điểm mà bạn báo cáo. Xin cảm ơn !
                  </h2>
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <Button onClick={handleReport} className=" bg-red-500">
                  Báo cáo
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
