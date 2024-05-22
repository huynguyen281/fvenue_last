import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'
import { Input } from 'src/components/ui/input'
import { Label } from 'src/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'
import UserAvatar from '../../../components/auth/user-avatar'
import UserTransaction from '../../../components/auth/user-transaction'
import { User } from 'src/types/user'
import { getUserApi } from 'src/api/user/get-user'
import { AxiosError } from 'axios'
import { IResponse } from '../../../types'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import HomeButtton from 'src/components/ui/homebutton'

function Profile() {
  const currentUser = JSON.parse(localStorage.getItem('user') ?? '') as User
  const { data } = useQuery<IResponse<User>, AxiosError>([], () => getUserApi(currentUser.Id ?? ''), {
    keepPreviousData: true,
    enabled: !!currentUser,
  })
  const user = data?.Data as User

  const { method } = useParams<{ method?: string }>()
  return (
    <>
      <div className="ml-10 mt-10">
        <HomeButtton />
      </div>

      <div className="flex h-screen flex-col">
        <div className="h-56 w-full bg-white">
          <UserAvatar avatar={user?.Image ?? ''} userName={user?.FullName ?? 'User Name'} email={user?.Email ?? ''} />
        </div>
        <Tabs defaultValue={method == 'transaction' ? 'transaction' : 'account'} className="w-full grow bg-gray-100">
          <div className="flex w-full items-center justify-center bg-white py-3">
            <TabsList className="grid w-3/5 grid-cols-3 bg-white">
              <TabsTrigger value="account" className="text-lg">
                Tài khoản
              </TabsTrigger>
              <TabsTrigger value="password" className="text-lg">
                Mật khẩu
              </TabsTrigger>
              <TabsTrigger value="transaction" className="text-lg">
                Giao dịch
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="account" className="mt-0 flex justify-center bg-gray-100">
            <Card className="my-6 w-1/2 rounded-lg border-none bg-white px-12 py-8 shadow-2xl">
              <CardHeader>
                <CardTitle>Tài khoản</CardTitle>
                <CardDescription>Thay đổi thông tin tài khoản ở đây, lưu khi cài đặt xong</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input id="name" defaultValue="Không có" value={user?.FullName} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Giới tính</Label>
                  <Input id="name" defaultValue="None" value="Nam" />
                </div>
                {/* <div className="space-y-1">
      <Label htmlFor="name">Location</Label>
      <Input id="name" defaultValue="Pedro Quarte" />
    </div> */}
                <div className="space-y-1">
                  <Label htmlFor="name">Số điện thoại</Label>
                  <Input id="name" defaultValue="Pedro Quarte" value={user?.PhoneNumber} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Email</Label>
                  <Input id="name" defaultValue="Pedro Quarte" value={user?.Email} />
                </div>
                {/* <div className="space-y-1">
      <Label htmlFor="username">Username</Label>
      <Input id="username" defaultValue="@pedate" />
    </div> */}
              </CardContent>
              <CardFooter className="mt-4 text-center">
                <Button className="rounded-full">Lưu</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="mt-0 flex justify-center bg-gray-100">
            <Card className="my-6 w-1/2 rounded-lg border-none bg-white px-12 py-8 shadow-2xl">
              <CardHeader>
                <CardTitle>Mật khẩu</CardTitle>
                <CardDescription>
                  Thay đổi mật khẩu của bạn ở đây, sau khi thay đổi bạn sẽ phải đăng nhập lại
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Mật khẩu hiện tại</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="mr-10 space-y-1">
                  <Label htmlFor="new">Mật khẩu mới</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter className="mt-4 text-center">
                <Button className="rounded-full bg-blue-500 ">Thay đổi</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="transaction" className="mt-0 flex justify-center bg-gray-100">
            <UserTransaction userId={currentUser.Id ?? ''} userRole={user?.RoleName ?? ''}></UserTransaction>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default Profile
