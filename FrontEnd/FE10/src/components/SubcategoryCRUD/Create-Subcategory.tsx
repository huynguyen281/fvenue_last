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
import { Input } from 'src/components/ui/input'

export function CreateSubcategory() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission logic here
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Thêm thể loại phụ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm thể loại phụ</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <form
              onSubmit={handleSubmit}
              className="m-4 mx-auto w-full max-w-sm space-y-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Tên
                  </label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="mainCategory" className="block text-sm font-medium text-gray-700">
                    Thể loại chính
                  </label>
                  <select
                    id="mainCategory"
                    name="mainCategory"
                    // value={formData.mainCategory}
                    // onChange={handleChange}
                    className="mt-1 block h-[3rem] w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    {/* Placeholder option */}
                    <option value="">Chọn thể loại chính</option>
                    {/* Các option thể loại chính - thay thế bằng dữ liệu thực từ API nếu có */}
                    <option value="category1">Ẩm thực</option>
                    <option value="category2">Thức Uống</option>
                    <option value="category3">Giải trí về đêm</option>
                  </select>
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <Button type="submit" className="w-full bg-blue-500">
                  Lưu
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
