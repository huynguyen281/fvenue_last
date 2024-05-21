type Props = {
  userName: string
  avatar: string
  email: string
}

function UserAvatar({ userName, avatar, email, ...props }: Props) {
  avatar =
    avatar == ''
      ? 'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg'
      : avatar
  return (
    <div className="flex h-full max-h-full max-w-full items-center justify-center gap-8">
      <img className="aspect-square h-36 rounded-full border border-gray-200 bg-gray-100 p-1" src={avatar} />
      <div className="just flex flex-col items-start justify-center gap-4">
        <span className="text-3xl font-bold">{userName}</span>
        <span className="flex items-center gap-2 text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              className="fill-gray-500"
              d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7.175q.125 0 .263-.038t.262-.112L19.6 8.25q.2-.125.3-.312t.1-.413q0-.5-.425-.75T18.7 6.8L12 11L5.3 6.8q-.45-.275-.875-.012T4 7.525q0 .25.1.438t.3.287l7.075 4.425q.125.075.263.113t.262.037"
            />
          </svg>
          {email}
        </span>
      </div>
    </div>
  )
}

export default UserAvatar
