import { ColumnDef } from '@tanstack/react-table'
import { Button } from 'src/components/ui/button'
import { IVenue } from 'src/types/venue'

export const columns: ColumnDef<IVenue>[] = [
  {
    accessorKey: 'Name',
    header: 'Tên Địa Điểm',
    cell({ getValue }) {
      const name: string = getValue() as string
      return <h3 className="max-w-[8rem] text-black">{name}</h3>
    },
  },
  {
    accessorKey: 'Image',
    header: 'Image',
    cell({ getValue }) {
      const Image: string = getValue() as string
      return <img src={Image} className=" h-[6rem] max-w-[6rem] text-black"></img>
    },
  },
  {
    accessorKey: 'Street',
    header: 'Đường',
    cell({ getValue }) {
      const Street: string = getValue() as string
      return <p className="max-w-[8rem] text-black">{Street ? Street : 'None'}</p>
    },
  },
  {
    accessorKey: 'Location',
    header: 'Địa Chỉ',
    cell({ getValue }) {
      const Location: string = getValue() as string
      return <p className="max-w-[8rem] text-black">{Location}</p>
    },
  },
  {
    accessorKey: 'OpenTime',
    header: 'Giờ Hoạt Động',
    cell({ getValue }) {
      const OpenTime: string = getValue() as string
      return <p className="max-w-[30rem] text-black">{OpenTime}</p>
    },
  },
  {
    accessorKey: 'CloseTime',
    header: 'Giờ Đóng',
    cell({ getValue }) {
      const CloseTime: string = getValue() as string
      return <p className="max-w-[30rem] text-black">{CloseTime}</p>
    },
  },
  {
    accessorKey: 'GeoLocation',
    header: 'Toạ Độ',
    cell({ getValue }) {
      const GeoLocation: string = getValue() as string
      return <p className="max-w-[30rem] text-black">{GeoLocation}</p>
    },
  },
  {
    accessorKey: 'LowerPrice',
    header: 'Giá Nhỏ nhất',
    cell({ getValue }) {
      const LowerPrice: string = getValue() as string
      return <p className="max-w-[30rem] text-black">{LowerPrice}</p>
    },
  },
  {
    accessorKey: 'UpperPrice',
    header: 'Giá Cao Nhất',
    cell({ getValue }) {
      const UpperPrice: string = getValue() as string
      return <p className="max-w-[30rem] text-black">{UpperPrice}</p>
    },
  },
  {
    accessorFn: ({ Id }) => Id,
    header: 'Action',
    cell() {
      return (
        <div className="flex gap-2 ">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            Delete
          </Button>
        </div>
      )
    },
  },
]
