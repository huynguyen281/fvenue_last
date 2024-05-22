import RegisterForm from 'src/components/auth/user-register-form'
import HomeButtton from 'src/components/ui/homebutton'
function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <HomeButtton className="absolute left-0 top-0 ml-4 mt-4" />
      <div className="container mx-auto flex max-w-md flex-col items-center p-10">
        <h1 className="mb-8 text-3xl font-bold">Đăng kí</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
