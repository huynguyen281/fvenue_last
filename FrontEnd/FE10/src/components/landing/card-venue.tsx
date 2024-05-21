import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '../ui/card'
import { IVenue } from 'src/types/venue'

type Props = { venue: IVenue }
function Venue({ venue }: Props) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi', { style: 'currency', currency: 'VND' })
  }
  return (
    <div>
      <Link to={`/venue/${venue.Id}`} key={venue.Id} style={{ textDecoration: 'none' }}>
        <Card className="h-full lg:w-[14.5rem]">
          <CardTitle className="aspect-[1] overflow-hidden rounded-bl-none rounded-br-none rounded-tl-md rounded-tr-md border-transparent p-0 shadow-md transition-all duration-300 group-hover:shadow-xl">
            <img
              src={venue.Image}
              alt={venue.Name}
              className="aspect-[1] object-cover transition-all duration-300"
              style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
            />
          </CardTitle>
          <CardContent className="p-0 lg:p-2 lg:text-lg">
            <strong
              style={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxHeight: '2.2em',
              }}
            >
              {venue.Name}
            </strong>
            <CardDescription
              className="text-blue-500"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxHeight: '1.2em' }}
            >
              {venue.Street ? venue.Street : 'NA'}
            </CardDescription>
            <CardDescription
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxHeight: '1.2em' }}
            >
              {venue.Location}
            </CardDescription>
          </CardContent>
          <CardFooter className="bottom-1 bg-gray-100 p-2 text-red-700">
            {venue.LowerPrice === 0 && venue.UpperPrice === 0 ? (
              <span className="text-sm font-semibold text-green-700">Miễn phí</span>
            ) : (
              <span className="text-sm font-semibold text-amber-700">
                Giá khoảng: {formatCurrency(venue.LowerPrice)} - {formatCurrency(venue.UpperPrice)}
              </span>
            )}
          </CardFooter>
        </Card>
      </Link>
    </div>
  )
}

export default Venue
