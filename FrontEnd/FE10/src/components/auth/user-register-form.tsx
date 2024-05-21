import { zodResolver } from '@hookform/resolvers/zod'
import { IconReload } from '@tabler/icons-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { toast } from 'src/components/ui/use-toast'
import { RegisterSchema } from 'src/pages/(auth)/register/validation'
import { signUpApi } from 'src/api/apis/auth/sign-up'

type FormData = z.infer<typeof RegisterSchema>
function RegisterForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {},
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const navigate = useNavigate()
  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    await signUpApi(data, (err) => {
      if (err) {
        toast({
          title: 'Error',
          description: err.response?.data.message,
          variant: 'destructive',
        })
        return
      }
      toast({
        title: 'Success',
        description: 'Đăng kí thành công',
        variant: 'success',
      })
      navigate('/login')
    })
    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-sm space-y-4">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="Email"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Email </FormLabel>
                <FormControl>
                  <Input disabled={isLoading} type="email" placeholder="example@mail.com" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="PhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Số điện thoại </FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="+84 1234567890" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Username </FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="sacom23" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="LastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Tên </FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="last name" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="FirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Họ </FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="first name" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="Gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Giới tính </FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="Gender" type="Gender" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Password"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Mật khẩu </FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="*******" type="password" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ConfirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Xác nhận mật khẩu </FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="*******" type="password" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Avatar </FormLabel>
              <FormControl>
                <input disabled={isLoading} type="file" {...field} accept="image/*" />
              </FormControl>
              <FormDescription>Chọn file để làm ảnh đại diện</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit" className="w-full bg-blue-700">
          {isLoading && <IconReload className="mr-2 h-5 w-5 animate-spin" />}
          Đăng kí{' '}
        </Button>
        <p className="text-center text-sm">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-700">
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </Form>
  )
}

export default RegisterForm
