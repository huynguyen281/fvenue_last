import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IVenueManager } from 'src/types'
import { z } from 'zod'
import { UpdateVenueSchema } from './validation'
import { toast } from 'src/components/ui/use-toast'
import {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from 'src/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'src/components/ui/command'
import { Button } from 'src/components/ui/button'
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { updateVenueApi } from 'src/api/venue/update-venue'
import { getVenueId } from 'src/api/venue/getById'
import { Ward } from 'src/types/ward'
import { getWards } from 'src/api/ward/get-ward'
type FormData = z.infer<typeof UpdateVenueSchema>

export function UpdateVenue({ Id }: { Id: string }) {
  const queryClient = useQueryClient()
  const [venue, setVenue] = useState<IVenueManager | undefined>(undefined)

  const form = useForm<FormData>({
    resolver: zodResolver(UpdateVenueSchema),
    defaultValues: {
      Name: venue?.Name || '',
      Description: venue?.Description || '',
      Street: venue?.Street || '',
      LowerPrice: venue?.LowerPrice || '',
      UpperPrice: venue?.UpperPrice || '',
      Image: venue?.Image,
      GeoLocation: venue?.GeoLocation || '',
      OpenTime: venue?.OpenTime || '',
      CloseTime: venue?.CloseTime || '',
    },
  })

  const { mutate: updateVenue } = useMutation({
    mutationFn: (updatedData: FormData) => {
      const formData = {
        ...updatedData,
        Image: updatedData.Image,
      }
      return updateVenueApi(formData)
    },
    onSuccess: (updatedVenue) => {
      toast({
        title: 'Successful!!',
        description: 'Update venue Success',
      })
      setVenue(updatedVenue)
      queryClient.invalidateQueries()
    },
    onError: () => {
      toast({
        title: 'Error updating venue',
      })
    },
  })

  const fetchDataAndUpdateForm = async () => {
    try {
      // const userString: string | null = localStorage.getItem('user')
      // const users = userString && JSON.parse(userString)
      // const userId = users && users.Id
      const fetchedVenue: IVenueManager = await getVenueId(Id)
      const venueId = fetchedVenue?.Id
      if (fetchedVenue && fetchedVenue.Id) {
        setVenue(fetchedVenue)
        form.reset(fetchedVenue)
      } else {
        toast({
          title: 'Invalid venue response',
          description: 'No venue ID in the response.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error venue detail',
      })
    }
  }

  useEffect(() => {
    fetchDataAndUpdateForm()
  }, [Id]) // Add key as dependency

  const [wards, setWards] = useState<Ward[]>([]) // Khai báo trạng thái để lưu trữ danh sách phường

  // Gọi hàm để lấy danh sách phường khi thành phần được tạo
  useEffect(() => {
    const fetchWardsData = async () => {
      try {
        const fetchedWards = await getWards() // Gọi hàm để lấy danh sách phường từ API
        setWards(fetchedWards) // Cập nhật trạng thái với danh sách phường đã lấy được
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phường:', error)
      }
    }

    fetchWardsData() // Gọi hàm để lấy danh sách phường khi thành phần được tạo
  }, [])

  const onSubmit = (data: FormData) => {
    console.log(wards)
    const updatedData: Partial<FormData> = {}
    updatedData.Name = data.Name as string
    updatedData.Description = data.Description as string
    updatedData.Image = data.Image as File
    updatedData.Street = data.Street as string
    updatedData.LowerPrice = data.LowerPrice as string
    updatedData.UpperPrice = data.UpperPrice as string
    updatedData.GeoLocation = data.GeoLocation as string
    updatedData.OpenTime = data.OpenTime as string
    updatedData.CloseTime = data.CloseTime as string
    updateVenue(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Cập nhật</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật địa điểm</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="m-4 mx-auto w-full max-w-sm space-y-4 rounded-lg border border-gray-200 p-4"
              >
                <FormField
                  control={form.control}
                  name="Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Name </FormLabel>
                      <FormControl>
                        <Input defaultValue={venue?.Name} {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Description </FormLabel>
                      <FormControl>
                        <Input defaultValue={venue?.Description} {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Image </FormLabel>
                      <FormLabel>
                        <img width="50px" src={venue?.Image as string} />
                      </FormLabel>
                      <FormControl>
                        <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0] || null)} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="LowerPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> LowerPrice </FormLabel>
                      <FormControl>
                        <Input defaultValue={venue?.LowerPrice} {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="UpperPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> UpperPrice </FormLabel>
                      <FormControl>
                        <Input defaultValue={venue?.UpperPrice} {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Street </FormLabel>
                      <FormControl>
                        <Input defaultValue={venue?.Street} {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="WardId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> WardId </FormLabel>
                      <FormControl>
                        <Command>
                          <CommandInput placeholder="Search framework..." className="h-9" />
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {wards.map((ward) => (
                              <CommandItem
                                key={ward.Id}
                                value={ward.Id}
                                onSelect={(currentValue) => {
                                  // setValue(currentValue === value ? '' : currentValue)
                                  // setOpen(false)
                                }}
                              >
                                {ward.Name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="GeoLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> GeoLocation </FormLabel>
                      <FormControl>
                        <Input defaultValue={venue?.GeoLocation} {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="OpenTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> OpenTime </FormLabel>
                      <FormControl>
                        <Input type="time" defaultValue={venue?.OpenTime} {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="CloseTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> CloseTime </FormLabel>
                      <FormControl>
                        <Input type="time" defaultValue={venue?.CloseTime} {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <DialogFooter className="sm:justify-start">
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                    <DialogClose>Close</DialogClose>
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
