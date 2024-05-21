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

export function CreateVenue() {
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    imageURL: '',
    address: '',
    district: '',
    coordinates: '',
    openingHours: '',
    closingHours: '',
    manager: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageURL = URL.createObjectURL(file)
      setFormData({
        ...formData,
        image: file,
        imageURL: imageURL,
      })
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission logic here
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Thêm địa điểm</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm địa điểm</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <form
              onSubmit={handleSubmit}
              className="m-4 mx-auto w-full max-w-sm space-y-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="max-h-96 overflow-y-auto">
                {' '}
                {/* Chiều cao cố định và cuộn */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Tên địa điểm
                    </label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Ảnh
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleChangeImage}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {formData.image && <img src={formData.imageURL} alt="Venue" className="mt-2 h-auto w-full" />}
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                      Quận
                    </label>
                    <Input id="district" name="district" value={formData.district} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700">
                      Toạ độ
                    </label>
                    <Input id="coordinates" name="coordinates" value={formData.coordinates} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700">
                      Giờ mở
                    </label>
                    <Input
                      id="openingHours"
                      name="openingHours"
                      value={formData.openingHours}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="closingHours" className="block text-sm font-medium text-gray-700">
                      Giờ đóng
                    </label>
                    <Input
                      id="closingHours"
                      name="closingHours"
                      value={formData.closingHours}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                      Người quản lí
                    </label>
                    <Input id="manager" name="manager" value={formData.manager} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <Button type="submit" className="w-full bg-blue-500">
                  Tạo
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
