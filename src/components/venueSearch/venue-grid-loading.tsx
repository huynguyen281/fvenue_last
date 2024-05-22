import { Skeleton } from '../ui/skeleton'

type Props = {
  PageSize: number
} & React.HTMLAttributes<HTMLDivElement>

function VenueGridLoading({ PageSize, ...props }: Props) {
  return (
    <div {...props}>
      {Array.from({ length: PageSize }).map((_, index) => {
        return (
          <div key={index} className="h-full">
            <Skeleton className="aspect-[7/7] h-full" />
          </div>
        )
      })}
    </div>
  )
}

export default VenueGridLoading
