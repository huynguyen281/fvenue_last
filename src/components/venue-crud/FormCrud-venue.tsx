import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import { AxiosError } from 'axios'
import { IResponse } from 'src/types/response'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import HomeButtton from 'src/components/ui/homebutton'
import { IVenueManager } from 'src/types'
import { GetVenueOfManager } from 'src/api/venue/get-venuenbyAccount'
import UserAvatar from '../auth/user-avatar'
import { UpdateVenue } from './upate-venue'
// import { UpdateVenue } from './upate-venue'

function Formcrudvenue() {
  const userString: string | null = localStorage.getItem('user')
  const users = userString && JSON.parse(userString)
  const userId = users && users.Id
  const { data } = useQuery<IResponse<IVenueManager>, AxiosError>([], () => GetVenueOfManager(userId), {
    keepPreviousData: true,
    enabled: !!userId,
  })
  const venue = data?.Data as unknown as IVenueManager
  const { method } = useParams<{ method?: string }>()
  return (
    <>
      <div className="ml-10 mt-10">
        <HomeButtton />
      </div>

      <div className="flex h-screen flex-col">
        <div className="h-56 w-full bg-white">
          <UserAvatar avatar={venue?.Image ?? ''} userName={venue?.Name ?? 'Tên'} email={venue?.Location ?? ''} />
        </div>
        <Tabs defaultValue={method == 'transaction' ? 'transaction' : 'account'} className="w-full grow bg-gray-100">
          <div className="flex w-full items-center justify-center bg-white py-3">
            <TabsList className="grid w-2/5 grid-cols-2 bg-white">
              <TabsTrigger value="account" className="text-lg">
                Thông tin địa điểm
              </TabsTrigger>
              <TabsTrigger value="password" className="text-lg">
                Thống kê
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="account" className="mt-0 flex justify-center bg-gray-100">
            <Card className="my-6 w-1/2 rounded-lg border-none bg-white px-12 py-8 shadow-2xl">
              <CardHeader>
                <CardTitle>Địa điểm</CardTitle>
                <CardDescription>Thay đổi thông tin địa điểm của bạn ở đây, lưu khi cài đặt xong</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name">Tên địa điểm</Label>
                  <Input id="name" defaultValue="Không có" value={venue?.Name} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="Location">Toạ độ</Label>
                  <Input id="Location" defaultValue="None" value={venue?.GeoLocation} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Mô tả</Label>
                  <Input id="name" defaultValue="Pedro Quarte" value={venue?.Description} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Đường</Label>
                  <Input id="name" defaultValue="Pedro Quarte" value={venue?.Street} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Giá thấp nhất</Label>
                  <Input id="name" defaultValue="Pedro Quarte" value={venue?.LowerPrice} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Giá cao nhất</Label>
                  <Input id="name" defaultValue="Pedro Quarte" value={venue?.UpperPrice} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Giờ mở cửa</Label>
                  <Input id="name" defaultValue="Pedro Quarte" value={venue?.OpenTime} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Giờ đóng cửa</Label>
                  <Input id="name" defaultValue="Pedro Quarte" value={venue?.CloseTime} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Vé</Label>
                  <Input id="name" defaultValue="null" value={venue?.Items} />
                </div>
              </CardContent>
              <CardFooter className="mt-6 justify-between text-center">
                <Button className="rounded-full  bg-blue-500 ">Lưu</Button>
                <UpdateVenue Id={venue?.Id} />
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="mt-0 flex justify-center bg-gray-100">
            <Card className="my-6 w-1/2 rounded-lg border-none bg-white px-12 py-8 shadow-2xl">
              <CardHeader>
                <CardTitle>Thống kê tương tác</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Lượt like</Label>
                  <Input id="name" defaultValue="null" value={venue?.VenueLikes} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Lượt đánh giá</Label>
                  <Input id="name" defaultValue="null" value={venue?.VenueFeedbacks} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default Formcrudvenue
