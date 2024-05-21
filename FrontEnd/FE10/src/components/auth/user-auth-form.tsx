import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandGoogle, IconReload } from '@tabler/icons-react'
import React from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Checkbox } from 'src/components/ui/check-box'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { Button } from 'src/components/ui/button'
import { LoginSchema } from 'src/pages/(auth)/login/validation'
import { profileApi } from 'src/api/apis/auth/profile.api'
import { loginApi } from 'src/api/apis/auth/login.api'
import { toast } from '../ui/use-toast'

type FormData = z.infer<typeof LoginSchema>
function UserAuthForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      Remember: false,
    },
  })
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = React.useState(false)
  const { login } = useAuth()
  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    let id = 0
    let token = ''
    let error: AxiosError | null = null
    await loginApi(data, (err, data) => {
      if (err) {
        error = err
        return
      } else {
        toast({
          title: 'Login Success',
          variant: 'success',
        })
        id = data?.Data.Id as number
        token = data?.Data.Token as string
      }
    })
    if (!error) {
      await profileApi(id, token, (err, user) => {
        if (err) {
          toast({
            title: err.message,
            variant: 'destructive',
          })
        } else {
          if (!user) {
            return
          }
          toast({
            title: 'Đăng nhập thành công',
            variant: 'success',
          })
          login({
            user,
            token,
          })
          navigate('/')
        }
      })
    }
    if (error) {
      toast({
        title: 'Đăng nhập thất bại',
        variant: 'destructive',
      })
    }
    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-sm space-y-4">
        <FormField
          control={form.control}
          name="Email"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Email </FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="example@mail.com" {...field} />
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
          name="Remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
              </FormControl>
              <FormLabel>Ghi nhớ tôi</FormLabel>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Button disabled={isLoading} type="submit" className="w-full bg-blue-700">
            {isLoading && <IconReload className="mr-2 h-5 w-5 animate-spin" />}
            Đăng nhập
          </Button>
          <div className="flex justify-between text-xs">
            <Link to="/register" className="text-blue-500">
              Đăng kí ngay
            </Link>
            <Link to="/forgot" className="text-blue-500">
              Quên mật khẩu ?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Hoặc tiếp tục với</span>
            </div>
          </div>
          <div className="flex gap-2">
            {/* <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading && <IconReload className="mr-2 h-5 w-5 animate-spin" />}
              <IconBrandFacebook className="mr-2 h-5 w-5" />
              Facebook
            </Button> */}
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading && <IconReload className="mr-2 h-5 w-5 animate-spin " />}
              <IconBrandGoogle className="mr-2 h-5 w-5" />
              Google
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default UserAuthForm
