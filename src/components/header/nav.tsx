import AuthPreview from './auth-preview'
function Navigation() {
  return (
    <div className="m-1 flex items-center justify-end">
      <div className="flex justify-between">
        <div className="mr-4 flex items-center justify-center">
          <AuthPreview />
        </div>
      </div>
    </div>
  )
}
export default Navigation
