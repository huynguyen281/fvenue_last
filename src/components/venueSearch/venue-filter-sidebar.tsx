import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { IComboboxData } from './search-subcategories'

import useGetAllSubCategory from 'src/pages/venue/useGetManySubCategory'
import { MultiSelect } from '../ui/muti-select'
type Props = {
  onFilterChange?: (filter: Record<string, unknown>) => void
  totalVenues?: number
  onRentAll?: () => void
}

const FilterSchema = z.object({
  GeoLocation: z.string().optional(),
  Radius: z.string().optional(),
  LowerPrice: z.string().optional(),
  UpperPrice: z.string().optional(),
  // SubCategoryIds: z.array(string()).optional(),
  SubCategoryIds: z.string().optional(),
})
type FilterForm = z.infer<typeof FilterSchema>

function VenueFilterSideBar({ onFilterChange, totalVenues }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { control, handleSubmit, reset, setValue, watch } = useForm<FilterForm>({
    resolver: zodResolver(FilterSchema),
  })
  const { isLoading: isSubCategoryLoading, data: subcategories } = useGetAllSubCategory()

  const subcategoriesCombobox = useMemo(() => {
    if (!subcategories) return []
    else
      return subcategories.map<IComboboxData>((ct) => ({
        label: ct.Name,
        value: ct.Id || '',
      }))
  }, [subcategories])
  const [selected, setSelected] = useState<string[]>([])
  const ct = selected.toString()
  const [isLocationAllowed, setIsLocationAllowed] = useState(false)

  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLocationAllowed(true)
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [searchParams])

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const GeoLocation = `${latitude},${longitude}`
          setValue('GeoLocation', GeoLocation)
        },
        (error) => {
          console.error('Error getting geolocation:', error)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  const onSubmit = React.useCallback((data: FilterForm) => {
    const { GeoLocation, Radius, LowerPrice, UpperPrice, SubCategoryIds } = data
    const searchParams = new URLSearchParams()
    GeoLocation && searchParams.set('GeoLocation', GeoLocation)
    Radius && searchParams.set('Radius', Radius)

    if (SubCategoryIds) {
      const subCategoryIdsArray = SubCategoryIds.split(',')
      searchParams.set('SubCategoryIds', subCategoryIdsArray.join(','))
    }

    LowerPrice && searchParams.set('LowerPrice', LowerPrice)
    UpperPrice && searchParams.set('UpperPrice', UpperPrice)

    setSearchParams(searchParams, { replace: true })

    if (onFilterChange && data.GeoLocation && data.GeoLocation != '') {
      onFilterChange(data)
    }
  }, [])
  const [clearFlag, setClearFlag] = useState(false)
  const onClear = React.useCallback(() => {
    reset()
    setClearFlag((prev) => !prev)
  }, [reset])

  return (
    <React.Fragment key={'sidebar.filter'}>
      {totalVenues && <p className="border-2 text-sm">{totalVenues} venues found</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
        <div className="flex flex-col gap-4">
          <span className="flex flex-row items-center">
            <p className="text-lg font-extrabold">Tìm kiếm địa điểm </p>
          </span>
          <Separator />
          <div>
            <Label htmlFor="category">Thể loại</Label>
            <MultiSelect
              options={subcategoriesCombobox}
              selected={selected}
              onChange={(selectedOptions: string[]) => {
                // Lưu giá trị của selected vào state selected
                setSelected(selectedOptions)
                // Chuyển giá trị của selectedOptions thành một chuỗi các ID phân tách bằng dấu phẩy
                const subCategoryIdsString = selectedOptions.join(',')
                // Đặt giá trị của SubCategoryIds trong form bằng chuỗi vừa tạo
                setValue('SubCategoryIds', subCategoryIdsString)
              }}
            />
          </div>

          <div>
            <Label htmlFor="search">Bán kính</Label>
            <Input
              placeholder="nhập bán kính địa điểm"
              id="Radius"
              {...control.register('Radius')}
              className="bg-card"
            />
          </div>
          <div>
            <Label htmlFor="price">Giá</Label>
            <div className="-center flex flex-row">
              <Input placeholder="From" id="LowerPrice" {...control.register('LowerPrice')} className="bg-card" />
              <p className="p-2">-</p>
              <Input placeholder="To" id="UpperPrice" {...control.register('UpperPrice')} className="bg-card" />
            </div>
          </div>
          <div aria-label="search">
            <Label htmlFor="search">Vị trí của bạn</Label>
            <Input
              placeholder="hãy chia sẽ vị trí của bạn"
              id="GeoLocation"
              {...control.register('GeoLocation')}
              className="bg-card"
            />
          </div>
          <Separator />
          <div className="flex justify-between">
            {/* <Button type="submit">Tìm ngay</Button>
            <Button variant={'ghost'} type="button" className="">
              xoá
            </Button> */}
            {isLocationAllowed && (
              <div>
                <Button onClick={getLocation}>Chia sẻ vị trí của bạn và tìm ngay</Button>
              </div>
            )}
          </div>
        </div>
      </form>
    </React.Fragment>
  )
}
export default VenueFilterSideBar
